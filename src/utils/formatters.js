// src/utils/formatters.js

export const formatPhoneNumber = (value) => {
    // Se o valor for nulo ou indefinido, retorne uma string vazia
    if (!value) return "";

    // Remove todos os caracteres que não são dígitos
    const cleaned = ('' + value).replace(/\D/g, '');

    // Limita a 11 dígitos
    const truncated = cleaned.slice(0, 11);

    // Aplica a máscara (xx) xxxxx-xxxx
    let match = truncated.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    match = truncated.match(/^(\d{2})(\d{1,5})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}`;
    }

    if (truncated.length > 0) {
        return `(${truncated}`;
    }

    return truncated;
};