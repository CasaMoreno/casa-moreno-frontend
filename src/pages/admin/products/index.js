import { useState, useMemo, useRef } from 'react'; // Adicionado useRef
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';
import { useNotification } from '@/hooks/useNotification';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Estilo para o botão de sincronização para destacá-lo
const SyncButton = styled(Button)`
    background-color: ${({ theme }) => theme.colors.primaryPurple};
    &:hover:not(:disabled) {
        background-color: #4a2d6e;
    }
`;

const PageTitle = styled.h1``;
const TableWrapper = styled.div`
  overflow-x: auto;
  transition: max-height 0.3s ease-in-out;
  max-height: 1000px;
  overflow-y: auto;
  
  &.collapsed {
    max-height: 0;
  }
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
    white-space: nowrap;
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
    white-space: normal;
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;

  svg {
    transition: transform 0.3s ease-in-out;
    transform: rotate(${({ isCollapsed }) => (isCollapsed ? '0deg' : '90deg')});
  }
`;

const ArrowIcon = ({ isCollapsed }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  input { opacity: 0; width: 0; height: 0; }
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
    const [collapsedCategories, setCollapsedCategories] = useState(() => {
        const initialCollapsed = new Set();
        if (Object.keys(initialProducts).length > 1) {
            const categories = Object.keys(initialProducts).sort();
            for (let i = 1; i < categories.length; i++) {
                initialCollapsed.add(categories[i]);
            }
        }
        return initialCollapsed;
    });

    const [isSyncing, setIsSyncing] = useState(false);
    const router = useRouter();
    const syncIntervalRef = useRef(null); // Para guardar a referência do intervalo de polling

    const groupedAndSortedProducts = useMemo(() => {
        const grouped = products.reduce((acc, product) => {
            const category = product.productCategory || 'Sem Categoria';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});
        for (const category in grouped) {
            grouped[category].sort((a, b) => a.productTitle.localeCompare(b.productTitle));
        }
        return grouped;
    }, [products]);

    const sortedCategories = Object.keys(groupedAndSortedProducts).sort();

    const toggleCategoryVisibility = (category) => {
        setCollapsedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // LÓGICA DE SINCRONIZAÇÃO ATUALIZADA
    const handleSyncProducts = async () => {
        setIsSyncing(true);
        showNotification({
            title: 'Sincronização Iniciada',
            message: 'O processo pode levar vários minutos. A página será recarregada automaticamente ao final.',
            type: 'info'
        });

        try {
            // Etapa 1: Iniciar a sincronização e obter o ID da tarefa
            const startResponse = await apiClient.post('/products/start-sync');
            const { taskId } = startResponse.data;

            if (!taskId) {
                throw new Error('Não foi possível obter um ID para a tarefa de sincronização.');
            }

            // Etapa 2: Iniciar o polling para verificar o status
            syncIntervalRef.current = setInterval(async () => {
                try {
                    const statusResponse = await apiClient.get(`/products/sync-status/${taskId}`);
                    const { status, error } = statusResponse.data;

                    if (status === 'COMPLETED') {
                        clearInterval(syncIntervalRef.current);
                        setIsSyncing(false);
                        showNotification({
                            title: 'Sincronização Concluída!',
                            message: 'Os produtos foram atualizados. A página será recarregada.',
                            type: 'success'
                        });
                        setTimeout(() => router.reload(), 2000);
                    } else if (status === 'FAILED') {
                        clearInterval(syncIntervalRef.current);
                        setIsSyncing(false);
                        showNotification({
                            title: 'Erro na Sincronização',
                            message: error || 'Ocorreu uma falha no processo de sincronização.',
                            type: 'error'
                        });
                    }
                    // Se o status for 'RUNNING', não faz nada e espera a próxima verificação.
                } catch (pollError) {
                    clearInterval(syncIntervalRef.current);
                    setIsSyncing(false);
                    console.error("Falha ao verificar status da sincronização:", pollError);
                    showNotification({
                        title: 'Erro de Comunicação',
                        message: 'Não foi possível verificar o progresso da sincronização.',
                        type: 'error'
                    });
                }
            }, 5000); // Verifica a cada 5 segundos

        } catch (startError) {
            setIsSyncing(false);
            console.error("Falha ao iniciar a sincronização:", startError);
            showNotification({
                title: 'Erro ao Iniciar',
                message: startError.response?.data?.message || 'Não foi possível iniciar o processo.',
                type: 'error'
            });
        }
    };

    const handleDelete = async (productId, productTitle) => {
        showConfirmation({
            title: 'Confirmar Exclusão',
            message: `Deletar o produto: "${productTitle}"?`,
            onConfirm: async () => {
                try {
                    await apiClient.delete(`/products/delete/${productId}`);
                    setProducts(products.filter(p => p.productId !== productId));
                    showNotification({ title: 'Sucesso', message: 'Produto deletado!' });
                } catch (error) {
                    showNotification({ title: 'Erro', message: 'Falha ao deletar produto.' });
                }
            }
        });
    };

    const handlePromotionalToggle = async (productId, currentStatus) => {
        try {
            await apiClient.patch(`/products/${productId}/promotional?status=${!currentStatus}`);
            setProducts(products.map(p =>
                p.productId === productId ? { ...p, isPromotional: !currentStatus } : p
            ));
        } catch (error) {
            console.error("Erro ao alternar status promocional", error);
            showNotification({ title: 'Erro', message: 'Falha ao atualizar status promocional.' });
        }
    };

    return (
        <Layout>
            <PageContainer>
                <PageHeader>
                    <PageTitle>Gerenciamento de Produtos</PageTitle>
                    <HeaderActions>
                        <Link href="/admin" passHref><Button as="a" style={{ backgroundColor: '#6c757d' }}>Voltar ao Painel</Button></Link>
                        <Link href="/admin/new-product"><Button>Adicionar Novo Produto</Button></Link>
                        <SyncButton onClick={handleSyncProducts} disabled={isSyncing}>
                            {isSyncing ? 'Sincronizando...' : 'Sincronizar com Scraper'}
                        </SyncButton>
                    </HeaderActions>
                </PageHeader>

                {sortedCategories.map(category => (
                    <div key={category}>
                        <CategoryTitle
                            onClick={() => toggleCategoryVisibility(category)}
                            isCollapsed={collapsedCategories.has(category)}
                        >
                            {category}
                            <ArrowIcon isCollapsed={collapsedCategories.has(category)} />
                        </CategoryTitle>
                        <TableWrapper className={collapsedCategories.has(category) ? 'collapsed' : ''}>
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
                                            <td>
                                                <Link href={`/product/${product.productId}`} passHref>
                                                    <Image src={product.galleryImageUrls?.[0] || '/placeholder.png'} alt={product.productTitle} width={60} height={60} style={{ objectFit: 'contain', margin: 'auto', cursor: 'pointer' }} />
                                                </Link>
                                            </td>
                                            <td>{product.productTitle}</td>
                                            <td>{product.productBrand}</td>
                                            <td>R$ {product.currentPrice?.toFixed(2).replace('.', ',')}</td>
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
                                                    <Link href={`/admin/edit/${product.productId}`}><Button>Editar</Button></Link>
                                                    <DeleteButton onClick={() => handleDelete(product.productId, product.productTitle)}>Deletar</DeleteButton>
                                                </ActionsContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </ProductTable>
                        </TableWrapper>
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
        const response = await apiClient.get('/products/list-all', { headers: { Authorization: `Bearer ${token}` } });
        return { props: { initialProducts: response.data } };
    } catch (error) {
        return { redirect: { destination: '/auth/login', permanent: false } };
    }
}

export default withAuth(ProductsManagementPage, ['ADMIN']);