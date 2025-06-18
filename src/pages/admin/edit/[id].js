// Arquivo: src/pages/admin/edit/[id].js (VERSÃO FINAL COM COMPONENTE IMPORTADO)

import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import apiClient from '@/api/axios';
import CancelButton from '@/components/common/CancelButton'; // NOVO: Importa o componente do botão

const EditPageContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
  h1 { text-align: center; margin-bottom: 2rem; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: space-between; 
`;

// REMOVIDO: A definição do CancelButton foi movida para seu próprio arquivo.

const EditProductPage = ({ product }) => {
    const [formData, setFormData] = useState(product);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await apiClient.put('/products/update', formData);
            router.push('/admin');
        } catch (err) {
            setError('Falha ao atualizar o produto.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <EditPageContainer>
                <h1>Editar Produto</h1>
                <Form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <label>Título do Produto</label>
                    <Input name="productTitle" value={formData.productTitle || ''} onChange={handleChange} />

                    <label>Categoria</label>
                    <Input name="productCategory" value={formData.productCategory || ''} onChange={handleChange} />

                    <label>Preço Atual</label>
                    <Input name="currentPrice" type="number" value={formData.currentPrice || ''} onChange={handleChange} />

                    <label>Marca</label>
                    <Input name="productBrand" value={formData.productBrand || ''} onChange={handleChange} />

                    <label>Link Afiliado</label>
                    <Input name="affiliateLink" value={formData.affiliateLink || ''} onChange={handleChange} />

                    <ButtonContainer>
                        <Link href="/admin" passHref>
                            {/* O componente agora é importado e não definido localmente */}
                            <CancelButton as="a">Voltar</CancelButton>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </ButtonContainer>
                </Form>
            </EditPageContainer>
        </Layout>
    );
};

export async function getServerSideProps(context) {
    const { id } = context.params;
    try {
        const response = await apiClient.get(`/products/${id}`);
        return { props: { product: response.data } };
    } catch (error) {
        console.error(`Failed to fetch product ${id}`, error);
        return { notFound: true };
    }
}

export default withAuth(EditProductPage, ['ADMIN']);