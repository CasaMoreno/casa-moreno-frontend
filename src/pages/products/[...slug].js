// src/pages/products/[...slug].js (VERSÃO ATUALIZADA)

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'; // Imports novos
import styled from 'styled-components';
import apiClient from '@/api/axios';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';

const ProductsPageContainer = styled.div`
  display: flex;
  padding: 2rem;
`;

const ProductsGrid = styled.div`
  flex: 3;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const ProductsPage = ({ products, category, allBrands }) => {
    const router = useRouter();

    // Converte a query da URL (que pode ser string ou array) para um array de marcas selecionadas
    const getBrandsFromQuery = () => {
        const { brand } = router.query;
        if (!brand) return [];
        return Array.isArray(brand) ? brand : [brand];
    };

    const [selectedBrands, setSelectedBrands] = useState(getBrandsFromQuery());

    // Função para lidar com a mudança no checkbox
    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => {
            if (prev.includes(brand)) {
                return prev.filter(b => b !== brand); // Desmarca
            } else {
                return [...prev, brand]; // Marca
            }
        });
    };

    // Efeito que observa mudanças nas marcas selecionadas e atualiza a URL
    useEffect(() => {
        const { slug } = router.query;
        const categoryPath = slug[0] || '';

        const query = { ...router.query };

        if (selectedBrands.length > 0) {
            query.brand = selectedBrands;
        } else {
            delete query.brand; // Remove o parâmetro 'brand' se nenhuma marca estiver selecionada
        }

        router.push({
            pathname: `/products/${categoryPath}`,
            query: query,
        }, undefined, { shallow: true }); // 'shallow: true' evita re-rodar getServerSideProps, pois vamos filtrar no cliente

    }, [selectedBrands]); // Roda sempre que selectedBrands mudar

    // Filtra os produtos no lado do cliente com base no estado
    const filteredProducts = products.filter(p =>
        selectedBrands.length === 0 || selectedBrands.includes(p.productBrand)
    );

    if (router.isFallback) {
        return <div>Carregando...</div>;
    }

    return (
        <Layout>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', textTransform: 'capitalize' }}>{category}</h2>
            <ProductsPageContainer>
                <ProductFilter
                    brands={allBrands}
                    selectedBrands={selectedBrands}
                    onBrandChange={handleBrandChange}
                />
                <ProductsGrid>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))
                    ) : (
                        <p>Nenhum produto encontrado com os filtros selecionados.</p>
                    )}
                </ProductsGrid>
            </ProductsPageContainer>
        </Layout>
    );
};

// ALTERADO: Agora a gente pega todas as marcas da categoria para popular o filtro
export async function getServerSideProps(context) {
    const { slug } = context.params;
    const category = slug[0] || 'all';

    try {
        const response = await apiClient.get('/products/find-by-category', {
            params: {
                category: category,
                page: 0,
                size: 100 // Pega um número grande de produtos para filtrar no cliente
            }
        });

        const products = response.data.content;
        const allBrands = [...new Set(products.map(p => p.productBrand).filter(Boolean))];

        return {
            props: {
                products,
                category,
                allBrands, // Passa todas as marcas disponíveis para a página
            },
        };
    } catch (error) {
        console.error("Failed to fetch products", error);
        return { props: { products: [], category: category || 'N/A', allBrands: [] } };
    }
}

export default ProductsPage;