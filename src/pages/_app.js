import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import GlobalStyles from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import Head from 'next/head';
import { useRouter } from 'next/router'; // 1. IMPORTAR O useRouter

function MyApp({ Component, pageProps }) {
  const router = useRouter(); // 2. INICIAR O HOOK
  const canonicalUrl = `https://www.casa-moreno.com${router.asPath === '/' ? '' : router.asPath}`.split('?')[0]; // 3. CONSTRUIR A URL CANÔNICA

  return (
    <>
      <Head>
        <title>Casa Moreno - A melhor loja do mundo</title>
        <meta name="description" content="Encontre as melhores ofertas em smartphones e eletrônicos na Casa Moreno." />
        {/* 4. ADICIONAR A TAG CANÔNICA */}
        <link rel="canonical" href={canonicalUrl} />
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