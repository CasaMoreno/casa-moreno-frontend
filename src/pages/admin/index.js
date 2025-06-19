import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import apiClient from '@/api/axios';
import UserEditModal from '@/components/admin/UserEditModal';

const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
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
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0.8rem;
  font-size: 1.1rem;
  strong { text-align: right; color: #666; }
  p { margin: 0; }
`;

const ManagementSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: center;
`;

const ManagementCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const AdminDashboard = () => {
    const { user: authUser } = useAuth();
    const [adminData, setAdminData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (authUser) {
            apiClient.get(`/users/username?username=${authUser.username}`)
                .then(response => {
                    setAdminData(response.data);
                })
                .catch(error => console.error("Falha ao buscar dados do admin", error));
        }
    }, [authUser]);

    const handleUpdateProfile = async (data) => {
        try {
            const response = await apiClient.put('/users/update', data);
            setAdminData(response.data);
            setIsEditing(false);
            showNotification({ title: 'Sucesso', message: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            console.error("Falha ao atualizar perfil", error);
            showNotification({ title: 'Erro', message: 'Não foi possível atualizar o seu perfil.' });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Não disponível';
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const timePart = date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${datePart} às ${timePart}`;
    };

    if (!adminData) {
        return <Layout><div>Carregando...</div></Layout>;
    }

    return (
        <Layout>
            {isEditing && (
                <UserEditModal
                    user={adminData}
                    onClose={() => setIsEditing(false)}
                    onSave={handleUpdateProfile}
                    title="Editar Meu Perfil"
                />
            )}
            <DashboardContainer>
                <Title>Painel do Administrador</Title>

                <ProfileCard>
                    <Avatar>{adminData.name.charAt(0)}</Avatar>
                    <ProfileContent>
                        <ProfileHeader>
                            <h2>{adminData.name}</h2>
                            <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                        </ProfileHeader>
                        <ProfileInfo>
                            <strong>Username:</strong> <p>{adminData.username}</p>
                            <strong>Email:</strong> <p>{adminData.email}</p>
                            <strong>Telefone:</strong> <p>{adminData.phone || 'Não informado'}</p>
                            <strong>Perfil:</strong> <p>{adminData.profile}</p>
                            <strong>Criado em:</strong> <p>{formatDate(adminData.createdAt)}</p>
                            <strong>Atualizado em:</strong> <p>{formatDate(adminData.updatedAt)}</p>
                        </ProfileInfo>
                    </ProfileContent>
                </ProfileCard>

                <ManagementSection>
                    <Link href="/admin/products">
                        <ManagementCard>Gerenciar Produtos</ManagementCard>
                    </Link>
                    <Link href="/admin/users">
                        <ManagementCard>Gerenciar Usuários</ManagementCard>
                    </Link>
                </ManagementSection>

            </DashboardContainer>
        </Layout>
    );
};

export default withAuth(AdminDashboard, ['ADMIN']);