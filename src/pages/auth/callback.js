import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import styled from 'styled-components';
import Layout from '@/components/layout/Layout';

const CallbackContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 140px);
    font-size: 1.5rem;
    color: #555;
`;

const AuthCallbackPage = () => {
    const router = useRouter();
    const { handleOauthToken } = useAuth();

    useEffect(() => {
        if (router.isReady) {
            const { token, error } = router.query;

            if (token) {
                handleOauthToken(token);
            } else if (error) {
                console.error("OAuth Error:", error);
                router.push(`/auth/login?error=Falha na autenticação com o Google.`);
            } else {
                // Prevenção extra para não entrar em loop se for acessado sem parâmetros
                // Adicionamos uma verificação para não redirecionar se já estiver na página de login
                if (router.pathname !== '/auth/login') {
                    router.push('/auth/login');
                }
            }
        }
        // A dependência do 'router' foi removida para evitar loops.
    }, [router.isReady, router.query, handleOauthToken]);

    return (
        <Layout>
            <CallbackContainer>
                <p>Autenticando, por favor aguarde...</p>
            </CallbackContainer>
        </Layout>
    );
};

export default AuthCallbackPage;