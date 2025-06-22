// src/utils/formatters.js

export const formatPhoneNumber = (value) => {
    if (!value) return "";

    const cleaned = ('' + value).replace(/\D/g, '');
    const truncated = cleaned.slice(0, 11);

    // Formato para celular com 9 dígitos (ex: (xx)xxxxx-xxxx)
    if (truncated.length > 6) {
        // CORREÇÃO: Removido o espaço depois do ')'
        return `(${truncated.slice(0, 2)})${truncated.slice(2, 7)}-${truncated.slice(7, 11)}`;
    }
    
    // Formato parcial (também sem espaço)
    if (truncated.length > 2) {
        return `(${truncated.slice(0, 2)})${truncated.slice(2)}`;
    }

    // Se tiver menos de 2 dígitos, retorna o que tem
    return truncated;
};