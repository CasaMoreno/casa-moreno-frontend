import styled from 'styled-components';
import Button from '../common/Button';

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
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.25);
  width: 100%;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.primaryBlue)};
`;

const ReportContainer = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
`;

const LogLine = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 2px 0;
  color: ${({ color }) => color || 'inherit'};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const SyncReportModal = ({ isOpen, onClose, report, error }) => {
    if (!isOpen) return null;

    const hasError = !!error;
    const title = hasError ? "Erro na Sincronização" : "Relatório de Sincronização";
    const content = hasError ? error : report || "Nenhum relatório gerado.";

    const renderColoredReport = (text) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            const lowerCaseLine = line.toLowerCase();
            let color = '#333';

            if (lowerCaseLine.includes('criado') || lowerCaseLine.includes('sincronizado')) {
                color = '#28a745'; // Verde
            } else if (lowerCaseLine.includes('alterado') || lowerCaseLine.includes('atualizado')) {
                // ALTERAÇÃO AQUI: Cor alterada para laranja
                color = '#fd7e14';
            } else if (lowerCaseLine.includes('erro') || lowerCaseLine.includes('falha')) {
                color = '#dc3545'; // Vermelho
            }

            return <LogLine key={index} color={color}>{line}</LogLine>;
        });
    };

    return (
        <ModalBackdrop>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle hasError={hasError}>{title}</ModalTitle>
                </ModalHeader>
                <ReportContainer>
                    {renderColoredReport(content)}
                </ReportContainer>
                <ModalFooter>
                    <Button onClick={onClose}>OK</Button>
                </ModalFooter>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default SyncReportModal;