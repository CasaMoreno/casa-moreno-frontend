// src/components/product/ProductCard.js (VERSÃO COM OVERLAY AJUSTADO)

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/api/axios';
import Button from '../common/Button';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  min-height: 28px;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AdminButton = styled(Button)`
  padding: 4px 8px;
  font-size: 0.8rem;
  line-height: 1.2;
`;

const EditButton = styled(AdminButton)``;

const DeleteButton = styled(AdminButton)`
  background-color: #c82333;
  &:hover {
    background-color: #a71d2a;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const PromotionBanner = styled.div`
  background-color: #ffc107;
  color: #333; 
  text-align: center;
  padding: 4px 8px;
  margin-top: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  border-radius: 3px;
`;


const CardContent = styled.div`
  padding-top: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem; 
    height: 44px;
    overflow: hidden;
  }
`;

// NOVO: Mensagem de sobreposição (agora é uma div)
const LoginOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  text-align: center;
  border-radius: 4px;
  cursor: default;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 5px;
`;

const PriceWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;

  /* Faz o overlay aparecer quando o mouse está sobre o wrapper */
  &:hover ${LoginOverlay} {
      opacity: 1;
  }
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: filter 0.3s ease;
  margin: 0;

  ${({ isBlurred }) => isBlurred && `
    filter: blur(5px);
    -webkit-filter: blur(5px);
    user-select: none;
    pointer-events: none;
  `}
`;

// NOVO: Estilos para o texto e os links no overlay
const OverlayText = styled.p`
  margin: 2px 0;
  font-size: 0.8rem; /* Letra menor */
  font-family: 'Verdana', sans-serif; /* Fonte diferente */
  font-weight: normal;
`;

const OverlayLink = styled.a`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  text-decoration: underline;
  cursor: pointer;
  margin: 0 4px;
`;


const ConditionBadge = styled.span`
  display: inline-block;
  background-color: ${({ condition }) => (condition === 'Novo' ? '#198754' : '#6c757d')};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;


const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const router = useRouter();

  const { productTitle, currentPrice, galleryImageUrls, affiliateLink, productCondition, productId } = product;
  const imageUrl = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls[0] : '/placeholder.png';

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja deletar o produto: "${productTitle}"?`)) {
      try {
        await apiClient.delete(`/products/delete/${productId}`);
        alert('Produto deletado com sucesso!');
        router.reload();
      } catch (error) {
        console.error("Falha ao deletar o produto", error);
        alert("Não foi possível deletar o produto.");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        {user && user.scope === 'ADMIN' ? (
          <AdminActions>
            <Link href={`/admin/edit/${product.productId}`} passHref legacyBehavior>
              <EditButton as="a">Editar</EditButton>
            </Link>
            <DeleteButton onClick={handleDelete}>
              Deletar
            </DeleteButton>
          </AdminActions>
        ) : (
          <div />
        )}

        {productCondition && (
          <ConditionBadge condition={productCondition}>
            {productCondition}
          </ConditionBadge>
        )}
      </CardHeader>

      <ImageWrapper>
        <Image src={imageUrl} alt={productTitle} fill style={{ objectFit: 'contain' }} />
      </ImageWrapper>

      {product.isPromotional && <PromotionBanner>PROMOÇÃO</PromotionBanner>}

      <CardContent>
        <h3>{productTitle}</h3>

        <PriceWrapper>
          <Price isBlurred={!user}>
            R$ {currentPrice?.toFixed(2).replace('.', ',')}
          </Price>
          {!user && (
            <LoginOverlay>
              <OverlayText>
                <Link href="/auth/login" passHref legacyBehavior><OverlayLink>Faça login</OverlayLink></Link>
                ou
                <Link href="/auth/register" passHref legacyBehavior><OverlayLink>cadastre-se</OverlayLink></Link>
              </OverlayText>
              <OverlayText>
                para ver o preço
              </OverlayText>
            </LoginOverlay>
          )}
        </PriceWrapper>

        <div style={{ marginTop: 'auto' }}>
          <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
            <Button style={{ width: '100%' }}>Ver Oferta</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard;