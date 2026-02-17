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

