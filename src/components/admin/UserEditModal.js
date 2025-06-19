// src/components/admin/UserEditModal.js (VERSÃO COM MÁSCARA DE TELEFONE)

import { useState } from 'react';
import styled from 'styled-components';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { formatPhoneNumber } from '@/utils/formatters'; // NOVO: Importa a função

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
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 500px;
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #333;
`;


const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const UserEditModal = ({ user, onClose, onSave, title = "Editar Usuário" }) => {
    const [formData, setFormData] = useState({
        userId: user.userId,
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        phone: formatPhoneNumber(user.phone) || '', // Formata o valor inicial
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Aplica a formatação apenas no campo de telefone
        if (name === 'phone') {
            setFormData({ ...formData, [name]: formatPhoneNumber(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Remove a formatação do telefone antes de enviar para o backend
        const dataToSave = {
            ...formData,
            phone: formData.phone.replace(/\D/g, '') // Envia apenas os dígitos
        };

        const dataToUpdate = Object.fromEntries(
            Object.entries(dataToSave).filter(([key, value]) => value !== '')
        );

        onSave(dataToUpdate);
    };

    return (
        <ModalBackdrop>
            <ModalContent onClick={e => e.stopPropagation()}>
                <h2>{title}</h2>
                <Form onSubmit={handleSubmit}>
                    <Label>Nome Completo</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />

                    <Label>Nome de Usuário</Label>
                    <Input name="username" value={formData.username} onChange={handleChange} required />

                    <Label>Email</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required />

                    <Label>Telefone</Label>
                    <Input
                        name="phone"
                        type="tel"
                        placeholder="(xx) xxxxx-xxxx"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength="15"
                    />

                    <Label>Nova Senha (opcional)</Label>
                    <Input name="password" type="password" placeholder="Deixe em branco para não alterar" value={formData.password} onChange={handleChange} />

                    <ButtonContainer>
                        <Button type="button" onClick={onClose} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                        <Button type="submit">Salvar Alterações</Button>
                    </ButtonContainer>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default UserEditModal;