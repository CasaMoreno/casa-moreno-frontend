// src/pages/admin/users/index.js (VERSÃO COM FILTRO DE ADMIN)

import { useState, useMemo } from 'react'; // Adicionado useMemo
import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';
import UserEditModal from '@/components/admin/UserEditModal';
import { useAuth } from '@/hooks/useAuth'; // NOVO: Importa o hook de autenticação

// --- Estilos (não mudam) ---
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

const PageTitle = styled.h1``;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    vertical-align: middle;
  }
  th { 
      background-color: #f2f2f2; 
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

// --- Componente da Página ---
const UsersManagementPage = ({ initialUsers }) => {
    const [users, setUsers] = useState(initialUsers);
    const [editingUser, setEditingUser] = useState(null);
    const { user: loggedInAdmin } = useAuth(); // Pega o admin logado do contexto

    // NOVO: Filtra a lista de usuários para remover o admin logado
    const displayedUsers = useMemo(() => {
        if (!loggedInAdmin) {
            return users; // Se o admin ainda não carregou, mostra todos temporariamente
        }
        return users.filter(user => user.userId !== loggedInAdmin.userId);
    }, [users, loggedInAdmin]);


    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Tem certeza que deseja deletar o usuário: "${userName}"?`)) {
            try {
                await apiClient.delete(`/users/delete?userId=${userId}`);
                setUsers(users.filter(u => u.userId !== userId));
            } catch (error) {
                alert("Não foi possível deletar o usuário.");
            }
        }
    };

    const handleUpdateUser = async (userData) => {
        try {
            const response = await apiClient.put('/users/update', userData);
            setUsers(users.map(u => u.userId === userData.userId ? response.data : u));
            setEditingUser(null);
        } catch (error) {
            alert("Não foi possível atualizar o usuário.");
        }
    };

    return (
        <Layout>
            {editingUser && (
                <UserEditModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleUpdateUser}
                />
            )}
            <PageContainer>
                <PageHeader>
                    <PageTitle>Gerenciamento de Usuários</PageTitle>
                </PageHeader>
                <UserTable>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Perfil</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ALTERAÇÃO AQUI: Mapeia sobre a lista filtrada */}
                        {displayedUsers.map(user => (
                            <tr key={user.userId}>
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
                        ))}
                    </tbody>
                </UserTable>
            </PageContainer>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    try {
        const token = context.req.cookies.authToken;
        if (!token) throw new Error("No token");

        const authHeaders = { Authorization: `Bearer ${token}` };

        const response = await apiClient.get('/users/find-all-users', { headers: authHeaders });
        return { props: { initialUsers: response.data } };
    } catch (error) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }
}


export default withAuth(UsersManagementPage, ['ADMIN']);