// src/components/product/ProductCard.js (VERSÃO COM CONTROLES DE ADMIN)

import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth'; // NOVO: Para verificar se o usuário é admin
import apiClient from '@/api/axios'; // NOVO: Para chamar a API de deleção
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
  align-self: end;
  margin-bottom: 0.75rem;
  background-color: ${({ condition, theme }) => (condition === 'Novo' ? theme.colors.primaryBlue : '#6c757d')};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

// NOVO: Container para os botões de admin
const AdminActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

// NOVO: Estilo para o botão de deletar, para reutilizar
const DeleteButton = styled(Button)`
  background-color: #c82333;
  &:hover {
    background-color: #a71d2a;
  }
`;

const ProductCard = ({ product }) => {
  // LÓGICA PARA VERIFICAR O USUÁRIO E DELETAR PRODUTO
  const { user } = useAuth(); // Pega o usuário do contexto de autenticação
  const router = useRouter(); // Pega o router para recarregar a página após deletar

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
      {productCondition && (
        <ConditionBadge condition={productCondition}>
          {productCondition}
        </ConditionBadge>
      )}



      <ImageWrapper>
        <Image src={imageUrl} alt={productTitle} fill style={{ objectFit: 'contain' }} />
      </ImageWrapper>
      <CardContent>
        <h3>{productTitle}</h3>
        <Price>R$ {currentPrice?.toFixed(2)}</Price>

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