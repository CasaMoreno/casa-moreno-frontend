// src/components/product/ProductCard.js (VERSÃO ATUALIZADA COM CONTROLES DE ADMIN)

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
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  min-height: 28px; /* Evita que o layout mude caso os botões não apareçam */
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

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  margin-bottom: 1rem;
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
        router.reload(); // Recarrega a página para atualizar a lista
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
          <div /> /* Elemento vazio para manter o alinhamento do badge à direita */
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
      <CardContent>
        <h3>{productTitle}</h3>
        <Price>R$ {currentPrice?.toFixed(2).replace('.', ',')}</Price>

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