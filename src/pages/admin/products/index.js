import { useState, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';
import { useNotification } from '@/hooks/useNotification';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const PageTitle = styled.h1``;

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
  th:nth-child(2), td:nth-child(2) {
    text-align: left;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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


const ProductsManagementPage = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const { showConfirmation, showNotification } = useNotification();

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
        showConfirmation({
            title: 'Confirmar Exclusão',
            message: `Tem certeza que deseja deletar o produto: "${productTitle}"?`,
            onConfirm: async () => {
                try {
                    await apiClient.delete(`/products/delete/${productId}`);
                    setProducts(products.filter(p => p.productId !== productId));
                    showNotification({ title: 'Sucesso', message: 'Produto deletado com sucesso!' });
                } catch (error) {
                    console.error("Falha ao deletar o produto", error);
                    showNotification({ title: 'Erro', message: 'Não foi possível deletar o produto.' });
                }
            }
        });
    };

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
            showNotification({ title: 'Erro', message: 'Não foi possível atualizar o status promocional do produto.' });
        }
    };

    return (
        <Layout>
            <PageContainer>
                <PageHeader>
                    <PageTitle>Gerenciamento de Produtos</PageTitle>
                    <HeaderActions>
                        <Link href="/admin" passHref>
                            <Button as="a" style={{ backgroundColor: '#6c757d' }}>Voltar ao Painel</Button>
                        </Link>
                        <Link href="/admin/new-product">
                            <Button>Adicionar Novo Produto</Button>
                        </Link>
                    </HeaderActions>
                </PageHeader>

                {sortedCategories.map(category => (
                    <div key={category}>
                        <CategoryTitle>{category}</CategoryTitle>
                        <ProductTable>
                            <thead>
                                <tr>
                                    <th>Imagem</th>
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
                                        {/* INÍCIO DA ALTERAÇÃO */}
                                        <td>
                                            <Link href={`/product/${product.productId}`} target="_blank">
                                                <Image
                                                    src={product.galleryImageUrls?.[0] || '/placeholder.png'}
                                                    alt={`Imagem de ${product.productTitle}`}
                                                    width={60}
                                                    height={60}
                                                    style={{
                                                        objectFit: 'contain',
                                                        margin: 'auto',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </Link>
                                        </td>
                                        {/* FIM DA ALTERAÇÃO */}
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
                                        <td>
                                            <ActionsContainer>
                                                <Link href={`/admin/edit/${product.productId}`}>
                                                    <Button>Editar</Button>
                                                </Link>
                                                <DeleteButton onClick={() => handleDelete(product.productId, product.productTitle)}>
                                                    Deletar
                                                </DeleteButton>
                                            </ActionsContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </ProductTable>
                    </div>
                ))}

            </PageContainer>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    try {
        const token = context.req.cookies.authToken;
        if (!token) throw new Error("No token");

        const authHeaders = { Authorization: `Bearer ${token}` };

        const response = await apiClient.get('/products/list-all', { headers: authHeaders });
        return { props: { initialProducts: response.data } };
    } catch (error) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }
}

export default withAuth(ProductsManagementPage, ['ADMIN']);