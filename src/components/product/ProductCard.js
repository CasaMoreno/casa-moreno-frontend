import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import apiClient from '@/api/axios';
import Button from '../common/Button';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

const PromoRibbon = styled.div`
  position: absolute;
  top: 12px;
  left: -34px;
  transform: rotate(-45deg);
  width: 130px;
  padding: 3px 0;
  background-color: #ffc107;
  color: #333;
  text-align: center;
  font-weight: bold;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  z-index: 6;
`;


const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1rem 0 1rem;
  min-height: 28px;
`;

const AdminActions = styled.div`
  display: flex;
  gap: 0.5rem;
  z-index: 10;
  position: relative;
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
  padding: 0.5rem;
`;

const CardContent = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem; 
  height: 44px;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.darkGray};
`;

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
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(1px);
  color: ${({ theme }) => theme.colors.darkGray};
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
  z-index: 5;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
`;

const PriceWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
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
  `}
`;

const ActionWrapper = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  z-index: 10;
  position: relative;
`;

const OverlayText = styled.p`
  margin: 2px 0;
  font-size: 0.8rem;
  font-family: 'Verdana', sans-serif;
  font-weight: normal;
`;

const OverlayLink = styled.span`
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

const ProductLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
`;

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { showConfirmation, showNotification } = useNotification();

  const { productTitle, currentPrice, galleryImageUrls, productCondition, productId } = product;
  const imageUrl = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls[0] : '/placeholder.png';

  const linkHref = user ? `/product/${product.productId}` : '/auth/login';

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    showConfirmation({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja deletar o produto: "${productTitle}"?`,
      onConfirm: async () => {
        try {
          await apiClient.delete(`/products/delete/${productId}`);
          showNotification({ title: 'Sucesso', message: 'Produto deletado com sucesso!' });
          router.reload();
        } catch (error) {
          showNotification({ title: 'Erro', message: 'Não foi possível deletar o produto.' });
        }
      }
    });
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/admin/edit/${product.productId}`);
  };

  return (
    <Card>
      {product.isPromotional && <PromoRibbon>Promo</PromoRibbon>}

      <CardHeader>
        {user && user.scope === 'ADMIN' ? (
          <AdminActions>
            <EditButton onClick={handleEditClick}>Editar</EditButton>
            <DeleteButton onClick={handleDelete}>Deletar</DeleteButton>
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

      <ProductLink href={linkHref}>
        <ImageWrapper>
          <Image src={imageUrl} alt={productTitle} fill style={{ objectFit: 'contain' }} />
        </ImageWrapper>

        <CardContent>
          <ProductTitle>{productTitle}</ProductTitle>
          <PriceWrapper>
            <Price isBlurred={!user}>
              R$ {currentPrice?.toFixed(2).replace('.', ',')}
            </Price>
          </PriceWrapper>

          {/* Botão para usuários logados */}
          {user && (
            <ActionWrapper>
              {/* O botão agora não tem mais um onClick próprio, ele seguirá o link do container pai */}
              <Button style={{ width: '100%' }}>
                Ver Detalhes
              </Button>
            </ActionWrapper>
          )}
        </CardContent>

        <LoginOverlay isVisible={!user}>
          <OverlayText>
            <OverlayLink>Faça login</OverlayLink>
            ou
            <OverlayLink onClick={(e) => { e.stopPropagation(); e.preventDefault(); router.push('/auth/register'); }}>
              cadastre-se
            </OverlayLink>
          </OverlayText>
          <OverlayText>
            para ver os detalhes
          </OverlayText>
        </LoginOverlay>
      </ProductLink>
    </Card>
  );
}

export default ProductCard;