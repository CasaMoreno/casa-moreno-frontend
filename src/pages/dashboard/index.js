import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import apiClient from '@/api/axios';
import Button from '@/components/common/Button';
import UserEditModal from '@/components/admin/UserEditModal';
import ChangePasswordModal from '@/components/common/ChangePasswordModal';
import { formatPhoneNumber } from '@/utils/formatters';

const DashboardContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  @media ${({ theme }) => theme.breakpoints.mobile} { padding: 1rem; margin-top: 1rem; }
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
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: relative;
  
  @media ${({ theme }) => theme.breakpoints.mobile} { 
    flex-direction: column; 
    align-items: center;
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
    gap: 1rem;
    strong { text-align: center; margin-bottom: -0.5rem; }
  }
`;

const ActionsContainer = styled.div`
    position: absolute;
    top: 2rem;
    right: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 5;

    @media ${({ theme }) => theme.breakpoints.mobile} {
        position: static;
        flex-direction: column;
        width: 100%;
        align-items: center;
        margin-top: 2rem;
        order: 3;
    }
`;

const ActionButton = styled(Button)`
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 150px;
`;

// REMOVIDO o EditButton que tinha a cor roxa

const DangerButton = styled(ActionButton)`
    background-color: ${({ theme }) => theme.colors.error};
    &:hover {
        background-color: #c82333;
    }
`;

const UserDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (authUser) {
      apiClient.get(`/users/username?username=${authUser.username}`)
        .then(response => setUserData(response.data))
        .catch(error => { console.error("Falha ao buscar dados do usuário:", error); });
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
        <UserEditModal user={userData} onClose={() => setIsEditing(false)} onSave={handleUpdateUser} title="Editar Meu Perfil" />
      )}
      {isChangingPassword && <ChangePasswordModal onClose={() => setIsChangingPassword(false)} />}

      <DashboardContainer>
        <Title>Meu Perfil</Title>
        <ProfileCard>
          <Avatar>{userData.name?.charAt(0) || '?'}</Avatar>
          <ProfileContent>
            <ProfileInfo>
              <strong>Nome:</strong><p>{userData.name || 'Não informado'}</p>
              <strong>Username:</strong><p>{userData.username || 'Não informado'}</p>
              <strong>Email:</strong><p>{userData.email || 'Não informado'}</p>
              <strong>Telefone:</strong><p>{formatPhoneNumber(userData.phone) || 'Não informado'}</p>
              <strong>Criado em:</strong><p>{formatDate(userData.createdAt)}</p>
              <strong>Atualizado em:</strong><p>{formatDate(userData.updatedAt)}</p>
            </ProfileInfo>
          </ProfileContent>

          <ActionsContainer>
            {/* CORREÇÃO: Voltando a usar o ActionButton padrão (azul) */}
            <ActionButton onClick={() => setIsEditing(true)}>Editar Perfil</ActionButton>
            <DangerButton onClick={() => setIsChangingPassword(true)}>Alterar Senha</DangerButton>
          </ActionsContainer>
        </ProfileCard>
      </DashboardContainer>
    </Layout>
  );
};

export default withAuth(UserDashboard);