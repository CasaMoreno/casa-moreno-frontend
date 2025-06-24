import { useState } from 'react';
import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Link from 'next/link';
import apiClient from '@/api/axios';

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
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }

  p {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }
`;

const Message = styled.p`
  color: ${({ theme, type }) => (type === 'success' ? '#28a745' : theme.colors.error)};
  text-align: center;
  margin-top: 1rem;
  font-weight: bold;
`;


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');

        try {
            const response = await apiClient.post('/users/forgot-password', null, {
                params: { email }
            });
            setMessage(response.data);
        } catch (err) {
            setError('Ocorreu um erro. Verifique o e-mail e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Container>
                <FormWrapper>
                    <h2>Esqueceu sua senha?</h2>
                    <p>Não se preocupe. Insira seu e-mail abaixo e enviaremos um link para você cadastrar uma nova senha.</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            id="email"
                            label="Seu E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px' }}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Link de Redefinição'}
                        </Button>
                    </form>
                    {message && <Message type="success">{message}</Message>}
                    {error && <Message type="error">{error}</Message>}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link href="/auth/login" style={{ color: '#2A4A87' }}>
                            Voltar para o Login
                        </Link>
                    </div>
                </FormWrapper>
            </Container>
        </Layout>
    );
};

export default ForgotPasswordPage;