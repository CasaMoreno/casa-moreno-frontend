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
import Avatar from '@/components/common/Avatar'; // Importar Avatar
import ProfilePictureModal from '@/components/common/ProfilePictureModal'; // Importar Modal

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

// Container para o Avatar e o botão de upload
const AvatarContainer = styled.div`
  position: relative;
  
  &:hover button {
    opacity: 1;
  }
`;

const UploadButton = styled(Button)`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
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

const DangerButton = styled(ActionButton)`
    background-color: ${({ theme }) => theme.colors.error};
    &:hover {
        background-color: #c82333;
    }
`;

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);


const UserDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false); // Estado para o modal da foto
  const { showNotification } = useNotification();

  const fetchUserData = () => {
    if (authUser) {
      apiClient.get(`/users/username?username=${authUser.username}`)
        .then(response => setUserData(response.data))
        .catch(error => { console.error("Falha ao buscar dados do usuário:", error); });
    }
  }

  useEffect(() => {
    fetchUserData();
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

  const handleUploadSuccess = (newUrl) => {
    // Atualiza a URL da foto no estado local para refletir a mudança imediatamente
    setUserData(prev => ({ ...prev, profilePictureUrl: newUrl }));
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

      {isPictureModalOpen && (
        <ProfilePictureModal
          userId={userData.userId}
          onClose={() => setIsPictureModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      <DashboardContainer>
        <Title>Meu Perfil</Title>
        <ProfileCard>
          <AvatarContainer>
            <Avatar user={userData} />
            <UploadButton onClick={() => setIsPictureModalOpen(true)} title="Alterar foto de perfil">
              <UploadIcon />
            </UploadButton>
          </AvatarContainer>

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
            <ActionButton onClick={() => setIsEditing(true)}>Editar Perfil</ActionButton>
            <DangerButton onClick={() => setIsChangingPassword(true)}>Alterar Senha</DangerButton>
          </ActionsContainer>
        </ProfileCard>
      </DashboardContainer>
    </Layout>
  );
};

export default withAuth(UserDashboard);