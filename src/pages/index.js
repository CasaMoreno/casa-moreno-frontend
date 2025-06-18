// src/pages/index.js (VERSÃO PROFISSIONAL)

import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/common/Button';

// --- SEÇÃO 1: HERO (BANNER PRINCIPAL) ---
const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding: 0 2rem;

  h1 {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
    margin-bottom: 2rem;
  }
`;

// --- SEÇÃO 2 E 3: SEÇÕES GENÉRICAS PARA DESTAQUES ---
const Section = styled.section`
  padding: 4rem 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.darkGray};
`;

// --- SEÇÃO 2: GRID DE CATEGORIAS ---
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled.a`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

// --- SEÇÃO 3: GRID DE PRODUTOS ---
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// --- SEÇÃO 4: PROPOSTA DE VALOR ---
const ValuePropsContainer = styled.section`
  display: flex;
  justify-content: space-around;
  background-color: ${({ theme }) => theme.colors.lightGray};
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


// --- O COMPONENTE DA PÁGINA PRINCIPAL ---
const HomePage = ({ featuredProducts, categories }) => {
  return (
    <Layout>
      {/* --- Renderiza a Seção 1: Hero --- */}
      <HeroSection>
        <h1>Tecnologia e Inovação ao seu Alcance</h1>
        <p>Explore nossa seleção de smartphones, laptops e eletrônicos com os melhores preços e condições.</p>
        <Link href="/products/celulares" passHref>
          <Button as="a">Ver Ofertas</Button>
        </Link>
      </HeroSection>

      {/* --- Renderiza a Seção 2: Categorias em Destaque --- */}
      <Section>
        <SectionTitle>Navegue por Categorias</SectionTitle>
        <CategoryGrid>
          {categories.map(cat => (
            <Link key={cat} href={`/products/${cat.toLowerCase()}`} passHref>
              <CategoryCard>{cat}</CategoryCard>
            </Link>
          ))}
        </CategoryGrid>
      </Section>
      
      {/* --- Renderiza a Seção 3: Produtos em Destaque --- */}
      <Section style={{ backgroundColor: '#f9f9f9' }}>
        <SectionTitle>Nossos Destaques</SectionTitle>
        <ProductGrid>
          {featuredProducts.map(product => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </ProductGrid>
      </Section>

      {/* --- Renderiza a Seção 4: Proposta de Valor --- */}
      <ValuePropsContainer>
          <ValueProp>
              {/* Você pode substituir o texto por ícones aqui */}
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


// --- BUSCA OS DADOS NO SERVIDOR ANTES DA PÁGINA CARREGAR ---
export async function getServerSideProps() {
  try {
    // Busca as categorias para os blocos de destaque
    const categoriesResponse = await apiClient.get('/products/categories');
    const categories = categoriesResponse.data;

    // Busca alguns produtos de uma categoria principal para destacar
    // Vamos pegar 4 produtos da primeira categoria da lista
    let featuredProducts = [];
    if (categories && categories.length > 0) {
      const firstCategory = categories[0].toLowerCase();
      const productsResponse = await apiClient.get('/products/find-by-category', {
        params: { category: firstCategory, page: 0, size: 4 }
      });
      featuredProducts = productsResponse.data.content;
    }
    
    return {
      props: {
        featuredProducts,
        categories
      },
    };
  } catch (error) {
    console.error("Failed to fetch homepage data", error);
    // Retorna valores vazios em caso de erro para a página não quebrar
    return { props: { featuredProducts: [], categories: [] } };
  }
}

export default HomePage;