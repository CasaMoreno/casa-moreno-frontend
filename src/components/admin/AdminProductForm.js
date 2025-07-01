import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import apiClient from '@/api/axios';
import Input from '../common/Input';
import Button from '../common/Button';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AdminProductForm = () => {
  const [mercadoLivreUrl, setMercadoLivreUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const productData = {
      mercadoLivreUrl,
      affiliateLink,
      productCategory: category,
      productSubcategory: subcategory,
    };

    try {
      // 1. Captura a resposta da API, que deve conter o produto criado
      const response = await apiClient.post('/products/create', productData);
      const newProduct = response.data;

      // 2. Verifica se o produto foi retornado e tem um ID
      if (newProduct && newProduct.productId) {
        // 3. Redireciona para a página de EDIÇÃO do novo produto
        router.push(`/admin/edit/${newProduct.productId}`);
      } else {
        // Se algo der errado, redireciona para a lista geral como segurança
        router.push('/admin/products');
      }
    } catch (err) {
      setError('Falha ao criar o produto. Verifique a URL e tente novamente.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>URL do Mercado Livre (para scraping)</label>
      <Input type="url" value={mercadoLivreUrl} onChange={(e) => setMercadoLivreUrl(e.target.value)} placeholder="https://produto.mercadolivre.com.br/..." required />

      <label>Link de Afiliado</label>
      <Input type="url" value={affiliateLink} onChange={(e) => setAffiliateLink(e.target.value)} placeholder="https://seu.link.de/afiliado" required />

      <label>Categoria</label>
      <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Celulares" required />

      <label>Subcategoria</label>
      <Input type="text" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} placeholder="Ex: Smartphones" required />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
      </Button>
    </Form>
  );
}

export default AdminProductForm;