import styled from 'styled-components';

const StyledInput = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 1rem;
`;

const Input = (props) => {
    return <StyledInput {...props} />;
}

export default Input;