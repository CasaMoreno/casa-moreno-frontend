import styled, { keyframes } from 'styled-components';
import Link from 'next/link';

// Animação de rolagem contínua
const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const MarqueeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  padding: 0.8rem 0;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

const MarqueeContent = styled.div`
  display: flex;
  width: fit-content;
  animation: ${scroll} 150s linear infinite;

  /* O seletor hover foi removido daqui para que a animação não pause mais */
`;

const ProductItem = styled(Link)`
  color: ${({ theme }) => theme.colors.darkGray};
  font-family: 'Courier New', Courier, monospace;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  margin: 0 3rem; 
  transition: color 0.2s ease;
  display: inline-flex; 
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const Thumbnail = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 1rem;
  object-fit: contain;
  border-radius: 3px;
`;

const Marquee = ({ products }) => {
    if (!products || products.length === 0) {
        return null;
    }

    const getThumbnailUrl = (product) => {
        return product.galleryImageUrls && product.galleryImageUrls.length > 0
            ? product.galleryImageUrls[0]
            : '/placeholder.png';
    };

    const marqueeItems = [...products, ...products].map((product, index) => (
        <ProductItem href={`/product/${product.productId}`} key={`${product.productId}-${index}`}>
            <Thumbnail src={getThumbnailUrl(product)} alt={product.productTitle} />
            {product.productTitle}
        </ProductItem>
    ));

    return (
        <MarqueeContainer>
            <MarqueeContent>
                {marqueeItems}
            </MarqueeContent>
        </MarqueeContainer>
    );
};

export default Marquee;