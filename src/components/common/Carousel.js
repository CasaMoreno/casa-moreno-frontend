// src/components/common/Carousel.js (VERSÃO COM EFEITO COVERFLOW)

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import styled from 'styled-components';
import ProductCard from '@/components/product/ProductCard';

// Importa os estilos essenciais do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

const CarouselContainer = styled.div`
  max-width: 100%; /* Ocupa a largura total da seção para melhor efeito */
  padding: 2rem 0;

  .swiper {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 50px;
  }

  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px; /* Largura do card central */
    
    /* Efeito de transição para os slides não ativos */
    transition: transform 0.4s ease-in-out; 
  }
  
  .swiper-slide-prev,
  .swiper-slide-next {
    opacity: 0.7; /* Deixa os slides laterais um pouco mais transparentes */
  }

  /* Estilizando as setas de navegação do Swiper */
  .swiper-button-next,
  .swiper-button-prev {
    color: ${({ theme }) => theme.colors.primaryBlue};
    top: 45%; /* Ajusta a altura das setas */
    
    &:after {
        font-size: 2rem; /* Tamanho do ícone da seta */
        font-weight: bold;
    }
  }
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
                loop={true} // Faz o carrossel girar infinitamente
                coverflowEffect={{
                    rotate: 30,       // Rotação dos slides laterais
                    stretch: 0,       // Distância entre os slides
                    depth: 100,       // Profundidade do efeito 3D
                    modifier: 1,      // Multiplicador do efeito
                    slideShadows: true, // Adiciona sombras para dar profundidade
                }}
                navigation={true} // Habilita as setas de navegação
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