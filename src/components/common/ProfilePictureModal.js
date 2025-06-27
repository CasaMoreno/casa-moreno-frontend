import { useState, useRef } from 'react';
import styled from 'styled-components';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Button from './Button';
import CancelButton from './CancelButton';
import apiClient from '@/api/axios';
import { useNotification } from '@/hooks/useNotification';

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000; padding: 1rem;
`;

const ModalContent = styled.div`
  background: white; padding: 2rem; border-radius: 8px;
  width: 100%; max-width: 600px;
  max-height: 90vh; display: flex; flex-direction: column;
`;

const ModalHeader = styled.h2`
  margin-top: 0; margin-bottom: 1.5rem; text-align: center;
`;

const CropContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  min-height: 300px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.darkGray};
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e9e9e9;
  }
`;

const ButtonContainer = styled.div`
  display: flex; justify-content: flex-end;
  gap: 1rem; margin-top: 1rem;
`;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    );
}

const ProfilePictureModal = ({ userId, onClose, onUploadSuccess }) => {
    const { showNotification } = useNotification();
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [isUploading, setIsUploading] = useState(false);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function onImageLoad(e) {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        const initialCrop = centerAspectCrop(width, height, 1);
        setCrop(initialCrop);
        setCompletedCrop(initialCrop);
    }

    async function handleUpload() {
        if (!completedCrop || !imgRef.current) {
            showNotification({ title: 'Erro', message: 'Por favor, selecione e ajuste a área da imagem.' });
            return;
        }

        setIsUploading(true);
        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = Math.floor(completedCrop.width * scaleX);
        canvas.height = Math.floor(completedCrop.height * scaleY);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        canvas.toBlob(async (blob) => {
            if (!blob) {
                setIsUploading(false);
                showNotification({ title: 'Erro', message: 'Não foi possível processar a imagem.' });
                return;
            }

            const formData = new FormData();
            formData.append('file', blob, 'profile.jpg');

            try {
                const response = await apiClient.post(`/users/${userId}/profile-picture`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                showNotification({ title: 'Sucesso!', message: 'Foto de perfil atualizada.' });
                onUploadSuccess(response.data);
                onClose();
            } catch (error) {
                console.error("Upload failed", error);
                showNotification({ title: 'Erro', message: 'Falha no upload. Tente novamente.' });
            } finally {
                setIsUploading(false);
            }
        }, 'image/jpeg', 0.9);
    }

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>Atualizar Foto de Perfil</ModalHeader>

                <FileInput type="file" accept="image/*" ref={fileInputRef} onChange={onSelectFile} />
                <FileInputLabel onClick={() => fileInputRef.current?.click()}>
                    {imgSrc ? 'Trocar Imagem' : 'Escolher Imagem'}
                </FileInputLabel>

                <CropContainer>
                    {imgSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imgSrc}
                                onLoad={onImageLoad}
                                style={{ maxHeight: '60vh' }}
                            />
                        </ReactCrop>
                    )}
                </CropContainer>

                <ButtonContainer>
                    <CancelButton onClick={onClose}>Cancelar</CancelButton>
                    <Button onClick={handleUpload} disabled={isUploading || !completedCrop}>
                        {isUploading ? 'Enviando...' : 'Salvar Foto'}
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default ProfilePictureModal;