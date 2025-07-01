import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import Head from 'next/head';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
  min-height: calc(100vh - 280px);
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

  p, ol {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  ol {
    list-style-position: inside;
    padding-left: 1rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const TermsOfUsePage = () => {
    return (
        <Layout>
            <Head>
                <title>Termos de Uso - Casa Moreno</title>
            </Head>
            <PageContainer>
                <PageTitle>Termos de Uso</PageTitle>
                <Content>

                    <h2>1. Relacionamento</h2>
                    <p>
                        Ao utilizar o site Casa Moreno ("Site"), você concorda em cumprir estes Termos de Uso. Este Site atua como um agregador e curador de ofertas de produtos eletrônicos de sites de terceiros ("Parceiros"). Nós não vendemos, estocamos ou garantimos qualquer produto listado.
                    </p>

                    <h2>2. Processo de Compra</h2>
                    <p>
                        Todas as transações de compra ocorrem exclusivamente nos sites dos nossos Parceiros. A Casa Moreno não se responsabiliza pelo processo de compra, incluindo pagamento, entrega, garantia, devoluções ou suporte ao cliente relacionado ao produto. Quaisquer problemas devem ser resolvidos diretamente com o varejista onde a compra foi efetuada.
                    </p>

                    <h2>3. Precisão das Informações</h2>
                    <p>
                        Embora nos esforcemos para manter as informações de produtos, preços e disponibilidade atualizadas, podem ocorrer discrepâncias devido ao tempo de sincronização com os sistemas dos Parceiros. O preço final, as condições e a disponibilidade de estoque válidos são sempre os exibidos no site do Parceiro no momento da compra.
                    </p>

                    <h2>4. Responsabilidade do Usuário</h2>
                    <p>
                        Ao criar uma conta na Casa Moreno, você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Você concorda em usar o site de forma legal e a não se envolver em qualquer atividade que possa prejudicar o site ou seus usuários.
                    </p>

                    <h2>5. Modificações nos Termos</h2>
                    <p>
                        Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre alterações significativas, mas é sua responsabilidade revisar periodicamente estes termos. O uso continuado do site após as alterações constitui sua aceitação dos novos termos.
                    </p>

                </Content>
            </PageContainer>
        </Layout>
    );
};

export default TermsOfUsePage;