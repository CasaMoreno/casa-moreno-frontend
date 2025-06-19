// src/pages/admin/index.js (VERSÃO COM CONTROLE DE OFERTAS)

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
  margin-bottom: 3rem; 
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    vertical-align: middle;
  }
  th { 
      background-color: #f2f2f2; 
      text-align: center;
    }
  td {
      text-align: center;
  }
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

const CategoryTitle = styled.h2`
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primaryBlue};
  text-align: left;
`;

// NOVO: Estilos para o Switch de Oferta
const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const SwitchInput = styled.input`
    &:checked + ${Slider} {
        background-color: ${({ theme }) => theme.colors.primaryBlue};
    }
    &:checked + ${Slider}:before {
        transform: translateX(26px);
    }
`;


const AdminDashboard = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const router = useRouter();

    const groupedAndSortedProducts = useMemo(() => {
        const grouped = products.reduce((acc, product) => {
            const category = product.productCategory || 'Sem Categoria';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        for (const category in grouped) {
            grouped[category].sort((a, b) => a.productTitle.localeCompare(b.productTitle));
        }

        return grouped;
    }, [products]);

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

    // NOVO: Função para alterar o status de oferta
    const handlePromotionalToggle = async (productId, currentStatus) => {
        try {
            await apiClient.patch(`/products/${productId}/promotional?status=${!currentStatus}`);
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.productId === productId ? { ...p, isPromotional: !currentStatus } : p
                )
            );
        } catch (error) {
            console.error("Falha ao atualizar o status promocional", error);
            alert("Não foi possível atualizar o status promocional do produto.");
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

                {sortedCategories.map(category => (
                    <div key={category}>
                        <CategoryTitle>{category}</CategoryTitle>
                        <ProductTable>
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Marca</th>
                                    <th>Preço</th>
                                    <th>Oferta</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedAndSortedProducts[category].map(product => (
                                    <tr key={product.productId}>
                                        <td>{product.productTitle}</td>
                                        <td>{product.productBrand}</td>
                                        <td>R$ {product.currentPrice?.toFixed(2)}</td>
                                        <td>
                                            <SwitchLabel>
                                                <SwitchInput
                                                    type="checkbox"
                                                    checked={product.isPromotional || false}
                                                    onChange={() => handlePromotionalToggle(product.productId, product.isPromotional)}
                                                />
                                                <Slider />
                                            </SwitchLabel>
                                        </td>
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