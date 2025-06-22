import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.white};
  margin-top: auto;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <p>&copy; {new Date().getFullYear()} Casa Moreno. Todos os direitos reservados. TESTE WORKFLOW</p>
        </FooterContainer>
    );
};

export default Footer;