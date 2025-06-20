import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import apiClient from '@/api/axios';
import Button from '@/components/common/Button';
import UserEditModal from '@/components/admin/UserEditModal';

const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1rem;
    margin-top: 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2.5rem;
  color: ${({ theme }) => theme.colors.primaryBlue};
`;

const ProfileCard = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  
  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const Avatar = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.primaryBlue};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: bold;
    flex-shrink: 0;
`;

const ProfileContent = styled.div`
    flex-grow: 1;
    width: 100%; // Garante que o conteúdo ocupe o espaço no modo coluna
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  h2 {
    margin: 0;
    font-size: 1.8rem;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    h2 {
        font-size: 1.5rem;
    }
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0.8rem;
  font-size: 1.1rem;
  strong { text-align: right; color: #666; }
  p { margin: 0; word-break: break-all; }
  
  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr;
    text-align: center;
    font-size: 1rem;
    gap: 1rem;
    strong {
      text-align: center;
      margin-bottom: -0.5rem;
    }
  }
`;


const UserDashboard = () => {
    const { user: authUser, loading: authLoading } = useAuth();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (authUser) {
            apiClient.get(`/users/username?username=${authUser.username}`)
                .then(response => setUserData(response.data))
                .catch(error => console.error("Falha ao buscar dados do usuário", error));
        }
    }, [authUser]);

    const handleUpdateUser = async (data) => {
        try {
            const response = await apiClient.put('/users/update', data);
            setUserData(response.data);
            setIsEditing(false);
            showNotification({ title: 'Sucesso', message: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            showNotification({ title: 'Erro', message: 'Não foi possível atualizar o perfil.' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não disponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (authLoading || !userData) {
        return <Layout><div>Carregando...</div></Layout>;
    }

    return (
        <Layout>
            {isEditing && (
                <UserEditModal
                    user={userData}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdateUser}
                    title="Editar Meu Perfil"
                />
            )}
            <DashboardContainer>
                <Title>Meu Perfil</Title>
                <ProfileCard>
                    <Avatar>{userData.name.charAt(0)}</Avatar>
                    <ProfileContent>
                        <ProfileHeader>
                            <h2>Meus Dados</h2>
                            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                        </ProfileHeader>
                        <ProfileInfo>
                            <strong>Nome:</strong><p>{userData.name}</p>
                            <strong>Username:</strong><p>{userData.username}</p>
                            <strong>Email:</strong><p>{userData.email}</p>
                            <strong>Telefone:</strong><p>{userData.phone || 'Não informado'}</p>
                            <strong>Criado em:</strong><p>{formatDate(userData.createdAt)}</p>
                            <strong>Atualizado em:</strong><p>{formatDate(userData.updatedAt)}</p>
                        </ProfileInfo>
                    </ProfileContent>
                </ProfileCard>
            </DashboardContainer>
        </Layout>
    );
};

export default withAuth(UserDashboard);