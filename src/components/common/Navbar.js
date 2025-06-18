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

const NavLogo = styled.div`
  cursor: pointer;
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
  const [categories, setCategories] = useState([]); // NOVO: Estado para guardar as categorias

  // NOVO: Efeito para buscar as categorias quando o componente carregar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Falha ao buscar categorias:", error);
        setCategories([]); // Em caso de erro, a lista fica vazia
      }
    };

    fetchCategories();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez

  return (
    <Nav>
      <Link href="/">
        <NavLogo>
          <Image src="/casa-moreno-logo.png" alt="Casa Moreno Logo" width={50} height={50} />
        </NavLogo>
      </Link>
      
      <LinksContainer>
        <Link href="/">Home</Link>
        {/* NOVO: Loop dinâmico para renderizar as categorias */}
        {categories.map(category => (
          <Link key={category} href={`/products/${category}`}>
            {category}
          </Link>
        ))}
      </LinksContainer>
      
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