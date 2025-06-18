// src/pages/admin/edit/[id].js (VERSÃO COM CAMPO 'CONDIÇÃO')

import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import withAuth from '@/utils/withAuth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import apiClient from '@/api/axios';
import CancelButton from '@/components/common/CancelButton';

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

// NOVO: Estilo para o campo de seleção (dropdown)
const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background-color: white;
`;

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

                    {/* NOVO: Campo para selecionar a condição do produto */}
                    <label>Condição</label>
                    <StyledSelect name="productCondition" value={formData.productCondition || ''} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        <option value="Novo">Novo</option>
                        <option value="Usado">Usado</option>
                    </StyledSelect>

                    <label>Preço Atual</label>
                    <Input name="currentPrice" type="number" value={formData.currentPrice || ''} onChange={handleChange} />

                    <label>Marca</label>
                    <Input name="productBrand" value={formData.productBrand || ''} onChange={handleChange} />

                    <label>Link Afiliado</label>
                    <Input name="affiliateLink" value={formData.affiliateLink || ''} onChange={handleChange} />

                    <ButtonContainer>
                        <Link href="/admin" passHref>
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