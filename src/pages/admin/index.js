// src/pages/admin/index.js
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import apiClient from '@/api/axios';
import Button from '@/components/common/Button';
import UserEditModal from '@/components/admin/UserEditModal';
import Link from 'next/link';

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
  margin-bottom: 1.5rem; /* Ajustado para aproximar dos botões abaixo */
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: relative; /* Essencial para posicionar o botão "Editar Perfil" */
  
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
    width: 100%;
    display: flex; /* Adicionado para controlar o alinhamento interno */
    flex-direction: column; /* Conteúdo empilhado verticalmente */
    align-items: flex-start; /* Alinhamento padrão para o início */

    @media ${({ theme }) => theme.breakpoints.mobile} {
      align-items: center; /* Centraliza o conteúdo na vertical em mobile */
    }
`;

/* REMOVIDO: ProfileHeader não é mais necessário, pois o botão foi movido */
// const ProfileHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   h2 {
//     margin: 0;
//     font-size: 1.8rem;
//   }
//
//   @media ${({ theme }) => theme.breakpoints.mobile} {
//     flex-direction: column;
//     gap: 1rem;
//     text-align: center;
//     h2 {
//         font-size: 1.5rem;
//     }
//   }
// `;

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

// Botão para edição de perfil, agora posicionado absolutamente
const EditProfileButton = styled(Button)`
  position: absolute;
  top: 1.5rem; /* Distância do topo do ProfileCard */
  right: 1.5rem; /* Distância da direita do ProfileCard */
  padding: 8px 16px;
  font-size: 0.9rem;
  z-index: 10; /* Garante que o botão fique acima de outros elementos */

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static; /* Remove o posicionamento absoluto no mobile */
    margin-top: 1rem; /* Adiciona espaço acima do botão no mobile */
    width: 100%; /* Ocupa a largura total no mobile */
    max-width: 200px; /* Limita a largura para melhor visualização no mobile */
    align-self: center; /* Centraliza o botão no mobile se ProfileCard for flex-column */
  }
`;


const AdminButtonsContainer = styled.div`
  display: flex;
  justify-content: center; /* Centraliza os botões */
  gap: 2rem; /* Espaçamento entre os botões */
  margin-top: 1rem; /* Ajustado para aproximar dos dados do admin */
  width: 100%; /* Ocupa a largura total do DashboardContainer */

  @media ${({ theme }) => theme.breakpoints.mobile} {
    flex-direction: column; /* Empilha os botões em telas pequenas */
    align-items: center; /* Centraliza os botões empilhados */
    gap: 1.5rem;
  }
`;

const AdminButtonCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1; /* Permite que ocupe o espaço disponível */
  min-width: 250px; /* Garante um tamanho mínimo */
  height: 120px; /* Altura fixa para consistência */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 1.2rem;
    padding: 1.5rem;
    height: 100px;
    width: 100%; /* Ocupa a largura total disponível quando empilhado */
    max-width: 300px; /* Limita a largura em mobile para não ficar muito grande */
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
            {/* Removido o h2 "Meus Dados" daqui e o ProfileHeader que o envolvia */}
            <ProfileInfo>
              <strong>Nome:</strong><p>{userData.name}</p>
              <strong>Username:</strong><p>{userData.username}</p>
              <strong>Email:</strong><p>{userData.email}</p>
              <strong>Telefone:</strong><p>{userData.phone || 'Não informado'}</p>
              <strong>Criado em:</strong><p>{formatDate(userData.createdAt)}</p>
              <strong>Atualizado em:</strong><p>{formatDate(userData.updatedAt)}</p>
            </ProfileInfo>
          </ProfileContent>
          {/* Botão de edição de perfil agora posicionado aqui */}
          <EditProfileButton onClick={() => setIsEditing(true)}>Editar Perfil</EditProfileButton>
        </ProfileCard>

        {authUser?.scope === 'ADMIN' && (
          <AdminButtonsContainer>
            <Link href="/admin/products" passHref legacyBehavior>
              <AdminButtonCard as="a">Gerenciamento de Produtos</AdminButtonCard>
            </Link>
            <Link href="/admin/users" passHref legacyBehavior>
              <AdminButtonCard as="a">Gerenciamento de Usuários</AdminButtonCard>
            </Link>
          </AdminButtonsContainer>
        )}
      </DashboardContainer>
    </Layout>
  );
};

export default withAuth(UserDashboard);
