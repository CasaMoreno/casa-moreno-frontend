import styled from 'styled-components';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import AdminProductForm from '@/components/admin/AdminProductForm';

const AdminPageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }
`;

const NewProductPage = () => {
    return (
        <Layout>
            <AdminPageContainer>
                <h1>Adicionar Novo Produto</h1>
                <AdminProductForm />
            </AdminPageContainer>
        </Layout>
    );
}

export default withAuth(NewProductPage, ['ADMIN']);