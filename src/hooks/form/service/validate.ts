import { getYoutubeVideoId } from "@src/helpers/youtube";

export const ValidateStringRequired = (value: string) => {
    if (!value.trim()) { return 'system:form.required'; } return '';
};

export const ValidateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(value)) { 
        return 'system:form.invalidEmail';
    } 
    return '';
};

export const ValidateMinLength = (value: string, min: number) => {
    if (value.length < min) { 
        return `system:form.minLength`; 
    } 
    return '';
};

export const ValidateMaxLength = (value: string, max: number) => { 
    if (value.length > max) { 
        return `system:form.maxLength`; 
    } 
    return ''; 
};

export const ValidateMinValue = (value: number, min: number) => {
    if (value < min) { 
        return `system:form.minValue`; 
    } 
    return '';
};

export const ValidateMaxValue = (value: number, max: number) => { 
    if (value > max) { 
        return `system:form.maxValue`; 
    } 
    return ''; 
};

export const ValidateIsUrl = (value: string) => {
    try {
        const url = new URL(value.trim());
        if (url.protocol === 'https:') { return ''; }
    } catch {
        // URL lanza si el texto no es una URL
    }
    return 'system:form.invalidUrl';
};

export const ValidateYoutubeUrl = (value: string) => {
    if (!getYoutubeVideoId(value)) { return 'system:form.invalidYoutubeUrl'; }
    return '';
};

export const ValidateFileRequired = (value: File | null) => {
    if (!value) { return 'system:form.required'; }
    return '';
};

// Sin fichero no hay nada que comprobar: la obligatoriedad va en ValidateFileRequired
export const ValidateFileType = (value: File | null, allowedMimeTypes: readonly string[]) => {
    if (value && !allowedMimeTypes.includes(value.type)) { return 'system:form.invalidFileType'; }
    return '';
};

export const ValidateFileMaxSize = (value: File | null, maxBytes: number) => {
    if (value && value.size > maxBytes) { return 'system:form.fileTooLarge'; }
    return '';
};
