import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    font-family: ${({ theme }) => theme.fonts.main};
    color: ${({ theme }) => theme.colors.darkGray};
    background-color: ${({ theme }) => theme.colors.white};
  }

  /* ESTA É A SEÇÃO IMPORTANTE */
  a {
    color: inherit;         /* Faz o link herdar a cor do elemento pai */
    text-decoration: none;  /* Remove o sublinhado */
  }
`;

export default GlobalStyles;