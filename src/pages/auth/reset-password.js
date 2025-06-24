import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import PasswordStrengthMeter from '@/components/common/PasswordStrengthMeter';
import zxcvbn from 'zxcvbn';
import apiClient from '@/api/axios';
import { useNotification } from '@/hooks/useNotification';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
`;

const FormWrapper = styled.div`
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  background-color: #fff;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  text-align: center;
  margin-bottom: 1rem;
  font-weight: bold;
`;


const ResetPasswordPage = () => {
    const router = useRouter();
    const { showNotification } = useNotification();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (router.isReady) {
            const { token: tokenFromQuery } = router.query;
            if (tokenFromQuery) {
                setToken(tokenFromQuery);
            } else {
                setError('Token de redefinição inválido ou ausente.');
            }
        }
    }, [router.isReady, router.query]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(zxcvbn(newPassword).score);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (passwordStrength < 2) {
            setError('A senha é muito fraca.');
            return;
        }
        if (!token) {
            setError('Token de redefinição não encontrado.');
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.post('/users/reset-password', {
                token: token,
                newPassword: password,
            });
            showNotification({
                title: 'Sucesso!',
                message: 'Sua senha foi redefinida. Você já pode fazer o login.',
            });
            router.push('/auth/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Token inválido ou expirado. Por favor, solicite um novo link.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Container>
                <FormWrapper>
                    <h2>Crie sua nova senha</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="password"
                            label="Nova Senha"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />

                        <Input
                            id="confirmPassword"
                            label="Confirme a Nova Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {/* --- ALTERAÇÃO AQUI --- */}
                        {/* O medidor de força da senha foi movido para baixo do campo de confirmação */}
                        <PasswordStrengthMeter score={passwordStrength} />

                        {error && <ErrorMessage>{error}</ErrorMessage>}

                        <Button type="submit" disabled={isSubmitting || !token} style={{ width: '100%', padding: '12px', marginTop: '1rem' }}>
                            {isSubmitting ? 'Salvando...' : 'Redefinir Senha'}
                        </Button>
                    </form>
                </FormWrapper>
            </Container>
        </Layout>
    );
};

export default ResetPasswordPage;