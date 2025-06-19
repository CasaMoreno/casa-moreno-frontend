import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import GlobalStyles from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Casa Moreno - A melhor loja do mundo</title>
        <meta name="description" content="Encontre as melhores ofertas em smartphones e eletrônicos na Casa Moreno." />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthProvider>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;