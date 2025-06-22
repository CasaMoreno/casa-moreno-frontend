import { useState } from 'react';
import styled from 'styled-components';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import CancelButton from '@/components/common/CancelButton';
import { formatPhoneNumber } from '@/utils/formatters';

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
  max-width: 500px;
  h2 {
    margin-top: 0;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const UserEditModal = ({ user, onClose, onSave, title = "Editar Perfil" }) => {
    const [formData, setFormData] = useState({
        userId: user.userId,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: formatPhoneNumber(user.phone) || '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório.';
        if (!formData.username.trim()) newErrors.username = 'Usuário é obrigatório.';
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = name === 'phone' ? formatPhoneNumber(value) : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            ...formData,
            phone: formData.phone.replace(/\D/g, '')
        };
        onSave(payload);
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Form onSubmit={handleSubmit}>
                    <h2>{title}</h2>
                    <Input id="edit-name" name="name" label="Nome Completo" value={formData.name} onChange={handleChange} required error={errors.name} />
                    <Input id="edit-username" name="username" label="Nome de Usuário" value={formData.username} onChange={handleChange} required error={errors.username} />
                    <Input id="edit-email" name="email" type="email" label="Email" value={formData.email} onChange={handleChange} required error={errors.email} />
                    <Input id="edit-phone" name="phone" type="tel" label="Telefone (Opcional)" value={formData.phone} onChange={handleChange} maxLength="15" />

                    <ButtonContainer>
                        <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
                        <Button type="submit">Salvar Alterações</Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default UserEditModal;