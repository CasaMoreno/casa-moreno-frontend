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
      const response = await apiClient.post('/products/create', productData);
      const newProduct = response.data;

      if (newProduct && newProduct.productId) {
        router.push(`/admin/edit/${newProduct.productId}`);
      } else {
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

      <Input
        id="mercadoLivreUrl"
        label="URL do Mercado Livre (para scraping)"
        type="url"
        value={mercadoLivreUrl}
        onChange={(e) => setMercadoLivreUrl(e.target.value)}
        placeholder="https://produto.mercadolivre.com.br/..."
        required
      />

      <Input
        id="affiliateLink"
        label="Link de Afiliado"
        type="url"
        value={affiliateLink}
        onChange={(e) => setAffiliateLink(e.target.value)}
        placeholder="https://seu.link.de/afiliado"
        required
      />

      <Input
        id="category"
        label="Categoria"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Ex: Celulares"
        required
      />

      <Input
        id="subcategory"
        label="Subcategoria"
        type="text"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        placeholder="Ex: Smartphones"
        required
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
      </Button>
    </Form>
  );
}

export default AdminProductForm;