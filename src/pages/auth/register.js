import { useState, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { formatPhoneNumber } from '@/utils/formatters';
import PasswordStrengthMeter from '@/components/common/PasswordStrengthMeter';
import zxcvbn from 'zxcvbn';
import Link from 'next/link';
import { useNotification } from '@/hooks/useNotification';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRouter } from 'next/router';

// Styled Components
const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
`;

const RegisterForm = styled.form`
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  background-color: #fff;

  h2 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primaryBlue};
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 2rem 1.5rem;
    h2 {
      font-size: 1.5rem;
    }
  }
`;

const FormGroup = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
`;

const GroupTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FormFooterText = styled.p`
    font-size: 0.8rem;
    color: #666;
    margin-top: 1.5rem;
    text-align: center;
`;

const AvatarUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  cursor: pointer;
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: border-color 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryBlue};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100px;
    height: 100px;
  }
`;

const AvatarUploadText = styled.p`
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.9rem;
`;

const FileInput = styled.input`
    display: none;
`;

const CropContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
`;


function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    );
}

const RegisterPage = () => {
    const { register } = useAuth();
    const router = useRouter();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        name: '', username: '', email: '', phone: '', password: '', passwordConfirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const [imageBlob, setImageBlob] = useState(null);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Nome completo é obrigatório.';
        } else if (formData.name.trim().indexOf(' ') === -1) {
            newErrors.name = 'Por favor, insira nome e sobrenome.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'E-mail é obrigatório.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Formato de e-mail inválido.';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'Nome de usuário é obrigatório.';
        }

        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória.';
        } else if (zxcvbn(formData.password).score < 2) {
            newErrors.password = 'A senha é muito fraca.';
        }

        if (!formData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'Confirme sua senha.';
        } else if (formData.password && formData.password !== formData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'As senhas não coincidem.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === 'phone') {
            processedValue = formatPhoneNumber(value);
        }
        if (name === 'password') {
            setPasswordStrength(zxcvbn(value).score);
        }
        setFormData({ ...formData, [name]: processedValue });
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
        }
    };

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
        setCrop(centerAspectCrop(width, height, 1));
    }

    const getCroppedImg = () => {
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        if (!image || !completedCrop) return;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        ctx.drawImage(image, cropX, cropY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleAcceptCrop = async () => {
        const blob = await getCroppedImg();
        if (blob) {
            setImageBlob(blob);
            setImgSrc('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        const { passwordConfirmation, ...userRequestData } = {
            ...formData,
            phone: formData.phone.replace(/\D/g, '')
        };

        const registrationFormData = new FormData();
        registrationFormData.append('user', new Blob([JSON.stringify(userRequestData)], { type: 'application/json' }));

        if (imageBlob) {
            registrationFormData.append('file', imageBlob, 'profile.jpg');
        }

        try {
            await register(registrationFormData);

            showNotification({ title: "Sucesso!", message: "Conta criada! Por favor, faça o login." })
            router.push('/auth/login');

        } catch (err) {
            setErrors({ form: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <RegisterContainer>
                <RegisterForm onSubmit={handleSubmit}>
                    <h2>Crie sua Conta</h2>
                    <AvatarUploadContainer onClick={() => fileInputRef.current?.click()}>
                        <AvatarPreview>
                            {imageBlob ? (
                                <img src={URL.createObjectURL(imageBlob)} alt="Preview" />
                            ) : (
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            )}
                        </AvatarPreview>
                        <AvatarUploadText>
                            {imageBlob ? 'Clique para trocar a foto' : 'Adicionar foto de perfil (Opcional)'}
                        </AvatarUploadText>
                        <FileInput type="file" ref={fileInputRef} onChange={onSelectFile} accept="image/*" />
                    </AvatarUploadContainer>

                    {imgSrc && (
                        <CropContainer>
                            <div>
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={c => setCompletedCrop(c)}
                                    aspect={1}
                                    circularCrop
                                >
                                    <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '40vh' }} />
                                </ReactCrop>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                                    <Button type="button" onClick={handleAcceptCrop}>Confirmar</Button>
                                    <Button type="button" onClick={() => setImgSrc('')} style={{ backgroundColor: '#6c757d' }}>Cancelar</Button>
                                </div>
                            </div>
                        </CropContainer>
                    )}

                    <FormGroup>
                        <GroupTitle>Informações Pessoais</GroupTitle>
                        <Input id="name" name="name" type="text" label="Nome Completo" value={formData.name} onChange={handleChange} required error={errors.name} />
                        <Input id="email" name="email" type="email" label="E-mail" value={formData.email} onChange={handleChange} required error={errors.email} />
                        <Input id="phone" name="phone" type="tel" label="Telefone (Opcional)" value={formData.phone} onChange={handleChange} maxLength="15" />
                    </FormGroup>
                    <FormGroup>
                        <GroupTitle>Informações da Conta</GroupTitle>
                        <Input id="username" name="username" type="text" label="Nome de Usuário" value={formData.username} onChange={handleChange} required error={errors.username} />
                        <Input id="password" name="password" type="password" label="Senha" value={formData.password} onChange={handleChange} required error={errors.password} />
                        <Input id="passwordConfirmation" name="passwordConfirmation" type="password" label="Confirme sua Senha" value={formData.passwordConfirmation} onChange={handleChange} required error={errors.passwordConfirmation} />
                        <PasswordStrengthMeter score={passwordStrength} />
                    </FormGroup>

                    {errors.form && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{errors.form}</p>}
                    <Button type="submit" style={{ width: '100%', padding: '12px' }} disabled={isSubmitting}>
                        {isSubmitting ? "Criando conta..." : "Criar Conta"}
                    </Button>

                    <FormFooterText>
                        Já tem uma conta?{' '}
                        <Link href="/auth/login" style={{ color: '#2A4A87' }}>
                            Faça login
                        </Link>
                    </FormFooterText>
                </RegisterForm>
            </RegisterContainer>
        </Layout>
    );
};

export default RegisterPage;