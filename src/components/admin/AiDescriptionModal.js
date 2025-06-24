import { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '@/api/axios';
import Button from '../common/Button';
import CancelButton from '../common/CancelButton';

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050; padding: 1rem;
`;

const ModalContent = styled.div`
  background: white; padding: 2rem; border-radius: 8px;
  width: 100%; max-width: 800px;
  max-height: 90vh; display: flex; flex-direction: column;
`;

const ModalHeader = styled.h2`
  margin-top: 0; margin-bottom: 1.5rem; text-align: center;
`;

const DescriptionContainer = styled.div`
  display: grid; grid-template-columns: 1fr;
  gap: 1.5rem; flex-grow: 1; overflow-y: auto;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const DescriptionBox = styled.div`
  display: flex; flex-direction: column;
  h3 { font-size: 1rem; margin-bottom: 0.5rem; color: #555; }
`;

const StyledTextarea = styled.textarea`
  width: 100%; flex-grow: 1; min-height: 250px;
  padding: 10px; border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem; font-family: inherit; resize: vertical;
  background-color: ${({ readOnly }) => readOnly ? '#f9f9f9' : '#fff'};
`;

const ButtonContainer = styled.div`
  display: flex; justify-content: flex-end;
  gap: 1rem; margin-top: 1.5rem;
`;

const AiDescriptionModal = ({ originalDescription, onSave, onClose }) => {
    const [aiDescription, setAiDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateDescription = async () => {
            if (!originalDescription) {
                setAiDescription("Não há descrição original para otimizar.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await apiClient.post('/ai/organize-description', {
                    description: originalDescription
                });
                setAiDescription(response.data);
            } catch (error) {
                console.error("Failed to generate AI description", error);
                setAiDescription("Erro ao gerar descrição. Tente novamente.");
            } finally {
                setIsLoading(false);
            }
        };
        generateDescription();
    }, [originalDescription]);

    const handleSave = () => {
        onSave(aiDescription);
        onClose();
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>Gerar Descrição com IA</ModalHeader>
                <DescriptionContainer>
                    <DescriptionBox>
                        <h3>Descrição Original</h3>
                        <StyledTextarea value={originalDescription} readOnly />
                    </DescriptionBox>
                    <DescriptionBox>
                        <h3>Nova Descrição (Editável)</h3>
                        <StyledTextarea
                            value={isLoading ? 'Gerando...' : aiDescription}
                            onChange={(e) => setAiDescription(e.target.value)}
                            readOnly={isLoading}
                        />
                    </DescriptionBox>
                </DescriptionContainer>
                <ButtonContainer>
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    <Button onClick={handleSave} disabled={isLoading}>
                        Salvar Nova Descrição
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default AiDescriptionModal;