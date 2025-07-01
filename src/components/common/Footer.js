import styled from 'styled-components';
import Link from 'next/link';

// --- Ícones ---
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// --- Componentes Estilizados ---
const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.darkGray};
  color: ${({ theme }) => theme.colors.white};
  padding: 4rem 2rem 0;
  margin-top: auto;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 2.5rem 1rem 0;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
  padding-bottom: 3rem;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const LogoText = styled.span`
  font-family: 'Pacifico', cursive;
  font-size: 2rem;
  font-weight: 400;
  color: white;
  margin-bottom: 0.25rem;
`;

const ColumnTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterLink = styled(Link)`
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s ease;
  width: fit-content;

  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const SocialIcon = styled.a`
  color: #ccc;
  transition: color 0.2s ease, transform 0.2s ease;
  
  &:hover {
    color: white;
    transform: translateY(-2px);
  }
`;

const PaymentMethods = styled.div`
    img {
        height: 25px;
        margin-right: 8px;
        background-color: white;
        border-radius: 4px;
        padding: 2px;
    }
`;

const FooterBottomBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 0;
  border-top: 1px solid #444;
  text-align: center;
  font-size: 0.9rem;
  color: #aaa;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <LogoText>Casa Moreno</LogoText>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Institucional</ColumnTitle>
          <FooterLink href="/info/about-us">Sobre Nós</FooterLink>
          <FooterLink href="/info/privacy-policy">Política de Privacidade</FooterLink>
          <FooterLink href="/info/terms-of-use">Termos de Uso</FooterLink>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Pagamento</ColumnTitle>
          <PaymentMethods>
            <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
            <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
            <img src="https://img.icons8.com/color/48/pix.png" alt="Pix" />
            <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
          </PaymentMethods>
        </FooterColumn>

        <FooterColumn>
          <ColumnTitle>Contato</ColumnTitle>
          <SocialLinks>
            <SocialIcon href="https://www.instagram.com/casamoreno_br/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href="https://wa.me/message/IGQFSCDL3FLFE1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon />
            </SocialIcon>
          </SocialLinks>
        </FooterColumn>

      </FooterContent>
      <FooterBottomBar>
        <p>&copy; {new Date().getFullYear()} Casa Moreno. Todos os direitos reservados.</p>
      </FooterBottomBar>
    </FooterContainer>
  );
};

export default Footer;