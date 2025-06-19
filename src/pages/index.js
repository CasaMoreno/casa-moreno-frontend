// src/pages/index.js (VERSÃO COM CARROSSEL DE OFERTAS)

import styled from 'styled-components';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/common/Button';
import Carousel from '@/components/common/Carousel'; // NOVO: Importa o carrossel

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/hero-banner.png');
  background-size: cover; 
  background-position: center center; 
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 8rem 2rem;

  h1 {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin-bottom: 2rem;
  }
`;

const HeroButton = styled(Button)`
  padding: 15px 30px;
  font-size: 1.2rem;
  text-transform: uppercase;
`;

const Section = styled.section`
  padding: 4rem 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ValuePropsContainer = styled.section`
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 3rem 2rem;
  text-align: center;
  flex-wrap: wrap;
`;

const ValueProp = styled.div`
  max-width: 250px;
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const HomePage = ({ promotionalProducts, categories }) => {
  return (
    <Layout>
      <Head>
        <title>Casa Moreno - A melhor loja do mundo</title>
      </Head>

      <HeroSection>
        <h1>Tecnologia e Inovação ao seu Alcance</h1>
        <p>Explore nossa seleção de smartphones, laptops e eletrônicos com os melhores preços e condições.</p>
        <Link href="/offers">
          <HeroButton>Ver Ofertas</HeroButton>
        </Link>
      </HeroSection>

      <Section>
        <SectionTitle>Navegue por Categorias</SectionTitle>
        <CategoryGrid>
          {categories.map(cat => (
            <Link key={cat} href={`/products/${cat.toLowerCase()}`}>
              <CategoryCard>{cat}</CategoryCard>
            </Link>
          ))}
        </CategoryGrid>
      </Section>

      {/* SEÇÃO DE DESTAQUES MODIFICADA */}
      <Section style={{ backgroundColor: '#f9f9f9' }}>
        <SectionTitle>Nossas Ofertas</SectionTitle>
        <Carousel products={promotionalProducts} />
      </Section>

      <ValuePropsContainer>
        <ValueProp>
          <h4>✓ Compra Segura</h4>
          <p>Ambiente protegido com os melhores certificados de segurança.</p>
        </ValueProp>
        <ValueProp>
          <h4>✓ Entrega Rápida</h4>
          <p>Receba seus produtos no conforto da sua casa com agilidade.</p>
        </ValueProp>
        <ValueProp>
          <h4>✓ Garantia de Qualidade</h4>
          <p>Trabalhamos apenas com as melhores marcas e fornecedores.</p>
        </ValueProp>
      </ValuePropsContainer>
    </Layout>
  );
};

// LÓGICA DE BUSCA DE DADOS ATUALIZADA
export async function getServerSideProps() {
  try {
    // Busca as categorias e as ofertas em paralelo para mais eficiência
    const [categoriesRes, promotionalRes] = await Promise.all([
      apiClient.get('/products/categories'),
      apiClient.get('/products/promotional')
    ]);

    const categories = categoriesRes.data;
    const promotionalProducts = promotionalRes.data;

    return {
      props: {
        promotionalProducts,
        categories
      },
    };
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
    return { props: { promotionalProducts: [], categories: [] } };
  }
}

export default HomePage;