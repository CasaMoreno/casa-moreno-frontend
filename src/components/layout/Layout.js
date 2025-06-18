import styled from 'styled-components';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrap = styled.main`
  flex: 1;
`;

const Layout = ({ children }) => {
  return (
    <PageContainer>
      <Navbar />
      <ContentWrap>{children}</ContentWrap>
      <Footer />
    </PageContainer>
  );
};

export default Layout;