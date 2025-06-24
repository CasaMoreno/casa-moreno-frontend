import { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import apiClient from '@/api/axios';

// Animações
const fadeIn = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;

// Estilos
const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatWindow = styled.div`
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${({ isClosing }) => isClosing ? css`${fadeOut} 0.3s forwards` : css`${fadeIn} 0.3s ease-out`};

  /* --- INÍCIO DA ALTERAÇÃO --- */
  /* Ajustes para telas de celular e tablets */
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: calc(100vw - 40px); /* Largura um pouco menor para dar mais margem */
    height: 480px; /* Altura fixa e menor para não ocupar a tela toda */
    /* As propriedades de posicionamento são herdadas do WidgetContainer */
  }

  @media ${({ theme }) => theme.breakpoints.tablet} {
    /* Mantém um tamanho bom para tablets também */
    height: 500px;
  }
  /* --- FIM DA ALTERAÇÃO --- */
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  padding: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const MessageArea = styled.div`
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 20px;
  margin-bottom: 10px;
  line-height: 1.4;
  align-self: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  background-color: ${({ sender, theme }) => (sender === 'user' ? theme.colors.primaryBlue : '#f1f1f1')};
  color: ${({ sender, theme }) => (sender === 'user' ? 'white' : theme.colors.darkGray)};
`;

const InputArea = styled.form`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
`;

const TextInput = styled.input`
  flex-grow: 1;
  border: none;
  padding: 10px;
  font-size: 1rem;
  &:focus { outline: none; }
`;

const SendButton = styled.button`
  background: none; border: none; cursor: pointer; padding: 10px;
  color: ${({ theme }) => theme.colors.primaryBlue};
  &:disabled { color: #ccc; }
`;

const ChatFab = styled.button`
  background: ${({ theme }) => theme.colors.gradient};
  color: white;
  border: none;
  width: 60px; height: 60px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  cursor: pointer;
`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Olá! Sou o assistente da Casa Moreno. Como posso ajudar?' }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Mesmo tempo da animação de fadeOut
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: userMessage.text });
      const aiMessage = { sender: 'ai', text: response.data };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WidgetContainer>
      {isOpen ? (
        <ChatWindow isClosing={isClosing}>
          <Header>
            Assistente Virtual
            <CloseButton onClick={closeChat}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
            </CloseButton>
          </Header>
          <MessageArea ref={messageAreaRef}>
            {messages.map((msg, index) => (
              <MessageBubble key={index} sender={msg.sender}>
                {msg.text}
              </MessageBubble>
            ))}
            {isLoading && <MessageBubble sender="ai">...</MessageBubble>}
          </MessageArea>
          <InputArea onSubmit={handleSubmit}>
            <TextInput
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
            />
            <SendButton type="submit" disabled={isLoading}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </SendButton>
          </InputArea>
        </ChatWindow>
      ) : (
        <ChatFab onClick={openChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
        </ChatFab>
      )}
    </WidgetContainer>
  );
};

export default ChatWidget;