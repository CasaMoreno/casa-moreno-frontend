import styled from 'styled-components';

const InputWrapper = styled.div`
  margin-bottom: 1.25rem; 
  width: 100%;
  position: relative;
  /* Garante espaço para a mensagem de erro */
  padding-bottom: 1.1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 0.25rem;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid ${({ error, theme }) => (error ? theme.colors.error : '#ccc')}; // Lógica do contorno vermelho
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus {
      outline: none;
      border-color: ${({ error, theme }) => (error ? theme.colors.error : theme.colors.primaryBlue)};
      box-shadow: 0 0 0 2px ${({ error, theme }) => (error ? 'rgba(220, 53, 69, 0.2)' : 'rgba(42, 74, 135, 0.2)')};
    }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.8rem;
  font-weight: bold;
  position: absolute;
  /* Posiciona a mensagem de erro abaixo do campo */
  bottom: 0;
  left: 0;
  margin: 0;
`;

const Input = ({ id, label, required, error, ...props }) => {
    return (
        <InputWrapper>
            <Label htmlFor={id}>
                {label}
                {required && <RequiredIndicator>*</RequiredIndicator>}
            </Label>
            <StyledInput id={id} required={required} error={!!error} {...props} />
            {error && <ErrorText>{error}</ErrorText>}
        </InputWrapper>
    );
}

export default Input;