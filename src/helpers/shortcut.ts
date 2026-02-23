export const normalizeStringForShortcut = (str: string) => {
    return str.trim().toLowerCase().replace(/\s+/g, '');
}

export const addFormatToShortcut = (shortcut: string, format: string) => {
    if (shortcut.includes(format)) {
        return shortcut;
    }
    return format + shortcut;
}

export const removeFormatFromShortcut = (shortcut: string, format: string) => {
    if (shortcut.includes(format)) {
        return shortcut.replace(format, "");
    }
    return shortcut;
}

export const containsFormat = (shortcut: string, format: string) => {
    return shortcut.includes(format);
}

export const compareEqualStringsforShortcut = (shortcut: string, componentStr: string, format: string) => {
    const shortcutWithoutFormat = removeFormatFromShortcut(shortcut, format);
    const componentWithoutFormat = removeFormatFromShortcut(componentStr, format);
    return normalizeStringForShortcut(shortcutWithoutFormat) === normalizeStringForShortcut(componentWithoutFormat);
};

export const compareIncludeStringsForShortcut = (shortcut: string, componentStr: string) => {
    const normalizedShortcut = normalizeStringForShortcut(shortcut);
    const normalizedComponentStr = normalizeStringForShortcut(componentStr);
    return normalizedComponentStr.includes(normalizedShortcut)
};