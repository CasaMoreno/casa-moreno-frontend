import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
  min-height: calc(100vh - 280px); /* Ajuste para garantir que o footer não suba */
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primaryBlue};
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.lightGray};
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 2rem;
  }
`;

const Content = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.darkGray};

  p {
    margin-bottom: 1.5rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const AboutUsPage = () => {
    return (
        <Layout>
            <Head>
                <title>Sobre Nós - Casa Moreno</title>
                <meta name="description" content="Conheça a história e a missão da Casa Moreno, a sua curadora de ofertas de tecnologia." />
            </Head>
            <PageContainer>
                <PageTitle>Sobre Nós</PageTitle>
                <Content>
                    <p>
                        Bem-vindo à <strong>Casa Moreno</strong>, a sua vitrine inteligente para o universo da tecnologia! Nascemos com uma missão clara: simplificar a sua busca pelas melhores ofertas de eletrônicos, reunindo em um só lugar as oportunidades mais incríveis dos maiores e mais confiáveis varejistas do Brasil.
                    </p>
                    <p>
                        Em um mercado repleto de opções, sabemos como pode ser desafiador encontrar o produto ideal pelo preço justo. É por isso que existimos. Atuamos como seus curadores de tecnologia, utilizando sistemas inteligentes para rastrear, analisar e apresentar apenas as ofertas que realmente valem a pena. Não somos uma loja, mas sim o seu melhor atalho para um bom negócio.
                    </p>
                    <p>
                        Nosso compromisso é com a <strong>transparência e a confiança</strong>. Ao encontrar uma oferta na Casa Moreno, você é redirecionado para o site do nosso parceiro, um ambiente de compra seguro e consolidado, para finalizar sua aquisição com toda a tranquilidade e garantia que você merece.
                    </p>
                    <p>
                        Na Casa Moreno, você encontra "A melhor loja do Mundo !", porque o nosso mundo é feito das melhores oportunidades para você.
                    </p>
                </Content>
            </PageContainer>
        </Layout>
    );
};

export default AboutUsPage;