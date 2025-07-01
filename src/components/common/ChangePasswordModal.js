import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/api/axios';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CancelButton from '@/components/common/CancelButton';
import zxcvbn from 'zxcvbn';
import PasswordStrengthMeter from '@/components/common/PasswordStrengthMeter';
import { useNotification } from '@/hooks/useNotification';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 450px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ChangePasswordModal = ({ onClose }) => {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    // REMOVIDO: 'currentPassword' do estado
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validate = () => {
        const newErrors = {};
        // REMOVIDO: Validação da senha atual
        if (!passwords.newPassword) newErrors.newPassword = 'Nova senha é obrigatória.';
        else if (zxcvbn(passwords.newPassword).score < 2) newErrors.newPassword = 'A nova senha é muito fraca.';

        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        if (name === 'newPassword') {
            setPasswordStrength(zxcvbn(value).score);
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            // ATUALIZADO: A API agora só precisa do userId e da nova senha
            await apiClient.put('/users/update', {
                userId: user.userId,
                password: passwords.newPassword,
            });
            showNotification({ title: 'Sucesso', message: 'Senha alterada com sucesso!' });
            onClose();
        } catch (error) {
            setErrors({ api: error.response?.data?.message || 'Erro ao alterar a senha.' });
        }
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Form onSubmit={handleSubmit}>
                    <h2>Alterar Senha</h2>
                    {errors.api && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errors.api}</p>}
                    {/* REMOVIDO: Campo de senha atual */}
                    <Input id="newPassword" name="newPassword" type="password" label="Nova Senha" value={passwords.newPassword} onChange={handleChange} required error={errors.newPassword} />
                    <Input id="confirmPassword" name="confirmPassword" type="password" label="Confirme a Nova Senha" value={passwords.confirmPassword} onChange={handleChange} required error={errors.confirmPassword} />
                    <PasswordStrengthMeter score={passwordStrength} />
                    <ButtonContainer>
                        <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                        <Button type="submit">Salvar Nova Senha</Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default ChangePasswordModal;