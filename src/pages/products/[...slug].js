// src/pages/products/[...slug].js (VERSÃO COM LÓGICA DE FILTRO DE CONDIÇÃO)

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
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

    const getQueryParam = (param, defaultValue) => {
        const value = router.query[param];
        if (!value) return defaultValue;
        return value;
    };

    const [selectedBrands, setSelectedBrands] = useState(() => {
        const brands = getQueryParam('brand', []);
        return Array.isArray(brands) ? brands : [brands];
    });
    const [minPrice, setMinPrice] = useState(() => getQueryParam('min', ''));
    const [maxPrice, setMaxPrice] = useState(() => getQueryParam('max', ''));

    // NOVO: Estado para o filtro de condição
    const [selectedConditions, setSelectedConditions] = useState(() => {
        const conditions = getQueryParam('condition', []);
        return Array.isArray(conditions) ? conditions : [conditions];
    });

    const handleBrandChange = (brand) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };

    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

    // NOVO: Função para lidar com a mudança no filtro de condição
    const handleConditionChange = (condition) => {
        setSelectedConditions(prev => prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]);
    };

    useEffect(() => {
        const { slug } = router.query;
        const categoryPath = slug[0] || '';
        const query = {};

        if (selectedBrands.length > 0) query.brand = selectedBrands;
        if (minPrice) query.min = minPrice;
        if (maxPrice) query.max = maxPrice;
        if (selectedConditions.length > 0) query.condition = selectedConditions;

        router.push({
            pathname: `/products/${categoryPath}`,
            query: query,
        }, undefined, { shallow: true });

    }, [selectedBrands, minPrice, maxPrice, selectedConditions]);

    const filteredProducts = products.filter(p => {
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.productBrand);
        const minPriceFloat = parseFloat(minPrice);
        const maxPriceFloat = parseFloat(maxPrice);
        const productPrice = p.currentPrice;
        const minPriceMatch = !minPrice || !minPriceFloat || productPrice >= minPriceFloat;
        const maxPriceMatch = !maxPrice || !maxPriceFloat || productPrice <= maxPriceFloat;
        const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(p.productCondition);

        return brandMatch && minPriceMatch && maxPriceMatch && conditionMatch;
    });

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
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinPriceChange={handleMinPriceChange}
                    onMaxPriceChange={handleMaxPriceChange}
                    selectedConditions={selectedConditions}
                    onConditionChange={handleConditionChange}
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

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const category = slug[0] || 'all';

    try {
        const response = await apiClient.get('/products/find-by-category', {
            params: {
                category: category,
                page: 0,
                size: 100
            }
        });

        const products = response.data.content;
        const allBrands = [...new Set(products.map(p => p.productBrand).filter(Boolean))];

        return {
            props: {
                products,
                category,
                allBrands,
            },
        };
    } catch (error) {
        console.error("Failed to fetch products", error);
        return { props: { products: [], category: category || 'N/A', allBrands: [] } };
    }
}

export default ProductsPage;