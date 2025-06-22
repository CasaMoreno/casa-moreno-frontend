import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { formatPhoneNumber } from '@/utils/formatters';
import PasswordStrengthMeter from '@/components/common/PasswordStrengthMeter';
import zxcvbn from 'zxcvbn';

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
`;

const RegisterForm = styled.form`
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  background-color: #fff;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const FormGroup = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
`;

const GroupTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FormFooterText = styled.p`
    font-size: 0.8rem;
    color: #666;
    margin-top: 1.5rem;
    text-align: center;
`;

const RegisterPage = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Nome completo é obrigatório.';
        } else if (formData.name.trim().indexOf(' ') === -1) {
            newErrors.name = 'Por favor, insira nome e sobrenome.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Nome de usuário é obrigatório.';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória.';
        } else if (zxcvbn(formData.password).score < 2) {
            newErrors.password = 'A senha é muito fraca.';
        }

        if (!formData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'Confirme sua senha.';
        } else if (formData.password && formData.password !== formData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'As senhas não coincidem.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let processedValue = value;
        if (name === 'phone') {
            processedValue = formatPhoneNumber(value);
        }

        if (name === 'password') {
            setPasswordStrength(zxcvbn(value).score);
        }

        setFormData({ ...formData, [name]: processedValue });

        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const { passwordConfirmation, ...dataToRegister } = {
                ...formData,
                phone: formData.phone.replace(/\D/g, '')
            };
            await register(dataToRegister);
        } catch (err) {
            setErrors({ form: err.message });
        }
    };

    return (
        <Layout>
            <RegisterContainer>
                <RegisterForm onSubmit={handleSubmit}>
                    <h2>Crie sua Conta</h2>

                    <FormGroup>
                        <GroupTitle>Informações Pessoais</GroupTitle>
                        <Input id="name" name="name" type="text" label="Nome Completo" value={formData.name} onChange={handleChange} required error={errors.name} />
                        <Input id="email" name="email" type="email" label="E-mail" value={formData.email} onChange={handleChange} required error={errors.email} />
                        <Input id="phone" name="phone" type="tel" label="Telefone (Opcional)" value={formData.phone} onChange={handleChange} maxLength="15" />
                    </FormGroup>

                    <FormGroup>
                        <GroupTitle>Informações da Conta</GroupTitle>
                        <Input id="username" name="username" type="text" label="Nome de Usuário" value={formData.username} onChange={handleChange} required error={errors.username} />
                        <Input id="password" name="password" type="password" label="Senha" value={formData.password} onChange={handleChange} required error={errors.password} />
                        <Input id="passwordConfirmation" name="passwordConfirmation" type="password" label="Confirme sua Senha" value={formData.passwordConfirmation} onChange={handleChange} required error={errors.passwordConfirmation} />
                        <PasswordStrengthMeter score={passwordStrength} />
                    </FormGroup>

                    {errors.form && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errors.form}</p>}
                    <Button type="submit" style={{ width: '100%', padding: '12px' }}>Criar Conta</Button>

                    <FormFooterText>(*) Campos obrigatórios</FormFooterText>
                </RegisterForm>
            </RegisterContainer>
        </Layout>
    );
};

export default RegisterPage;