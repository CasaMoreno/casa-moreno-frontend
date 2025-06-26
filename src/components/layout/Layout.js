import styled from 'styled-components';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useAuth } from '@/hooks/useAuth';
import ChatWidget from '../common/ChatWidget';
import Marquee from '../common/Marquee';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrap = styled.main`
  flex: 1;
`;

// O layout agora aceita a propriedade "marqueeProducts"
const Layout = ({ children, marqueeProducts }) => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <Navbar />
      {/* O letreiro só será exibido se receber os produtos */}
      {marqueeProducts && <Marquee products={marqueeProducts} />}
      <ContentWrap>{children}</ContentWrap>
      {user && <ChatWidget />}
      <Footer />
    </PageContainer>
  );
};

export default Layout;