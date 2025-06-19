import styled from 'styled-components';
import Button from './Button';
import CancelButton from './CancelButton';

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
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.25);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primaryBlue};
`;

const ModalMessage = styled.p`
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.darkGray};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    isConfirmation,
    onConfirm,
    onClose,
}) => {
    if (!isOpen) {
        return null;
    }

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalTitle>{title}</ModalTitle>
                <ModalMessage>{message}</ModalMessage>
                <ButtonContainer>
                    {isConfirmation && (
                        <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    )}
                    <Button onClick={handleConfirm}>
                        {isConfirmation ? 'Confirmar' : 'OK'}
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default ConfirmationModal;