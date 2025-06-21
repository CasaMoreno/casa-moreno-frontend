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

// DND-KIT Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


// Ícones SVG
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFD700" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
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


const ThumbnailList = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
   gap: 0.75rem;
 `;

const StyledThumbnail = styled.div` /* Renomeado para evitar conflito com o wrapper SortableThumbnail */
   width: 100%;
   padding-top: 100%;  
   position: relative;
   border-radius: 5px;
   overflow: hidden;
   cursor: pointer; /* Cursor padrão para não-arrastáveis ou quando não está arrastando */
   border: 2px solid ${({ isActive }) => (isActive ? '#2A4A87' : '#eee')};
   transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    
   /* Estilos para arrastar e soltar do dnd-kit */
   ${({ isDragging }) => isDragging && css`
     opacity: 0.5; /* Item arrastado fica semi-transparente */
     border-color: ${({ theme }) => theme.colors.primaryPurple};
     box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryPurple};
   `}

   /* Estilos para o item sendo arrastado (clone no cursor) - gerido pelo dnd-kit */
   /* Isso pode precisar de ajustes dependendo do comportamento exato do navegador/dnd-kit */
   &.dnd-kit-dragging-sortable { /* Classe que dnd-kit aplica ao clone */
     cursor: grabbing;
   }
 `;

const ThumbnailActions = styled.div`
     position: absolute;
     top: 5px;
     left: 5px;
     right: 5px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     z-index: 5;
      
     button {
         background-color: rgba(0, 0, 0, 0.6);
         color: white;
         border: none;
         border-radius: 3px;
         width: 18px; /* Reduzido o tamanho */
         height: 18px; /* Reduzido o tamanho */
         padding: 0;
         font-size: 0.65rem; /* Reduzido a fonte para o 'X' */
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
         &:hover {
             background-color: #c82333;
         }
     }

     .main-image-badge {
        background-color: rgba(0, 0, 0, 0.6);
        color: #FFD700;
        border-radius: 3px;
        width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
     }
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

// Componente Wrapper para SortableItem
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
    zIndex: isDragging ? 1000 : 'auto', // Garante que o item arrastado fique por cima
  };

  return (
    <StyledThumbnail
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      isActive={isActive}
      onClick={onClick}
      isDragging={isDragging}
    >
      <Image src={url} alt={`Thumbnail ${id}`} fill style={{ objectFit: 'contain' }} />
      {user?.scope === 'ADMIN' && (
        <ThumbnailActions>
          {isMainImage && ( // Renderiza o badge da estrela SOMENTE se for a imagem principal
            <div title="Imagem Principal" className="main-image-badge">
              <StarIcon />
            </div>
          )}
          <button title="Excluir imagem" className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteImage(id); }}>X</button>
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

  // DND-KIT Hooks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setCurrentProduct(product);
    // Assegura que o índice selecionado esteja sempre dentro dos limites e a primeira imagem seja a principal por padrão
    if (product?.galleryImageUrls && product.galleryImageUrls.length > 0) {
      // Se a imagem principal do produto mudou (primeiro item do array), ou a imagem selecionada não existe mais,
      // ou a imagem selecionada não é a primeira mas a nova principal não é a mesma do selectedImageIndex atual,
      // redefinir para 0.
      if (
        !currentProduct?.galleryImageUrls || // Se currentProduct ainda não foi inicializado (primeira render)
        selectedImageIndex >= product.galleryImageUrls.length ||
        (product.galleryImageUrls[0] !== currentProduct.galleryImageUrls[0] && selectedImageIndex !== 0) ||
        (selectedImageIndex !== 0 && !product.galleryImageUrls.includes(currentProduct.galleryImageUrls[selectedImageIndex]))
      ) {
        setSelectedImageIndex(0);
      }
    } else {
      setSelectedImageIndex(0); // Nenhum produto ou nenhuma imagem, seleciona 0.
    }
  }, [product]);

  if (error) return <Layout><p style={{ textAlign: 'center', marginTop: '3rem' }}>{error}</p></Layout>
  if (router.isFallback || !currentProduct) return <Layout><div>Carregando...</div></Layout>;

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return '';
    return value.toFixed(2).replace('.', ',');
  };

  const mainImageUrl = currentProduct.galleryImageUrls?.[selectedImageIndex] || '/placeholder.png';

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

          router.replace(router.asPath); // Recarrega os dados do servidor

          showNotification({ title: 'Sucesso', message: 'Imagem excluída com sucesso!' });
        } catch (err) {
          console.error("Falha ao excluir imagem", err);
          showNotification({ title: 'Erro', message: 'Falha ao excluir imagem. Tente novamente.' });
        }
      }
    });
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      (prevIndex + 1) % currentProduct.galleryImageUrls.length
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      (prevIndex - 1 + currentProduct.galleryImageUrls.length) % currentProduct.galleryImageUrls.length
    );
  };

  const hasMultipleImages = currentProduct.galleryImageUrls && currentProduct.galleryImageUrls.length > 1;

  // DND-KIT: Função para lidar com o fim do arrasto
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) { // Se não houver 'over' ou for o mesmo item, não faz nada
      return;
    }

    const oldIndex = currentProduct.galleryImageUrls.indexOf(active.id);
    const newIndex = currentProduct.galleryImageUrls.indexOf(over.id);

    // Se os índices forem válidos e diferentes, move a imagem
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const newOrderedGallery = arrayMove(currentProduct.galleryImageUrls, oldIndex, newIndex);

      // Atualiza o estado local para uma prévia instantânea
      setCurrentProduct(prev => ({ ...prev, galleryImageUrls: newOrderedGallery }));

      // Ajusta o selectedImageIndex se a imagem principal mudar ou a selecionada for movida
      if (newIndex === 0) { // Se o item foi movido para a primeira posição
        setSelectedImageIndex(0);
      } else if (selectedImageIndex === oldIndex) { // Se o item selecionado foi movido, seu novo índice é newIndex
        setSelectedImageIndex(newIndex);
      } else if (selectedImageIndex === newIndex && oldIndex !== 0) { // Se o selectedImageIndex foi o "alvo" e o item ativo NÃO era o principal
        // O selectedImageIndex permanece o mesmo, mas o item que estava lá foi movido.
        // A imagem que estava em oldIndex agora está em newIndex (se newIndex < oldIndex), ou em newIndex - 1 (se newIndex > oldIndex)
        // No entanto, a lógica do arrayMove já reflete a nova ordem.
        // Para simplicidade, se o selectedImageIndex era o alvo, e o item ativo foi para lá,
        // e o item ativo não era o principal, o selectedImageIndex continua apontando para o item que está agora em newIndex.
      } else if (selectedImageIndex > oldIndex && selectedImageIndex <= newIndex) {
        // Se o item selecionado estava entre a posição original e a nova posição do item arrastado,
        // e o item foi movido para uma posição anterior, o selectedImageIndex deveria ser incrementado
        setSelectedImageIndex(prevIndex => prevIndex - 1);
      } else if (selectedImageIndex < oldIndex && selectedImageIndex >= newIndex) {
        // Se o item selecionado estava entre a nova posição e a posição original do item arrastado,
        // e o item foi movido para uma posição posterior, o selectedImageIndex deveria ser decrementado
        setSelectedImageIndex(prevIndex => prevIndex + 1);
      }
      // Caso contrário, selectedImageIndex não é afetado diretamente pela movimentação.



      // Notifica o backend com a nova ordem.
      // Se o item que foi para a primeira posição já era o primeiro, não é necessário fazer uma chamada para set-main.
      // Apenas a ordem geral precisa ser atualizada.
      try {
        // Envia a nova ordem completa das imagens. O backend pode inferir a principal.
        await apiClient.put(`/products/update`, {
          productId: currentProduct.productId,
          galleryImageUrls: newOrderedGallery
        });
        showNotification({ title: 'Sucesso', message: 'Ordem das imagens atualizada!' });
        // A UI já foi atualizada localmente acima, então não precisamos de router.replace a menos que haja um erro.
        // Se o primeiro item do array mudou, o `useEffect` que observa `product` (quando `router.replace` recarregar)
        // garantirá que `selectedImageIndex` seja 0, que é o comportamento desejado.
      } catch (err) {
        console.error("Falha ao atualizar a ordem das imagens", err);
        showNotification({ title: 'Erro', message: 'Falha ao atualizar a ordem das imagens. Tente novamente.' });
        setCurrentProduct(product); // Reverte a UI em caso de erro da API
        // Também reverta o selectedImageIndex se houve um erro no backend.
        setSelectedImageIndex(currentProduct.galleryImageUrls.indexOf(mainImageUrl)); // Tenta voltar para o índice da imagem principal anterior
      }
    }
  };


  return (
    <Layout>
      <Head>
        <title>{`${currentProduct.productTitle} - Casa Moreno`}</title>
        <meta name="description" content={`Detalhes sobre ${currentProduct.productTitle}`} />
      </Head>
      <PageWrapper>
        <ProductPageContainer>
          {user?.scope === 'ADMIN' && (
            <AdminActionWrapper>
              <Link href={`/admin/edit/${currentProduct.productId}`} passHref>
                <AdminEditButton as="a"><EditIcon />Editar</AdminEditButton>
              </Link>
            </AdminActionWrapper>
          )}

          <Breadcrumbs>
            <Link href="/">Home</Link>
            {currentProduct.productCategory && <><span>&gt;</span><Link href={`/products/${currentProduct.productCategory.toLowerCase()}`}>{currentProduct.productCategory}</Link></>}
            {currentProduct.productSubcategory && <><span>&gt;</span>{currentProduct.productSubcategory}</>}
          </Breadcrumbs>

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
              {user?.scope === 'ADMIN' && currentProduct.galleryImageUrls ? ( /* Condicionalmente renderiza DndContext */
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentProduct.galleryImageUrls.map(url => url)} /* IDs únicos para os itens sortable */
                    strategy={verticalListSortingStrategy}
                  >
                    <ThumbnailList>
                      {currentProduct.galleryImageUrls.map((url, index) => (
                        <SortableThumbnail
                          key={url} /* key é importante para o React */
                          id={url} /* id é necessário para o useSortable */
                          url={url}
                          isActive={index === selectedImageIndex}
                          onClick={() => setSelectedImageIndex(index)}
                          user={user}
                          isMainImage={index === 0} // Passa true se for a primeira imagem
                          handleDeleteImage={handleDeleteImage}
                        />
                      ))}
                    </ThumbnailList>
                  </SortableContext>
                </DndContext>
              ) : ( /* Renderização normal se não for admin ou não houver imagens */
                <ThumbnailList>
                  {currentProduct.galleryImageUrls?.map((url, index) => (
                    <StyledThumbnail
                      key={url}
                      isActive={index === selectedImageIndex}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image src={url} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'contain' }} />
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
                    <OriginalPrice>R$ {formatCurrency(currentProduct.originalPrice)}</OriginalPrice>
                    {currentProduct.discountPercentage && <DiscountBadge>{currentProduct.discountPercentage}</DiscountBadge>}
                  </PriceRow>
                )}
                <CurrentPrice>R$ {formatCurrency(currentProduct.currentPrice)}</CurrentPrice>
                {currentProduct.installments > 1 && (
                  <InstallmentInfo>
                    ou em <strong>{currentProduct.installments}x de R$ {formatCurrency(currentProduct.installmentValue)}</strong>
                  </InstallmentInfo>
                )}
              </PricingBlock>

              <p>Estoque: <strong>{currentProduct.stockStatus || 'Consulte na loja'}</strong></p>
              <a href={currentProduct.affiliateLink} target="_blank" rel="noopener noreferrer">
                <AffiliateButton>Ver Oferta na Loja do Parceiro</AffiliateButton>
              </a>
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
    return { props: { product: null, error: "Produto não encontrado ou indisponível." } };
  }
}

export default ProductDetailPage;