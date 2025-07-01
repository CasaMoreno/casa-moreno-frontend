import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import Carousel from '@/components/common/Carousel';

// --- Ícones para a Seção de Diferenciais ---
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
    <path d="M14 9h7c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1h-1l-3 4H5l-3-4H1" />
    <circle cx="7.5" cy="18.5" r="2.5" /><circle cx="17.5" cy="18.5" r="2.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 22a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" /><path d="M12.5 14a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
    <path d="m2 2 20 20" /><path d="M14 4h6v6" />
  </svg>
);

const HeroSection = styled.section`
  background-image: url('/casa-moreno-banner2.jpeg');
  background-size: cover;
  background-position: center center;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 40%;
`;

const Section = styled.section`
  padding: 2.5rem 2rem;
  background-color: ${({ theme, $isWhite }) => $isWhite ? 'white' : theme.colors.lightGray};

  &.offers-section {
    padding-top: 2.5rem;
    padding-bottom: 0.5rem;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 2rem 1rem;
    &.offers-section {
      padding-bottom: 0;
    }
  }
`;

const TitleWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  text-align: left;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.darkGray};
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.75rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    background-color: ${({ theme }) => theme.colors.primaryBlue};
    border-radius: 2px;
  }
  
  @media (max-width: 767px) {
    font-size: 1.8rem;
    padding-bottom: 0.5rem;
    &::after {
        width: 60px;
        height: 3px;
    }
  }
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
`;

const FeatureCard = styled.div`
    padding: 2rem;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.primaryBlue};
    
    h3 {
        font-size: 1.4rem;
        color: ${({ theme }) => theme.colors.darkGray};
        margin: 1rem 0;
    }
    p {
        font-size: 1rem;
        color: #555;
        line-height: 1.6;
    }

    @media ${({ theme }) => theme.breakpoints.mobile} {
      padding: 1.5rem 1rem;
    }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled.div`
  display: block;
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 1.4rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(42, 74, 135, 0.15);
    border-color: ${({ theme }) => theme.colors.primaryBlue};
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1.5rem; 
    font-size: 1.1rem; 
  }
`;

const HomePage = ({ promotionalProducts, categories }) => {
  return (
    <Layout marqueeProducts={promotionalProducts}>
      <Head>
        <title>Casa Moreno - A melhor loja do mundo</title>
        <meta name="description" content="Explore as melhores ofertas em smartphones, notebooks e eletrônicos. A Casa Moreno conecta você às melhores oportunidades." />
      </Head>

      <HeroSection />

      <Section className="offers-section">
        <TitleWrapper>
          <SectionTitle>Ofertas em Destaque</SectionTitle>
        </TitleWrapper>
        <Carousel products={promotionalProducts} />
      </Section>

      <Section $isWhite>
        <TitleWrapper>
          <SectionTitle>Navegue por Categorias</SectionTitle>
        </TitleWrapper>
        <CategoryGrid>
          {categories.map(cat => (
            <Link key={cat} href={`/products/${cat.toLowerCase()}`} passHref>
              <CategoryCard>{cat}</CategoryCard>
            </Link>
          ))}
        </CategoryGrid>
      </Section>

      <Section>
        <FeaturesGrid>
          <FeatureCard>
            <ShieldIcon />
            <h3>Compra Segura</h3>
            <p>Redirecionamos você para ambientes de compra seguros e certificados das maiores lojas do Brasil.</p>
          </FeatureCard>
          <FeatureCard>
            <TagIcon />
            <h3>Preços Competitivos</h3>
            <p>Nosso sistema busca e organiza as melhores ofertas para que você sempre faça um bom negócio.</p>
          </FeatureCard>
          <FeatureCard>
            <TruckIcon />
            <h3>Entrega Garantida</h3>
            <p>A entrega é de responsabilidade dos nossos parceiros, grandes varejistas com logística em todo o país.</p>
          </FeatureCard>
        </FeaturesGrid>
      </Section>
    </Layout>
  );
};

export async function getServerSideProps() {
  try {
    const [categoriesRes, promotionalRes] = await Promise.all([
      apiClient.get('/products/categories'),
      apiClient.get('/products/promotional')
    ]);

    return {
      props: {
        promotionalProducts: promotionalRes.data,
        categories: categoriesRes.data
      },
    };
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
    return { props: { promotionalProducts: [], categories: [] } };
  }
}

export default HomePage;