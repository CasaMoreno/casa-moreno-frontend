// src/components/common/Navbar.js (VERSÃO COM LINK PARA DASHBOARD)

import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
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

const Navbar = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const router = useRouter();

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
          <>
            {user.scope === 'ADMIN' ? (
              <Link href="/admin" passHref legacyBehavior>
                <StyledLink isActive={router.pathname.startsWith('/admin')}>
                  Admin Dashboard
                </StyledLink>
              </Link>
            ) : (
              // NOVO: Link para o dashboard do usuário comum
              <Link href="/dashboard" passHref legacyBehavior>
                <StyledLink isActive={router.pathname.startsWith('/dashboard')}>
                  Meu Perfil
                </StyledLink>
              </Link>
            )}
            <StyledLink as="a" onClick={logout}>Logout</StyledLink>
          </>
        ) : (
          <Link href="/auth/login" passHref legacyBehavior>
            <StyledLink isActive={router.pathname === '/auth/login'}>
              Login
            </StyledLink>
          </Link>
        )}
      </LinksContainer>
    </Nav>
  );
};

export default Navbar;