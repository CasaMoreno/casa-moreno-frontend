import { createContext, useState, useContext } from 'react';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isConfirmation: false,
    });

    const showConfirmation = ({ title, message, onConfirm }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            onConfirm,
            isConfirmation: true,
        });
    };

    const showNotification = ({ title, message }) => {
        setModalState({
            isOpen: true,
            title,
            message,
            onConfirm: () => { },
            isConfirmation: false,
        });
    };

    const hideModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    return (
        <NotificationContext.Provider value={{ showConfirmation, showNotification }}>
            {children}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                isConfirmation={modalState.isConfirmation}
                onConfirm={modalState.onConfirm}
                onClose={hideModal}
            />
        </NotificationContext.Provider>
    );
};

export default NotificationContext;