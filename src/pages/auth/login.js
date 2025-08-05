import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Link from 'next/link';
import apiClient from '@/api/axios';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
`;

const LoginForm = styled.form`
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  background-color: #fff;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
  
  p {
    margin-top: 1.5rem;
    text-align: center;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 2rem 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: #ccc;
  margin: 1.5rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #eee;
  }

  &:not(:empty)::before {
    margin-right: .5em;
  }

  &:not(:empty)::after {
    margin-left: .5em;
  }
`;

const GoogleButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  width: 100%;
  background-color: #fff;
  color: #444;
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9f9f9;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ForgotPasswordLink = styled.div`
  text-align: right;
  margin-top: -1rem;
  margin-bottom: 1.5rem;

  a {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const GoogleIcon = () => (
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const googleLoginUrl = `https://www.casa-moreno.com/oauth2/authorization/google?prompt=select_account`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <LoginContainer>
        <LoginForm onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input id="username" label="Usuário ou E-mail" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input id="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <ForgotPasswordLink>
            <Link href="/auth/forgot-password">
              Esqueceu sua senha?
            </Link>
          </ForgotPasswordLink>

          <Button type="submit" style={{ width: '100%', padding: '12px' }}>Entrar</Button>
          <Separator>ou</Separator>
          <GoogleButton href={googleLoginUrl}>
            <GoogleIcon />
            Entrar com o Google
          </GoogleButton>
          <p>
            Não tem uma conta? <Link href="/auth/register" style={{ color: '#2A4A87', fontWeight: 'bold' }}>Cadastre-se</Link>
          </p>
        </LoginForm>
      </LoginContainer>
    </Layout>
  );
};

export default LoginPage;