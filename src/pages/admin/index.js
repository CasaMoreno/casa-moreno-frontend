// src/pages/admin/index.js (VERSÃO COMPLETA E ATUALIZADA)

import { useState } from 'react';
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

const AdminDashboard = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const router = useRouter();

    // NOVO: Função para deletar produto
    const handleDelete = async (productId, productTitle) => {
        // Janela de confirmação para evitar deleções acidentais
        if (window.confirm(`Tem certeza que deseja deletar o produto: "${productTitle}"?`)) {
            try {
                await apiClient.delete(`/products/delete/${productId}`);
                // Atualiza a lista de produtos no estado para refletir a deleção instantaneamente
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
                <h1>Painel do Administrador</h1>
                <TopActions>
                    <Link href="/admin/new-product">
                        <Button>Adicionar Novo Produto</Button>
                    </Link>
                </TopActions>
                <ProductTable>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.productId}>
                                <td>{product.productTitle}</td>
                                <td>{product.productCategory}</td>
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
            </AdminDashboardContainer>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    try {
        // É preciso passar os cookies da requisição para que o token JWT do admin seja enviado
        const { req } = context;
        const headers = req ? { cookie: req.headers.cookie } : {};

        // ATUALIZADO: Usando a nova rota
        const response = await apiClient.get('/products/list-all', { headers });
        return { props: { initialProducts: response.data } };
    } catch (error) {
        console.error("Failed to fetch admin products", error);
        // Se falhar (ex: token expirado), redireciona para o login
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