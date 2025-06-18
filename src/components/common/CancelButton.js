// Arquivo: src/components/common/CancelButton.js (NOVO ARQUIVO)

import styled from 'styled-components';
import Button from './Button'; // Importa o botão base

const CancelButton = styled(Button)`
  background-color: #dc3545; // Vermelho
  border-color: #dc3545;
  color: white;

  &:hover {
    background-color: #c82333; // Vermelho mais escuro
    border-color: #c82333;
  }
`;

export default CancelButton;