import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.white};
  margin-top: auto;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1.5rem 1rem;
  }
`;

const Footer = () => {
    return (
        <FooterContainer>
            <p>&copy; {new Date().getFullYear()} Casa Moreno. Todos os direitos reservados.</p>
        </FooterContainer>
    );
};

export default Footer;