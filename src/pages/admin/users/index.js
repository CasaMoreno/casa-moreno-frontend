import { useState, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';
import UserEditModal from '@/components/admin/UserEditModal';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Avatar from '@/components/common/Avatar'; // Importação do componente Avatar

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

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1``;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
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
  th:nth-child(2), td:nth-child(2) { /* Alinhamento para a coluna de Nome */
      text-align: left;
      padding-left: 20px;
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

const EmptyStateCell = styled.td`
  text-align: center !important;
  padding: 3rem !important;
  font-style: italic;
  color: #666;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;


const UsersManagementPage = ({ initialUsers }) => {
    const [users, setUsers] = useState(initialUsers);
    const [editingUser, setEditingUser] = useState(null);
    const { user: loggedInAdmin } = useAuth();
    const { showConfirmation, showNotification } = useNotification();

    const displayedUsers = useMemo(() => {
        if (!loggedInAdmin) {
            return [];
        }
        return users.filter(user => user.userId !== loggedInAdmin.userId);
    }, [users, loggedInAdmin]);


    const handleDeleteUser = (userId, userName) => {
        showConfirmation({
            title: 'Confirmar Exclusão',
            message: `Tem certeza que deseja deletar o usuário: "${userName}"?`,
            onConfirm: async () => {
                try {
                    await apiClient.delete('/users/delete', { params: { userId } });
                    setUsers(users.filter(u => u.userId !== userId));
                    showNotification({ title: 'Sucesso', message: 'Usuário deletado!' });
                } catch (error) {
                    console.error("Delete user failed:", error);
                    showNotification({ title: 'Erro', message: 'Falha ao deletar usuário.' });
                }
            }
        });
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await apiClient.put('/users/update', userData);
            setUsers(users.map(u => u.userId === userData.userId ? response.data : u));
            setEditingUser(null);
            showNotification({ title: 'Sucesso', message: 'Usuário atualizado com sucesso!' });
        } catch (error) {
            showNotification({ title: 'Erro', message: 'Falha ao atualizar usuário.' });
        }
    };

    return (
        <Layout>
            {editingUser && (
                <UserEditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleUpdateUser} />
            )}
            <PageContainer>
                <PageHeader>
                    <PageTitle>Gerenciamento de Usuários</PageTitle>
                    <HeaderActions>
                        <Link href="/admin" passHref>
                            <Button style={{ backgroundColor: '#6c757d' }}>Voltar ao Painel</Button>
                        </Link>
                        <Link href="/auth/register" passHref>
                            <Button>Criar Novo Usuário</Button>
                        </Link>
                    </HeaderActions>
                </PageHeader>
                <TableWrapper>
                    <UserTable>
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nome</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Perfil</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedUsers.length > 0 ? (
                                displayedUsers.map(user => (
                                    <tr key={user.userId}>
                                        <td>
                                            <Avatar user={user} size="40px" fontSize="1.2rem" />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.profile}</td>
                                        <td>
                                            <ActionsContainer>
                                                <Button onClick={() => setEditingUser(user)}>Editar</Button>
                                                <DeleteButton onClick={() => handleDeleteUser(user.userId, user.name)}>Deletar</DeleteButton>
                                            </ActionsContainer>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <EmptyStateCell colSpan="6">
                                        Nenhum outro usuário encontrado.
                                    </EmptyStateCell>
                                </tr>
                            )}
                        </tbody>
                    </UserTable>
                </TableWrapper>
            </PageContainer>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    try {
        const token = context.req.cookies.authToken;
        if (!token) throw new Error("No token");
        const response = await apiClient.get('/users/find-all-users', { headers: { Authorization: `Bearer ${token}` } });
        return { props: { initialUsers: response.data } };
    } catch (error) {
        return { redirect: { destination: '/auth/login', permanent: false } };
    }
}


export default withAuth(UsersManagementPage, ['ADMIN']);