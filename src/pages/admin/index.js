// src/pages/admin/index.js (VERSÃO COM PRODUTOS AGRUPADOS)

import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';

const AdminDashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  h1 { margin-bottom: 1rem; }
`;

const TopActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 3rem; // Espaço entre as tabelas de categorias
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    vertical-align: middle;
  }
  th { background-color: #f2f2f2; }
`;

const ActionsCell = styled.td`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #c82333;
  &:hover {
    background-color: #a71d2a;
  }
`;

// NOVO: Estilo para o título de cada categoria
const CategoryTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryBlue};
  text-align: left;
`;

const AdminDashboard = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const router = useRouter();

    // --- LÓGICA PARA AGRUPAR E ORDENAR PRODUTOS ---
    const groupedAndSortedProducts = useMemo(() => {
        // 1. Agrupa os produtos por categoria
        const grouped = products.reduce((acc, product) => {
            const category = product.productCategory || 'Sem Categoria';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        // 2. Ordena os produtos dentro de cada categoria por título
        for (const category in grouped) {
            grouped[category].sort((a, b) => a.productTitle.localeCompare(b.productTitle));
        }

        return grouped;
    }, [products]);

    // 3. Pega os nomes das categorias e os ordena alfabeticamente
    const sortedCategories = Object.keys(groupedAndSortedProducts).sort();

    const handleDelete = async (productId, productTitle) => {
        if (window.confirm(`Tem certeza que deseja deletar o produto: "${productTitle}"?`)) {
            try {
                await apiClient.delete(`/products/delete/${productId}`);
                setProducts(products.filter(p => p.productId !== productId));
            } catch (error) {
                console.error("Falha ao deletar o produto", error);
                alert("Não foi possível deletar o produto.");
            }
        }
    };

    return (
        <Layout>
            <AdminDashboardContainer>
                <h1>Admin Dashboard</h1>
                <TopActions>
                    <Link href="/admin/new-product">
                        <Button>Adicionar Novo Produto</Button>
                    </Link>
                </TopActions>

                {/* --- RENDERIZAÇÃO AGRUPADA POR CATEGORIA --- */}
                {sortedCategories.map(category => (
                    <div key={category}>
                        <CategoryTitle>{category}</CategoryTitle>
                        <ProductTable>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Marca</th>
                                    <th>Preço</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedAndSortedProducts[category].map(product => (
                                    <tr key={product.productId}>
                                        <td>{product.productTitle}</td>
                                        <td>{product.productBrand}</td>
                                        <td>R$ {product.currentPrice?.toFixed(2)}</td>
                                        <ActionsCell>
                                            <Link href={`/admin/edit/${product.productId}`}>
                                                <Button>Editar</Button>
                                            </Link>
                                            <DeleteButton onClick={() => handleDelete(product.productId, product.productTitle)}>
                                                Deletar
                                            </DeleteButton>
                                        </ActionsCell>
                                    </tr>
                                ))}
                            </tbody>
                        </ProductTable>
                    </div>
                ))}

            </AdminDashboardContainer>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    try {
        const { req } = context;
        const headers = req ? { cookie: req.headers.cookie } : {};

        const response = await apiClient.get('/products/list-all', { headers });
        return { props: { initialProducts: response.data } };
    } catch (error) {
        console.error("Failed to fetch admin products", error);
        if (error.response?.status === 401) {
            return {
                redirect: {
                    destination: '/auth/login',
                    permanent: false,
                },
            }
        }
        return { props: { initialProducts: [] } };
    }
}

export default withAuth(AdminDashboard, ['ADMIN']);