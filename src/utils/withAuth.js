import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const withAuth = (WrappedComponent, allowedRoles = []) => {
    return (props) => {
        const { user, loading } = useAuth();
        const router = useRouter();

        if (loading) {
            return <div>Carregando...</div>;
        }

        if (!user) {
            if (typeof window !== 'undefined') {
                router.replace('/auth/login');
            }
            return null;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(user.scope)) {
            if (typeof window !== 'undefined') {
                router.replace('/');
            }
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;