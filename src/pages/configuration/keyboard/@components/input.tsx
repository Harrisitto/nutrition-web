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
            className="w-28 shrink-0 cursor-pointer rounded border border-b-2 border-nutrition-green/25 bg-white-green px-2 py-1 text-center font-mono text-xs font-bold text-nutrition-green outline-none transition-colors placeholder:font-sans placeholder:font-medium placeholder:text-text-muted focus:placeholder:text-white-green/80 hover:border-nutrition-green/50 focus:border-dark-green focus:bg-nutrition-green focus:placeholder:animate-pulse"
        />
    );
};