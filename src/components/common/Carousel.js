import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import styled from 'styled-components';
import ProductCard from '@/components/product/ProductCard';

// Importa os estilos essenciais do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const CarouselContainer = styled.div`
  max-width: 100%;
  padding: 0;

  .swiper {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 30px;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px; /* Largura padrão para desktop */
    transition: transform 0.4s ease-in-out; 
  }
  
  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.7;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: ${({ theme }) => theme.colors.primaryBlue};
    top: 45%;
    
    &:after {
        font-size: 2rem;
        font-weight: bold;
    }
  }

  /* --- INÍCIO DA ALTERAÇÃO --- */
  @media ${({ theme }) => theme.breakpoints.tablet} {
    .swiper-slide {
      width: 280px; /* Largura intermediária para tablet */
    }
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    .swiper-slide {
      width: 240px; /* Largura menor para celular */
    }

    .swiper-button-next,
    .swiper-button-prev {
      display: none;
    }
  }
  /* --- FIM DA ALTERAÇÃO --- */
`;

const Carousel = ({ products }) => {
  if (!products || products.length === 0) {
    return <p style={{ textAlign: 'center' }}>Nenhuma oferta encontrada no momento.</p>;
  }

  return (
    <CarouselContainer>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        slideToClickedSlide={true}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        navigation={true}
        modules={[EffectCoverflow, Navigation]}
        className="mySwiper"
      >
        {products.map(product => (
          <SwiperSlide key={product.productId}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </CarouselContainer>
  );
};

export default Carousel;