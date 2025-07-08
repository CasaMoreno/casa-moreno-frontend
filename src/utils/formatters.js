// src/utils/formatters.js

export const formatPhoneNumber = (value) => {
    if (!value) return "";

    const cleaned = ('' + value).replace(/\D/g, '');
    const truncated = cleaned.slice(0, 11);

    if (truncated.length > 6) {
        return `(${truncated.slice(0, 2)})${truncated.slice(2, 7)}-${truncated.slice(7, 11)}`;
    }

    if (truncated.length > 2) {
        return `(${truncated.slice(0, 2)})${truncated.slice(2)}`;
    }

    return truncated;
};

export const formatCurrency = (value) => {
    if (typeof value !== 'number') {
        return 'N/A'; // Retorna um valor padrão se o preço não for um número
    }
    // Usa a API de Internacionalização do JavaScript
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);

    // Remove o espaço entre "R$" e o número para ficar "R$1.547,44"
    return formatted.replace(/\s/g, '');
};