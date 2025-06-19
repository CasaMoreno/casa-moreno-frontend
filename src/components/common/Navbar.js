// src/components/common/Navbar.js (VERSÃO ATUALIZADA)

import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import apiClient from '@/api/axios';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 20px 20px;
`;

const LogoText = styled.span`
  font-family: 'Pacifico', cursive;
  font-size: 1.5rem;
  font-weight: 400;
`;

const LogoTextLink = styled.a`
  padding: 8px 16px;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StyledLink = styled.a`
  position: relative;
  padding: 8px 4px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease-out;
  color: ${({ isActive }) => (isActive ? 'white' : 'rgba(255, 255, 255, 0.7)')};
  font-size: ${({ isActive }) => (isActive ? '1.05rem' : '1rem')};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.7);
    transform-origin: center;
    transition: transform 0.3s ease-out;
    transform: scaleX(0);
  }

  ${({ isActive }) => !isActive && css`
    &:hover::after {
      transform: scaleX(1);
    }
  `}
`;

// --- NOVOS ESTILOS PARA O DROPDOWN DO USUÁRIO ---
const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 0.5rem 0;
  z-index: 1001;
  width: 180px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer;
  font-weight: normal;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;
// --- FIM DOS NOVOS ESTILOS ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Falha ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Busca os dados completos do usuário quando o authUser for carregado
    if (user) {
      apiClient.get(`/users/username?username=${user.username}`)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => console.error("Falha ao buscar dados do usuário na navbar", error));
    } else {
      setUserData(null);
    }
  }, [user]);

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFirstName = () => {
    if (!userData || !userData.name) return '';
    return userData.name.split(' ')[0];
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return user.scope === 'ADMIN' ? '/admin' : '/dashboard';
  };

  return (
    <Nav>
      <Link href="/" passHref legacyBehavior>
        <LogoTextLink>
          <LogoText>Casa Moreno</LogoText>
        </LogoTextLink>
      </Link>

      <LinksContainer>
        {categories.map(category => {
          const categoryPath = `/products/${category.toLowerCase()}`;
          return (
            <Link key={category} href={categoryPath} passHref legacyBehavior>
              <StyledLink isActive={decodeURIComponent(router.asPath).startsWith(categoryPath)}>
                {category}
              </StyledLink>
            </Link>
          );
        })}
      </LinksContainer>

      <LinksContainer>
        {user ? (
          <UserMenuContainer ref={menuRef}>
            <UserMenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              Olá, {getFirstName()} ▼
            </UserMenuButton>
            <DropdownMenu isOpen={isMenuOpen}>
              <Link href={getDashboardPath()} passHref legacyBehavior>
                <DropdownItem onClick={() => setIsMenuOpen(false)}>Meu Painel</DropdownItem>
              </Link>
              <DropdownItem onClick={() => { logout(); setIsMenuOpen(false); }}>
                Sair
              </DropdownItem>
            </DropdownMenu>
          </UserMenuContainer>
        ) : (
          <>
            <Link href="/auth/login" passHref legacyBehavior>
              <StyledLink isActive={router.pathname === '/auth/login'}>
                Login
              </StyledLink>
            </Link>
            <Link href="/auth/register" passHref legacyBehavior>
              <StyledLink isActive={router.pathname === '/auth/register'}>
                Cadastre-se
              </StyledLink>
            </Link>
          </>
        )}
      </LinksContainer>
    </Nav>
  );
};

export default Navbar;