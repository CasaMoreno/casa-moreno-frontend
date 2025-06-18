import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';
import GlobalStyles from '@/styles/GlobalStyles'; // Importado aqui
import { theme } from '@/styles/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles /> {/* // E usado aqui */}
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;