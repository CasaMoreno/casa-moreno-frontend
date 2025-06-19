// src/pages/offers.js

import styled from 'styled-components';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import ProductCard from '@/components/product/ProductCard';

const OffersContainer = styled.div`
  padding: 2rem 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const OffersPage = ({ promotionalProducts }) => {
    return (
        <Layout>
            <Head>
                <title>Ofertas Especiais - Casa Moreno</title>
                <meta name="description" content="Confira as melhores ofertas e promoções da Casa Moreno!" />
            </Head>
            <OffersContainer>
                <SectionTitle>Ofertas Imperdíveis</SectionTitle>
                <ProductGrid>
                    {promotionalProducts && promotionalProducts.length > 0 ? (
                        promotionalProducts.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center' }}>Nenhuma oferta especial encontrada no momento. Volte em breve!</p>
                    )}
                </ProductGrid>
            </OffersContainer>
        </Layout>
    );
};

export async function getServerSideProps() {
    try {
        const response = await apiClient.get('/products/promotional');
        return {
            props: { promotionalProducts: response.data },
        };
    } catch (error) {
        console.error("Failed to fetch promotional products", error);
        return {
            props: { promotionalProducts: [] },
        };
    }
}

export default OffersPage;