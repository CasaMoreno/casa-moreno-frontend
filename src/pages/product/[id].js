// src/pages/product/[id].js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import apiClient from '@/api/axios';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { useNotification } from '@/hooks/useNotification';
import CancelButton from '@/components/common/CancelButton';
import AiDescriptionModal from '@/components/admin/AiDescriptionModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency } from '@/utils/formatters'; // IMPORTAÇÃO

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 3 3 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3Z" />
    <path d="M5 3L6 6" />
    <path d="M18 18L19 21" />
    <path d="M21 5L18 6" />
    <path d="M3 19L6 18" />
  </svg>
);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>);
const ArrowLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);

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
   display: flex;
   gap: 8px; 
   flex-wrap: wrap; 
   justify-content: flex-end;

   position: absolute;
   top: 1.5rem;
   right: 1.5rem;
   z-index: 10;

   @media (max-width: 900px) {
    position: static;
    justify-content: center;
    margin-bottom: 2rem;
    width: 100%;
   }
`;

const AdminEditButton = styled(Button)`
   padding: 10px 15px;
   font-size: 0.9rem;
   background-color: ${({ theme }) => theme.colors.darkGray};
   transition: background-color 0.2s ease-in-out;
   display: inline-flex;
   align-items: center;
   justify-content: center;

   &:hover {
     background-color: #555;
   }

   @media (max-width: 900px) {
    padding: 6px 10px;
    font-size: 0.75rem;
   }
`;

const AiButton = styled(AdminEditButton)`
    background-color: ${({ theme }) => theme.colors.primaryPurple};
    
    &:hover {
     background-color: #4a2d6e;
   }
`;

const AdminDeleteButton = styled(CancelButton)`
   padding: 10px 15px;
   font-size: 0.9rem;
   display: inline-flex;
   align-items: center;
   justify-content: center;

   @media (max-width: 900px) {
    padding: 6px 10px;
    font-size: 0.75rem;
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

   @media (max-width: 900px) {
    margin-bottom: 1rem;
   }
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

const MainImageContainerWithNav = styled(MainImageWrapper)`
   position: relative;
 `;

const NavButton = styled.button`
   position: absolute;
   top: 50%;
   transform: translateY(-50%);
   background-color: rgba(0, 0, 0, 0.5);
   color: white;
   border: none;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   z-index: 7;  
   opacity: 0.8;
   transition: background-color 0.3s, opacity 0.3s;

   &:hover {
     background-color: rgba(0, 0, 0, 0.7);
     opacity: 1;
   }

   &:disabled {
     opacity: 0.3;
     cursor: not-allowed;
   }

   &.left {
     left: 10px;
   }

   &.right {
     right: 10px;
   }
 `;

const ThumbnailMainImageBadge = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #FFD700;
  border-radius: 3px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const ThumbnailActions = styled.div`
     position: absolute;
     top: 5px;
     left: 5px;
     right: 5px;
     display: flex;
     align-items: center;
     z-index: 5;
      
     button {
         background-color: rgba(0, 0, 0, 0.6);
         color: white;
         border: none;
         border-radius: 3px;
         width: 18px;
         height: 18px;
         padding: 0;
         font-size: 0.65rem;
         cursor: pointer;
         transition: background-color 0.2s ease;
         display: flex;
         align-items: center;
         justify-content: center;

         &:hover {
             background-color: rgba(0, 0, 0, 0.8);
         }
     }

     .delete-btn {
         background-color: #dc3545;
         margin-left: auto;
         &:hover {
             background-color: #c82333;
         }
     }
 `;

const ThumbnailList = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
   gap: 0.75rem;
 `;

const StyledThumbnail = styled.div`
   width: 100%;
   padding-top: 100%;  
   position: relative;
   border-radius: 5px;
   overflow: hidden;
   cursor: pointer;
   border: 2px solid ${({ $isActive }) => ($isActive ? '#2A4A87' : '#eee')};
   transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    
   ${({ $isDragging }) => $isDragging && css`
     opacity: 0.5;
     border-color: ${({ theme }) => theme.colors.primaryPurple};
     box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryPurple};
   `}
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
     margin-top: 2rem;
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

   @media ${({ theme }) => theme.breakpoints.mobile} {
     font-size: 2.2rem;
   }
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

   @media ${({ theme }) => theme.breakpoints.mobile} {
     padding: 0.8rem 1.5rem;
     font-size: 1.1rem;
   }
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

const DisclaimerText = styled.p`
  font-size: 0.8rem;
  color: #777;
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
`;

const SortableThumbnail = ({ id, url, isActive, onClick, user, isMainImage, handleDeleteImage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <StyledThumbnail
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      $isActive={isActive}
      onClick={onClick}
      $isDragging={isDragging}
    >
      <Image src={url} alt={`Thumbnail ${id}`} fill style={{ objectFit: 'contain' }} />
      {user?.scope === 'ADMIN' && (
        <ThumbnailActions>
          {isMainImage && (
            <ThumbnailMainImageBadge title="Imagem Principal">
              <StarIcon />
            </ThumbnailMainImageBadge>
          )}
          <button
            title="Excluir imagem"
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteImage(id);
            }}
          >
            X
          </button>
        </ThumbnailActions>
      )}
    </StyledThumbnail>
  );
};


const ProductDetailPage = ({ product, error }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showConfirmation, showNotification } = useNotification();
  const [currentProduct, setCurrentProduct] = useState(product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 125,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCurrentProduct(product);
    if (product?.galleryImageUrls && product.galleryImageUrls.length > 0) {
      if (
        !currentProduct?.galleryImageUrls ||
        selectedImageIndex >= product.galleryImageUrls.length ||
        (product.galleryImageUrls[0] !== currentProduct.galleryImageUrls[0] && selectedImageIndex !== 0) ||
        (selectedImageIndex !== 0 && !product.galleryImageUrls.includes(currentProduct.galleryImageUrls[selectedImageIndex]))
      ) {
        setSelectedImageIndex(0);
      }
    } else {
      setSelectedImageIndex(0);
    }
  }, [product, currentProduct, selectedImageIndex]);

  const handleSaveDescription = async (newDescription) => {
    try {
      await apiClient.put('/products/update', {
        productId: currentProduct.productId,
        fullDescription: newDescription
      });
      setCurrentProduct(prev => ({ ...prev, fullDescription: newDescription }));
      showNotification({ title: 'Sucesso!', message: 'Descrição do produto atualizada.' });
    } catch (err) {
      console.error("Failed to save description", err);
      showNotification({ title: 'Erro', message: 'Não foi possível salvar a descrição.' });
    }
  };

  if (error) return <Layout><p style={{ textAlign: 'center', marginTop: '3rem' }}>{error}</p></Layout>
  if (router.isFallback || !currentProduct) return <Layout><div>Carregando...</div></Layout>;

  const mainImageUrl = currentProduct.galleryImageUrls?.[selectedImageIndex] || '/placeholder.png';

  const handleDeleteProduct = async () => {
    showConfirmation({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja deletar o produto: "${currentProduct.productTitle}"? Esta ação é irreversível.`,
      onConfirm: async () => {
        try {
          await apiClient.delete(`/products/delete/${currentProduct.productId}`);
          showNotification({ title: 'Sucesso', message: 'Produto deletado com sucesso!' });
          router.push('/admin/products');
        } catch (err) {
          showNotification({ title: 'Erro', message: 'Falha ao deletar o produto.' });
          console.error("Falha ao deletar produto", err);
        }
      }
    });
  };

  const handleDeleteImage = async (imageUrlToDelete) => {
    const indexToDelete = currentProduct.galleryImageUrls.indexOf(imageUrlToDelete);
    if (currentProduct.galleryImageUrls.length <= 1) {
      showNotification({ title: 'Erro', message: 'Não é possível excluir a única imagem do produto.' });
      return;
    }

    showConfirmation({
      title: 'Confirmar Exclusão de Imagem',
      message: 'Tem certeza que deseja excluir esta imagem? Esta ação é irreversível.',
      onConfirm: async () => {
        try {
          await apiClient.delete(`/products/${currentProduct.productId}/images/delete`, {
            data: JSON.stringify(imageUrlToDelete),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          const updatedGallery = currentProduct.galleryImageUrls.filter(url => url !== imageUrlToDelete);
          setCurrentProduct(prev => ({ ...prev, galleryImageUrls: updatedGallery }));

          if (indexToDelete === selectedImageIndex) {
            setSelectedImageIndex(0);
          } else if (indexToDelete < selectedImageIndex) {
            setSelectedImageIndex(prevIndex => prevIndex - 1);
          }

          showNotification({ title: 'Sucesso', message: 'Imagem excluída com sucesso!' });
        } catch (err) {
          console.error("Falha ao excluir imagem", err);
          showNotification({ title: 'Erro', message: 'Falha ao excluir imagem. Tente novamente.' });
        }
      }
    });
  };

  const handleNextImage = () => {
    if (currentProduct.galleryImageUrls) {
      setSelectedImageIndex((prevIndex) =>
        (prevIndex + 1) % currentProduct.galleryImageUrls.length
      );
    }
  };

  const handlePrevImage = () => {
    if (currentProduct.galleryImageUrls) {
      setSelectedImageIndex((prevIndex) =>
        (prevIndex - 1 + currentProduct.galleryImageUrls.length) % currentProduct.galleryImageUrls.length
      );
    }
  };

  const hasMultipleImages = currentProduct.galleryImageUrls && currentProduct.galleryImageUrls.length > 1;

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = currentProduct.galleryImageUrls.indexOf(active.id);
    const newIndex = currentProduct.galleryImageUrls.indexOf(over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newOrderedGallery = arrayMove(currentProduct.galleryImageUrls, oldIndex, newIndex);

      setCurrentProduct(prev => ({ ...prev, galleryImageUrls: newOrderedGallery }));

      if (selectedImageIndex === oldIndex) {
        setSelectedImageIndex(newIndex);
      } else if (oldIndex < selectedImageIndex && newIndex >= selectedImageIndex) {
        setSelectedImageIndex(prevIndex => prevIndex - 1);
      } else if (oldIndex > selectedImageIndex && newIndex <= selectedImageIndex) {
        setSelectedImageIndex(prevIndex => prevIndex + 1);
      }
      if (newIndex === 0 && selectedImageIndex !== 0) {
        setSelectedImageIndex(0);
      }

      try {
        await apiClient.put(`/products/update`, {
          productId: currentProduct.productId,
          galleryImageUrls: newOrderedGallery
        });
        showNotification({ title: 'Sucesso', message: 'Ordem das imagens atualizada!' });
      } catch (err) {
        console.error("Falha ao atualizar a ordem das imagens", err);
        showNotification({ title: 'Erro', message: 'Falha ao atualizar a ordem das imagens. Tente novamente.' });
        setCurrentProduct(product);
        setSelectedImageIndex(product.galleryImageUrls.indexOf(mainImageUrl));
      }
    }
  };


  return (
    <Layout>
      {isAiModalOpen && (
        <AiDescriptionModal
          originalDescription={currentProduct.fullDescription}
          onSave={handleSaveDescription}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      <Head>
        <title>{`${currentProduct.productTitle} - Casa Moreno`}</title>
        <meta name="description" content={`Detalhes sobre ${currentProduct.productTitle}`} />
      </Head>
      <PageWrapper>
        <ProductPageContainer>

          <Breadcrumbs>
            <Link href="/">Home</Link>
            {currentProduct.productCategory && <><span>&gt;</span><Link href={`/products/${currentProduct.productCategory.toLowerCase()}`}>{currentProduct.productCategory}</Link></>}
            {currentProduct.productSubcategory && <><span>&gt;</span>{currentProduct.productSubcategory}</>}
          </Breadcrumbs>

          {user?.scope === 'ADMIN' && (
            <AdminActionWrapper>
              <AiButton onClick={() => setIsAiModalOpen(true)}>
                <SparkleIcon />
                Gerar Descrição
              </AiButton>
              <AdminEditButton as={Link} href={`/admin/edit/${currentProduct.productId}`}>
                <EditIcon />
                Editar
              </AdminEditButton>
              <AdminDeleteButton onClick={handleDeleteProduct}>
                <TrashIcon />
                Deletar
              </AdminDeleteButton>
            </AdminActionWrapper>
          )}

          <MainLayout>
            <GalleryColumn>
              <MainImageContainerWithNav>
                <Image src={mainImageUrl} alt={currentProduct.productTitle} fill style={{ objectFit: 'contain' }} priority />

                {hasMultipleImages && (
                  <>
                    <NavButton className="left" onClick={handlePrevImage} aria-label="Imagem Anterior">
                      <ArrowLeftIcon />
                    </NavButton>
                    <NavButton className="right" onClick={handleNextImage} aria-label="Próxima Imagem">
                      <ArrowRightIcon />
                    </NavButton>
                  </>
                )}
              </MainImageContainerWithNav>
              {user?.scope === 'ADMIN' && currentProduct.galleryImageUrls ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentProduct.galleryImageUrls.map(url => url)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ThumbnailList>
                      {currentProduct.galleryImageUrls.map((url, index) => (
                        <SortableThumbnail
                          key={url}
                          id={url}
                          url={url}
                          isActive={index === selectedImageIndex}
                          onClick={() => setSelectedImageIndex(index)}
                          user={user}
                          isMainImage={index === 0}
                          handleDeleteImage={handleDeleteImage}
                        />
                      ))}
                    </ThumbnailList>
                  </SortableContext>
                </DndContext>
              ) : (
                <ThumbnailList>
                  {currentProduct.galleryImageUrls?.map((url, index) => (
                    <StyledThumbnail
                      key={url}
                      $isActive={index === selectedImageIndex}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image src={url} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'contain' }} />
                      {user?.scope === 'ADMIN' && index === 0 && (
                        <ThumbnailMainImageBadge title="Imagem Principal">
                          <StarIcon />
                        </ThumbnailMainImageBadge>
                      )}
                    </StyledThumbnail>
                  ))}
                </ThumbnailList>
              )}
            </GalleryColumn>

            <DetailsColumn>
              <ProductTitle>{currentProduct.productTitle}</ProductTitle>
              <SubtitleInfo>
                Marca: <strong>{currentProduct.productBrand || 'N/A'}</strong> | Condição: <strong>{currentProduct.productCondition || 'N/A'}</strong>
              </SubtitleInfo>

              <PricingBlock>
                {currentProduct.originalPrice > currentProduct.currentPrice && (
                  <PriceRow>
                    <OriginalPrice>{formatCurrency(currentProduct.originalPrice)}</OriginalPrice>
                    {currentProduct.discountPercentage && <DiscountBadge>{currentProduct.discountPercentage}</DiscountBadge>}
                  </PriceRow>
                )}
                <CurrentPrice>{formatCurrency(currentProduct.currentPrice)}</CurrentPrice>
                {currentProduct.installments > 1 && (
                  <InstallmentInfo>
                    ou em <strong>{currentProduct.installments}x de {formatCurrency(currentProduct.installmentValue)}</strong>
                  </InstallmentInfo>
                )}
              </PricingBlock>

              <p>Estoque: <strong>{currentProduct.stockStatus || 'Consulte na loja'}</strong></p>

              <AffiliateButton as="a" href={currentProduct.affiliateLink} target="_blank" rel="noopener noreferrer">
                Ver Oferta na Loja do Parceiro
              </AffiliateButton>

              <DisclaimerText>
                Atenção: Preços e informações de estoque podem sofrer pequenas alterações no site do parceiro devido ao tempo de sincronização. Sempre confirme os detalhes na página de destino.
              </DisclaimerText>

            </DetailsColumn>
          </MainLayout>

          {currentProduct.fullDescription && (
            <DescriptionSection>
              <h2>Descrição do Produto</h2>
              <div dangerouslySetInnerHTML={{ __html: currentProduct.fullDescription.replace(/\n/g, '<br />') }} />
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
    return { notFound: true };
  }
}

export default ProductDetailPage;