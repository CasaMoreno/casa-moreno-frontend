import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
`;

const RegisterForm = styled.form`
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const RegisterPage = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout>
            <RegisterContainer>
                <RegisterForm onSubmit={handleSubmit}>
                    <h2>Cadastro</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Input name="name" type="text" placeholder="Nome Completo" onChange={handleChange} required />
                    <Input name="username" type="text" placeholder="Nome de Usuário" onChange={handleChange} required />
                    <Input name="email" type="email" placeholder="E-mail" onChange={handleChange} required />
                    <Input name="password" type="password" placeholder="Senha" onChange={handleChange} required />
                    <Input name="phone" type="tel" placeholder="Telefone (Opcional)" onChange={handleChange} />
                    <Button type="submit" style={{ width: '100%' }}>Cadastrar</Button>
                </RegisterForm>
            </RegisterContainer>
        </Layout>
    );
};

export default RegisterPage;