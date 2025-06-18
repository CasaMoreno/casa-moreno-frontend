import styled from 'styled-components';
import Layout from '@/components/layout/Layout';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  padding: 0 1rem;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
  }
`;

const HomePage = () => {
    return (
        <Layout>
            <HeroSection>
                <h1>Bem-vindo à Casa Moreno</h1>
                <p>Os melhores eletrônicos e smartphones você encontra aqui.</p>
            </HeroSection>
        </Layout>
    );
};

export default HomePage;