import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';

const AdminDashboardContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  
  h1 {
    margin-bottom: 2rem;
  }
`;

const AdminDashboard = () => {
    return (
        <Layout>
            <AdminDashboardContainer>
                <h1>Painel do Administrador</h1>
                <Link href="/admin/new-product">
                    <Button>Adicionar Novo Produto</Button>
                </Link>
            </AdminDashboardContainer>
        </Layout>
    );
}

export default withAuth(AdminDashboard, ['ADMIN']);