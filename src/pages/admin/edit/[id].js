import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
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
  h1 { text-align: center; margin-bottom: 1rem; }
`;

const ThumbnailContainer = styled.div`
  width: 150px;
  height: 150px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ddd;
  margin: 0 auto 2rem auto;
  background-color: #f9f9f9;
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

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  background-color: white;
`;

// --- INÍCIO DA ALTERAÇÃO ---
const StyledTextarea = styled.textarea`
  width: 100%;
  height: 300px; /* Altura aumentada */
  min-height: 250px; /* Altura aumentada */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
`;
// --- FIM DA ALTERAÇÃO ---

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const EditProductPage = ({ product }) => {
    const [formData, setFormData] = useState(product);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [isPromotional, setIsPromotional] = useState(product.isPromotional || false);

    const imageUrl = product.galleryImageUrls && product.galleryImageUrls.length > 0
        ? product.galleryImageUrls[0]
        : '/placeholder.png';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePromotionalChange = async () => {
        const newStatus = !isPromotional;
        setIsPromotional(newStatus);
        try {
            await apiClient.patch(`/products/${product.productId}/promotional?status=${newStatus}`);
        } catch (err) {
            console.error(err);
            setError('Falha ao atualizar o status promocional. Tente novamente.');
            setIsPromotional(!newStatus);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await apiClient.put('/products/update', formData);
            router.push('/admin/products');
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

                <ThumbnailContainer>
                    <Image
                        src={imageUrl}
                        alt={`Imagem de ${product.productTitle}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </ThumbnailContainer>

                <Form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <label>Título do Produto</label>
                    <Input name="productTitle" value={formData.productTitle || ''} onChange={handleChange} />

                    <label>Categoria</label>
                    <Input name="productCategory" value={formData.productCategory || ''} onChange={handleChange} />

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

                    <label>Descrição Completa</label>
                    <StyledTextarea
                        name="fullDescription"
                        value={formData.fullDescription || ''}
                        onChange={handleChange}
                        placeholder="Descreva os detalhes do produto..."
                    />

                    <CheckboxContainer>
                        <input
                            type="checkbox"
                            checked={isPromotional}
                            onChange={handlePromotionalChange}
                        />
                        Marcar como Oferta
                    </CheckboxContainer>

                    <ButtonContainer>
                        <Link href="/admin/products" passHref>
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