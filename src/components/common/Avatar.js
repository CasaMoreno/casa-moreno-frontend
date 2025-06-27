import styled from 'styled-components';
import Image from 'next/image';

const AvatarWrapper = styled.div`
  width: ${({ size }) => size || '120px'};
  height: ${({ size }) => size || '120px'};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.primaryBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ fontSize }) => fontSize || '3.5rem'};
  font-weight: bold;
  flex-shrink: 0;
  overflow: hidden; 
  position: relative;
  border: 3px solid ${({ theme }) => theme.colors.primaryBlue};
`;

const StyledImage = styled(Image)`
  object-fit: cover;
`;

const Avatar = ({ user, size, fontSize }) => {
    if (!user) return null;

    const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

    return (
        <AvatarWrapper size={size} fontSize={fontSize}>
            {user.profilePictureUrl ? (
                <StyledImage
                    src={user.profilePictureUrl}
                    alt={`Foto de perfil de ${user.name}`}
                    fill
                    priority
                />
            ) : (
                <span>{initial}</span>
            )}
        </AvatarWrapper>
    );
};

export default Avatar;