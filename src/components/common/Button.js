// Arquivo: src/components/common/Button.js (VERSÃO FINAL E CORRIGIDA)

import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primaryBlue};
  color: white; /* Corrigido para garantir que o texto seja sempre branco */
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  text-decoration: none; /* Adicionado para garantir que links não sejam sublinhados */
  display: inline-flex; /* Adicionado para melhor alinhamento */
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryPurple};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default Button;