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

  p, ul {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style-position: inside;
  }
`;

const PrivacyPolicyPage = () => {
    return (
        <Layout>
            <Head>
                <title>Política de Privacidade - Casa Moreno</title>
            </Head>
            <PageContainer>
                <PageTitle>Política de Privacidade</PageTitle>
                <Content>
                    <p>Última atualização: 01 de Julho de 2025</p>
                    <p>
                        A sua privacidade é importante para nós. É política da Casa Moreno respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site.
                    </p>

                    <h2>1. Coleta de Dados</h2>
                    <p>
                        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                    </p>
                    <p>As informações que coletamos incluem:</p>
                    <ul>
                        <li><strong>Dados de Cadastro:</strong> Nome, e-mail, nome de usuário, telefone e senha para criar e gerenciar sua conta.</li>
                        <li><strong>Foto de Perfil:</strong> Se fornecida, para personalizar sua experiência.</li>
                        <li><strong>Dados de Navegação:</strong> Informações sobre como você utiliza nosso site, como páginas visitadas e produtos visualizados, para melhorar nossos serviços.</li>
                    </ul>

                    <h2>2. Uso dos Dados</h2>
                    <p>
                        Utilizamos os dados coletados para operar, manter e melhorar nosso site, personalizar sua experiência, e para fins de autenticação e segurança. Seu e-mail e telefone podem ser usados para comunicações importantes sobre sua conta ou para fins de recuperação de senha.
                    </p>

                    <h2>3. Links para Terceiros</h2>
                    <p>
                        A Casa Moreno atua como um afiliado, o que significa que exibimos produtos e ofertas de lojas parceiras. Ao clicar em um link de oferta, você será redirecionado para o site do varejista. Esteja ciente de que não temos controle sobre o conteúdo e as práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade. A transação de compra, pagamento e entrega são de inteira responsabilidade do site parceiro.
                    </p>

                    <h2>4. Segurança</h2>
                    <p>
                        A segurança de seus dados é uma prioridade. Empregamos medidas de segurança para proteger suas informações contra perda ou roubo, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                    </p>

                    <h2>5. Seus Direitos</h2>
                    <p>
                        Você tem o direito de editar suas informações de perfil a qualquer momento através do seu painel de usuário. Você também pode solicitar a exclusão de sua conta, entrando em contato conosco.
                    </p>

                    <p>
                        O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
                    </p>
                </Content>
            </PageContainer>
        </Layout>
    );
};

export default PrivacyPolicyPage;