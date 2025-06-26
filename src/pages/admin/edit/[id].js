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
import AiDescriptionModal from '@/components/admin/AiDescriptionModal'; // 1. Importar o Modal
import { useNotification } from '@/hooks/useNotification'; // 2. Importar o hook de notificação

// --- INÍCIO DAS ALTERAÇÕES ---

// Ícone para o botão de IA
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
        <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z" />
        <path d="M5 3L6 6" />
        <path d="M18 18L19 21" />
        <path d="M21 5L18 6" />
        <path d="M3 19L6 18" />
    </svg>
);

// Novo container para alinhar o título e o botão
const LabelWithButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Remove a margem inferior padrão para o container não ter margem dupla */
  margin-bottom: -0.5rem; 
`;

// Botão para acionar a IA
const AiButton = styled(Button)`
    padding: 6px 12px;
    font-size: 0.8rem;
    background-color: ${({ theme }) => theme.colors.primaryPurple};
    display: inline-flex;
    align-items: center;
    
    &:hover {
     background-color: #4a2d6e;
   }
`;
// --- FIM DAS ALTERAÇÕES ---


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

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 300px; 
  min-height: 250px; 
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 1rem;
`;

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

    // --- INÍCIO DAS ALTERAÇÕES ---
    const [isAiModalOpen, setIsAiModalOpen] = useState(false); // 3. Estado para controlar o modal
    const { showNotification } = useNotification(); // 4. Hook para mostrar notificações

    const imageUrl = product.galleryImageUrls && product.galleryImageUrls.length > 0
        ? product.galleryImageUrls[0]
        : '/placeholder.png';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 5. Função para salvar a descrição gerada pela IA no estado do formulário
    const handleSaveDescriptionFromAI = (newDescription) => {
        setFormData(prev => ({ ...prev, fullDescription: newDescription }));
        showNotification({ title: 'Sucesso!', message: 'Descrição atualizada. Lembre-se de salvar as alterações no produto.' });
    };

    // --- FIM DAS ALTERAÇÕES ---

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
            {/* --- INÍCIO DAS ALTERAÇÕES --- */}
            {/* 6. Renderização condicional do Modal de IA */}
            {isAiModalOpen && (
                <AiDescriptionModal
                    originalDescription={formData.fullDescription}
                    onSave={handleSaveDescriptionFromAI}
                    onClose={() => setIsAiModalOpen(false)}
                />
            )}
            {/* --- FIM DAS ALTERAÇÕES --- */}

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

                    {/* --- INÍCIO DAS ALTERAÇÕES --- */}
                    {/* 7. Novo container para o título e o botão */}
                    <LabelWithButtonContainer>
                        <label>Descrição Completa</label>
                        <AiButton type="button" onClick={() => setIsAiModalOpen(true)}>
                            <SparkleIcon />
                            Gerar com IA
                        </AiButton>
                    </LabelWithButtonContainer>
                    {/* --- FIM DAS ALTERAÇÕES --- */}

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