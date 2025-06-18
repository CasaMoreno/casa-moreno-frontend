import { useRouter } from 'next/router';
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

const ProductsPage = ({ products, category }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Carregando...</div>;
    }

    const brands = [...new Set(products.map(p => p.productBrand).filter(Boolean))];

    return (
        <Layout>
            <h2 style={{ textAlign: 'center', margin: '2rem 0', textTransform: 'capitalize' }}>{category}</h2>
            <ProductsPageContainer>
                <ProductFilter brands={brands} />
                <ProductsGrid>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))
                    ) : (
                        <p>Nenhum produto encontrado nesta categoria.</p>
                    )}
                </ProductsGrid>
            </ProductsPageContainer>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const [category, subcategory, brand] = slug;

    try {
        const response = await apiClient.get('/products/find-by-category', {
            params: {
                category: category || 'all',
                page: context.query.page || 0,
                size: 20
            }
        });

        let filteredProducts = response.data.content;

        if (subcategory) {
            filteredProducts = filteredProducts.filter(p => p.productSubcategory === subcategory);
        }
        if (brand) {
            filteredProducts = filteredProducts.filter(p => p.productBrand === brand);
        }

        return {
            props: {
                products: filteredProducts,
                category,
            },
        };
    } catch (error) {
        console.error("Failed to fetch products", error);
        return { props: { products: [], category: category || 'N/A' } };
    }
}

export default ProductsPage;