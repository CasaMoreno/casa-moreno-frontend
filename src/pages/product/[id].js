import { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const PageWrapper = styled.div`
  background-color: #f9f9f9;
  padding: 2rem 1rem;
`;

const ProductPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  position: relative;
  
  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 1rem;
  }
`;

const AdminActionWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
`;

const AdminEditButton = styled(Button)`
  padding: 10px 18px;
  font-size: 0.9rem;
  background-color: ${({ theme }) => theme.colors.darkGray};
  flex-shrink: 0;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #555;
  }
`;

const Breadcrumbs = styled.div`
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
  a {
    color: ${({ theme }) => theme.colors.primaryBlue};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
  span { margin: 0 0.5rem; }
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const GalleryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%; 
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
`;

const ThumbnailList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.75rem;
`;

const Thumbnail = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ isActive }) => (isActive ? '#2A4A87' : '#eee')};
  transition: border-color 0.2s ease;
  &:hover { border-color: #2A4A87; }
`;

const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  line-height: 1.3;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.darkGray};
  padding-right: 180px;

  @media (max-width: 900px) {
    padding-right: 0;
    font-size: 1.7rem;
    margin-top: 2rem; // Adicionado para dar espaço para o botão de editar no mobile
  }
`;

const SubtitleInfo = styled.p`
  color: #777;
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
`;

const PricingBlock = styled.div`
  margin-bottom: 1.5rem;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  padding: 1rem;
  border-radius: 5px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 1rem;
`;

const DiscountBadge = styled.span`
  background-color: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const CurrentPrice = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primaryBlue};
  margin: 0;
`;

const InstallmentInfo = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

const AffiliateButton = styled(Button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  width: 100%;
  margin-top: 2rem;
`;

const DescriptionSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  h2 { margin-bottom: 1rem; }
  div {
    line-height: 1.7;
    color: #444;
  }
`;


const ProductDetailPage = ({ product, error }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  if (error) return <Layout><p style={{ textAlign: 'center', marginTop: '3rem' }}>{error}</p></Layout>
  if (router.isFallback || !product) return <Layout><div>Carregando...</div></Layout>;

  // *** FUNÇÃO CORRIGIDA/REINSERIDA ***
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return value.toFixed(2).replace('.', ',');
  };

  const mainImageUrl = product.galleryImageUrls?.[selectedImage] || '/placeholder.png';

  return (
    <Layout>
      <Head>
        <title>{`${product.productTitle} - Casa Moreno`}</title>
        <meta name="description" content={`Detalhes sobre ${product.productTitle}`} />
      </Head>
      <PageWrapper>
        <ProductPageContainer>
          {user?.scope === 'ADMIN' && (
            <AdminActionWrapper>
              <Link href={`/admin/edit/${product.productId}`} passHref>
                <AdminEditButton as="a"><EditIcon />Editar</AdminEditButton>
              </Link>
            </AdminActionWrapper>
          )}

          <Breadcrumbs>
            <Link href="/">Home</Link>
            {product.productCategory && <><span>&gt;</span><Link href={`/products/${product.productCategory.toLowerCase()}`}>{product.productCategory}</Link></>}
            {product.productSubcategory && <><span>&gt;</span>{product.productSubcategory}</>}
          </Breadcrumbs>

          <MainLayout>
            <GalleryColumn>
              <MainImageWrapper>
                <Image src={mainImageUrl} alt={product.productTitle} layout="fill" objectFit="contain" priority />
              </MainImageWrapper>
              <ThumbnailList>
                {product.galleryImageUrls?.map((url, index) => (
                  <Thumbnail key={index} isActive={index === selectedImage} onClick={() => setSelectedImage(index)}>
                    <Image src={url} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="contain" />
                  </Thumbnail>
                ))}
              </ThumbnailList>
            </GalleryColumn>

            <DetailsColumn>
              <ProductTitle>{product.productTitle}</ProductTitle>
              <SubtitleInfo>
                Marca: <strong>{product.productBrand || 'N/A'}</strong> | Condição: <strong>{product.productCondition || 'N/A'}</strong>
              </SubtitleInfo>

              {/* *** BLOCO DE CÓDIGO CORRIGIDO/REINSERIDO *** */}
              <PricingBlock>
                {product.originalPrice > product.currentPrice && (
                  <PriceRow>
                    <OriginalPrice>R$ {formatCurrency(product.originalPrice)}</OriginalPrice>
                    {product.discountPercentage && <DiscountBadge>{product.discountPercentage}</DiscountBadge>}
                  </PriceRow>
                )}
                <CurrentPrice>R$ {formatCurrency(product.currentPrice)}</CurrentPrice>
                {product.installments > 1 && (
                  <InstallmentInfo>
                    ou em <strong>{product.installments}x de R$ {formatCurrency(product.installmentValue)}</strong>
                  </InstallmentInfo>
                )}
              </PricingBlock>

              <p>Estoque: <strong>{product.stockStatus || 'Consulte na loja'}</strong></p>
              <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">
                <AffiliateButton>Ver Oferta na Loja do Parceiro</AffiliateButton>
              </a>
            </DetailsColumn>
          </MainLayout>

          {product.fullDescription && (
            <DescriptionSection>
              <h2>Descrição do Produto</h2>
              <div dangerouslySetInnerHTML={{ __html: product.fullDescription.replace(/\n/g, '<br />') }} />
            </DescriptionSection>
          )}
        </ProductPageContainer>
      </PageWrapper>
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
    return { props: { product: null, error: "Produto não encontrado ou indisponível." } };
  }
}

export default ProductDetailPage;