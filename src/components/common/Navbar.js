// src/components/common/Navbar.js (VERSÃO ATUALIZADA)

import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import apiClient from '@/api/axios';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  a {
    font-weight: bold;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
`;

// NOVO: Container para a seção da esquerda (logo + texto)
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; // Espaçamento entre o logo e o texto
`;

const NavLogo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

// NOVO: Componente de texto para o nome da loja com a fonte cursiva
const LogoText = styled.span`
  font-family: 'Pacifico', cursive;
  font-size: 1.5rem;
  font-weight: 400; // Fontes cursivas geralmente ficam melhores sem negrito
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const LogoutButton = styled.a`
    cursor: pointer;
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Falha ao buscar categorias:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Nav>
      {/* --- Seção 1: Esquerda (Logo + Nome) --- */}
      <LeftSection>
        <Link href="/">
          <NavLogo>
            <Image src="/casa-moreno-logo.png" alt="Casa Moreno Logo" width={50} height={50} />
          </NavLogo>
        </Link>
        <Link href="/">
          <LogoText>Casa Moreno</LogoText>
        </Link>
      </LeftSection>

      {/* --- Seção 2: Centro (Categorias) --- */}
      <LinksContainer>
        {/* O link "Home" foi removido daqui */}
        {categories.map(category => (
          <Link key={category} href={`/products/${category.toLowerCase()}`}>
            {category}
          </Link>
        ))}
      </LinksContainer>

      {/* --- Seção 3: Direita (Login/Logout) --- */}
      <LinksContainer>
        {user ? (
          <>
            {user.scope === 'ADMIN' && <Link href="/admin">Admin</Link>}
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </>
        ) : (
          <Link href="/auth/login">Login</Link>
        )}
      </LinksContainer>
    </Nav>
  );
};

export default Navbar;