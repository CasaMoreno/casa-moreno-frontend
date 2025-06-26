import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import apiClient from '@/api/axios';

// --- Ícones SVG para o Menu ---
const PanelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
  </svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);


// --- Componentes Estilizados ---
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1100;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 0.75rem 1rem;
  }
`;

const LogoText = styled.span`
  font-family: 'Pacifico', cursive;
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
`;

const LogoTextLink = styled(Link)`
  padding: 8px 16px;
  cursor: pointer;
`;

const DesktopLinksContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media ${({ theme }) => theme.breakpoints.mobile} { display: none; }
  @media ${({ theme }) => theme.breakpoints.tablet} { display: none; }
`;

const StyledLink = styled(Link)`
  position: relative;
  padding: 8px 4px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease-out;
  color: ${({ $isActive }) => ($isActive ? 'white' : 'rgba(255, 255, 255, 0.7)')};
  font-size: ${({ $isActive }) => ($isActive ? '1.05rem' : '1rem')};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.7);
    transform: scaleX(0);
    transition: transform 0.3s ease-out;
  }

  ${({ $isActive }) => !$isActive && css`
    &:hover::after { transform: scaleX(1); }
  `}
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none; border: none; color: white;
  font-weight: bold; font-size: 1rem; cursor: pointer;
  padding: 8px 4px; display: flex; align-items: center; gap: 0.5rem;
  &:hover { color: rgba(255, 255, 255, 0.9); }
`;

const DropdownMenu = styled.div`
  position: absolute; top: 100%; right: 0;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 0.5rem 0; z-index: 1001; width: 180px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
  display: flex; 
  align-items: center; 
  gap: 0.5rem; 
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer; font-weight: normal;
  &:hover { background-color: ${({ theme }) => theme.colors.lightGray}; }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.darkGray};
  cursor: pointer;
  font-weight: normal;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem; /* Herdar o tamanho da fonte */

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

const HamburgerButton = styled.button`
  display: none; background: none; border: none; cursor: pointer;
  padding: 10px; z-index: 1200; position: relative; width: 45px; height: 45px;

  @media ${({ theme }) => theme.breakpoints.mobile} { display: block; }
  @media ${({ theme }) => theme.breakpoints.tablet} { display: block; }

  span {
    display: block; width: 25px; height: 3px;
    background-color: white; margin: 5px auto;
    transition: all 0.3s ease-in-out;
    position: relative;
    
    ${({ $isOpen }) => $isOpen && css`
      &:nth-child(1) { transform: translateY(8px) rotate(45deg); }
      &:nth-child(2) { opacity: 0; }
      &:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    `}
  }
`;

const MobileMenu = styled.div`
  display: flex; flex-direction: column;
  position: fixed; top: 0;
  right: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 80%; max-width: 320px; height: 100vh;
  background: linear-gradient(to bottom, #2A4A87, #4c3a8a);
  padding: 1.5rem;
  transition: right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: -5px 0 15px rgba(0,0,0,0.2);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow-y: auto;

  & > * {
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: opacity 0.3s ease-in-out 0.2s;
  }
`;

const Backdrop = styled.div`
  position: fixed; top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1099;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const MenuHeader = styled.div`
  width: 100%;
  text-align: center;
  padding: 1rem 0 0.5rem;
  flex-shrink: 0;
`;

const UserGreeting = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.5rem;
`;

const MenuSection = styled.div`
  width: 100%;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  h4 {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    padding-left: 1rem;
    margin-top: 0; 
  }
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  width: 100%;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
  text-decoration: none;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover, &.active {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }
`;

const MenuButton = styled.button`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    width: 100%;
    font-family: inherit;
    font-size: 1.1rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.9);
    text-align: left;
    text-decoration: none;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover, &.active {
        background-color: rgba(0, 0, 0, 0.2);
        color: white;
    }
`;


const Navbar = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef(null);

  useEffect(() => {
    apiClient.get('/products/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      apiClient.get(`/users/username?username=${user.username}`).then(res => setUserData(res.data)).catch(console.error);
    } else {
      setUserData(null);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  const getDashboardPath = () => user?.scope === 'ADMIN' ? '/admin' : '/dashboard';

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const firstName = userData?.name.split(' ')[0];

  return (
    <>
      <Backdrop $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      <Nav>
        <LogoTextLink href="/"><LogoText>Casa Moreno</LogoText></LogoTextLink>

        <DesktopLinksContainer>
          {categories.map(category => (
            <StyledLink
              key={category}
              href={`/products/${category.toLowerCase()}`}
              $isActive={decodeURIComponent(router.asPath).startsWith(`/products/${category.toLowerCase()}`)}
            >
              {category}
            </StyledLink>
          ))}
        </DesktopLinksContainer>

        <DesktopLinksContainer>
          {user && userData ? (
            <UserMenuContainer ref={userMenuRef}>
              <UserMenuButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>Olá, {firstName} ▼</UserMenuButton>
              <DropdownMenu $isOpen={isUserMenuOpen}>
                <DropdownItem href={getDashboardPath()} onClick={() => setIsUserMenuOpen(false)}>
                  <PanelIcon />
                  <span>Meu Painel</span>
                </DropdownItem>
                <DropdownButton onClick={handleLogout}>
                  <LogoutIcon />
                  <span>Sair</span>
                </DropdownButton>
              </DropdownMenu>
            </UserMenuContainer>
          ) : (
            <>
              <StyledLink href="/auth/login" $isActive={router.pathname === '/auth/login'}>Login</StyledLink>
              <StyledLink href="/auth/register" $isActive={router.pathname === '/auth/register'}>Cadastre-se</StyledLink>
            </>
          )}
        </DesktopLinksContainer>

        <HamburgerButton $isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span /><span /><span />
        </HamburgerButton>

        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MenuHeader>
            <LogoText>Casa Moreno</LogoText>
            {user && userData && <UserGreeting>Olá, {firstName}</UserGreeting>}
          </MenuHeader>

          <MenuSection>
            <h4>Categorias</h4>
            {categories.map(category => {
              const path = `/products/${category.toLowerCase()}`;
              return (
                <MenuLink key={`mobile-${category}`} href={path} className={decodeURIComponent(router.asPath).startsWith(path) ? 'active' : ''}>
                  {category}
                </MenuLink>
              );
            })}
          </MenuSection>

          <MenuSection>
            <h4>Conta</h4>
            {user ? (
              <>
                <MenuLink href={getDashboardPath()} className={router.asPath === getDashboardPath() ? 'active' : ''}>
                  <PanelIcon />
                  <span>Meu Painel</span>
                </MenuLink>
                <MenuButton onClick={handleLogout}>
                  <LogoutIcon />
                  <span>Sair</span>
                </MenuButton>
              </>
            ) : (
              <>
                <MenuLink href="/auth/login" className={router.pathname === '/auth/login' ? 'active' : ''}>Login</MenuLink>
                <MenuLink href="/auth/register" className={router.pathname === '/auth/register' ? 'active' : ''}>Cadastre-se</MenuLink>
              </>
            )}
          </MenuSection>
        </MobileMenu>
      </Nav>
    </>
  );
};

export default Navbar;