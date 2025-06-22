import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Link from 'next/link';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #f9f9f9; // Adicionado para consistência
  min-height: calc(100vh - 140px); // Adicionado para consistência
`;

const LoginForm = styled.form`
  padding: 2.5rem; // Aumentado para consistência
  border-radius: 8px; // Aumentado para consistência
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); // Sombra mais suave
  width: 100%;
  max-width: 400px;
  background-color: #fff;

  h2 {
    text-align: center;
    margin-bottom: 2rem; // Aumentado para consistência
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
  
  p {
    margin-top: 1.5rem;
    text-align: center;
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

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

                    {/* --- ALTERAÇÃO AQUI --- */}
                    <Input
                        id="username"
                        label="Usuário"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    {/* --- ALTERAÇÃO AQUI --- */}
                    <Input
                        id="password"
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" style={{ width: '100%', marginTop: '1rem', padding: '12px' }}>Entrar</Button>
                    <p>
                        Não tem uma conta? <Link href="/auth/register" style={{ color: '#2A4A87', fontWeight: 'bold' }}>Cadastre-se</Link>
                    </p>
                </LoginForm>
            </LoginContainer>
        </Layout>
    );
};

export default LoginPage;