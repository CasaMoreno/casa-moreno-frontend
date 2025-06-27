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
import Avatar from '@/components/common/Avatar';
import ProfilePictureModal from '@/components/common/ProfilePictureModal';

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
    gap: 1.5rem;
  }
`;

// --- INÍCIO DAS ALTERAÇÕES ---

const AvatarContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const EditIconOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.primaryBlue};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const ProfileContent = styled.div`
  flex-grow: 1;
  width: 100%;
`;

// Layout de informações aprimorado
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  
  strong {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
    word-break: break-all;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  /* Em telas maiores, fica na vertical no canto */
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 5;

  /* Em telas menores, fica na horizontal abaixo das informações */
  @media ${({ theme }) => theme.breakpoints.tablet} {
    position: static;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
    order: 3;
  }
  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
    order: 3;
  }
`;

// --- FIM DAS ALTERAÇÕES ---

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

const UserDashboard = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
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
    setUserData(prev => ({ ...prev, profilePictureUrl: newUrl }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
          <AvatarContainer onClick={() => setIsPictureModalOpen(true)}>
            <Avatar user={userData} />
            <EditIconOverlay title="Alterar Foto">
              <EditIcon />
            </EditIconOverlay>
          </AvatarContainer>

          <ProfileContent>
            <ProfileInfo>
              <InfoItem>
                <strong>Nome</strong>
                <p>{userData.name || 'Não informado'}</p>
              </InfoItem>
              <InfoItem>
                <strong>Email</strong>
                <p>{userData.email || 'Não informado'}</p>
              </InfoItem>
              <InfoItem>
                <strong>Telefone</strong>
                <p>{formatPhoneNumber(userData.phone) || 'Não informado'}</p>
              </InfoItem>
              <InfoItem>
                <strong>Membro desde</strong>
                <p>{formatDate(userData.createdAt)}</p>
              </InfoItem>
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