// src/pages/_app.js (VERSÃO COM TÍTULO PADRÃO)

import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';
import GlobalStyles from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import Head from 'next/head'; // NOVO: Importa o componente Head

function MyApp({ Component, pageProps }) {
  return (
    <> {/* Usamos um fragmento para agrupar os elementos */}
      <Head>
        <title>Casa Moreno - A melhor loja do mundo</title>
        <meta name="description" content="Encontre as melhores ofertas em smartphones e eletrônicos na Casa Moreno." />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;