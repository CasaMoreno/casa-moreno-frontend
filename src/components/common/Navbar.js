// src/components/common/Navbar.js (VERSÃO ATUALIZADA)

import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// ALTERADO: Adicionei o estilo dos links 'a' diretamente aqui
// para aplicar a todos os links dentro da barra de navegação.
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

const NavLogo = styled.div`
  cursor: pointer;
`;

// ALTERADO: Renomeei NavLinks para um nome mais genérico, pois vamos usá-lo 2x
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

  return (
    <Nav>
      {/* --- Seção 1: Logo (Esquerda) --- */}
      <Link href="/">
        <NavLogo>
          <Image src="/casa-moreno-logo.png" alt="Casa Moreno Logo" width={50} height={50} />
        </NavLogo>
      </Link>
      
      {/* --- Seção 2: Links de Navegação (Centro) --- */}
      <LinksContainer>
        <Link href="/">Home</Link>
        <Link href="/products/celulares">Celulares</Link>
        <Link href="/products/laptops">Laptops</Link>
      </LinksContainer>
      
      {/* --- Seção 3: Links de Usuário (Direita) --- */}
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