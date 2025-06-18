// src/components/product/ProductCard.js (VERSÃO COM ETIQUETA ACIMA DA IMAGEM)

import styled from 'styled-components';
import Image from 'next/image';
import Button from '../common/Button';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 1rem; // Adicionado um padding geral ao card
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const CardContent = styled.div`
  padding-top: 1rem; // Apenas padding no topo para separar do conteúdo acima
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
  margin-bottom: 1rem; // Adiciona margem para separar do botão
`;

// ESTILO ATUALIZADO para a nova posição
const ConditionBadge = styled.span`
  display: inline-block;
  align-self: end; // Alinha a etiqueta à esquerda do card
  margin-bottom: 0.75rem; // Espaço entre a etiqueta e a imagem

  background-color: ${({ condition, theme }) => (condition === 'Novo' ? theme.colors.primaryBlue : '#6c757d')};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

const ProductCard = ({ product }) => {
  const { productTitle, currentPrice, galleryImageUrls, affiliateLink, productCondition } = product;
  const imageUrl = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls[0] : '/placeholder.png';

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
        <Price>R$ {product.currentPrice?.toFixed(2)}</Price>

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