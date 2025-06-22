import React from 'react';
import styled from 'styled-components';

const StrengthMeterContainer = styled.div`
  margin-top: -0.5rem;
  margin-bottom: 1rem;
`;

const StrengthBar = styled.div`
  display: flex;
  height: 6px;
  border-radius: 3px;
  background-color: #eee;
  overflow: hidden;
  margin-bottom: 0.25rem;
`;

const StrengthLevel = styled.div`
  height: 100%;
  width: ${({ score }) => (score / 4) * 100}%;
  background-color: ${({ color }) => color};
  transition: width 0.3s ease-in-out, background-color 0.3s ease-in-out;
`;

const StrengthText = styled.p`
  font-size: 0.8rem;
  font-weight: bold;
  text-align: right;
  color: ${({ color }) => color};
  transition: color 0.3s ease-in-out;
  height: 1.2em; // Garante que o espaço seja reservado mesmo quando vazio
`;

const strengthLevels = [
    { text: '', color: '#eee' },
    { text: 'Muito Fraca', color: '#dc3545' },
    { text: 'Fraca', color: '#fd7e14' },
    { text: 'Média', color: '#ffc107' },
    { text: 'Forte', color: '#28a745' },
];

const PasswordStrengthMeter = ({ score }) => {
    const level = strengthLevels[score] || strengthLevels[0];

    return (
        <StrengthMeterContainer>
            <StrengthBar>
                <StrengthLevel score={score} color={level.color} />
            </StrengthBar>
            <StrengthText color={level.color}>{level.text}</StrengthText>
        </StrengthMeterContainer>
    );
};

export default PasswordStrengthMeter;