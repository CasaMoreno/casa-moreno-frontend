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
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;

const CardContent = styled.div`
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
`;

const Price = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  margin: auto 0 1rem 0;
`;

const ProductCard = ({ product }) => {
    const { productTitle, currentPrice, galleryImageUrls, affiliateLink } = product;
    const imageUrl = galleryImageUrls && galleryImageUrls.length > 0 ? galleryImageUrls[0] : '/placeholder.png';

    return (
        <Card>
            <ImageWrapper>
                <Image src={imageUrl} alt={productTitle} fill style={{ objectFit: 'contain' }} />
            </ImageWrapper>
            <CardContent>
                <h3>{productTitle}</h3>
                <Price>R$ {currentPrice?.toFixed(2)}</Price>
                <a href={affiliateLink} target="_blank" rel="noopener noreferrer">
                    <Button style={{ width: '100%' }}>Ver Oferta</Button>
                </a>
            </CardContent>
        </Card>
    )
}

export default ProductCard;