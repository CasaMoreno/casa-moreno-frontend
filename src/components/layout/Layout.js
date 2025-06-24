import styled from 'styled-components';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/hooks/useAuth'; // 1. Importar useAuth
import ChatWidget from '../common/ChatWidget'; // 2. Importar o ChatWidget

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrap = styled.main`
  flex: 1;
`;

const Layout = ({ children }) => {
  const { user } = useAuth(); // 3. Obter o status do usuário

  return (
    <PageContainer>
      <Navbar />
      <ContentWrap>{children}</ContentWrap>
      {/* 4. Renderizar o ChatWidget apenas se houver um usuário logado */}
      {user && <ChatWidget />}
      <Footer />
    </PageContainer>
  );
};

export default Layout;