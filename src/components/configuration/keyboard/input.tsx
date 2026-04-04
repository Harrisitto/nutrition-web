import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export const KeyboardInput = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (newKey: string) => void;
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation("data");

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Ignore modifier-only presses so shortcuts always store an actionable key.
        if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;

        const key = e.key === " " ? "Space" : e.key;
        onChange(key);
        setIsFocused(false);
        inputRef.current?.blur();
    }, [onChange]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        inputRef.current?.select();
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    return (
        <input
            ref={inputRef}
            type="text"
            value={isFocused ? "" : value}
            readOnly
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={t("configuration.sections.keyboard.pressKey")}
            className="w-full rounded-md border border-nutrition-green/20 bg-white px-3 py-2 text-sm font-semibold text-dark-green shadow-inner outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
        />
    );
};