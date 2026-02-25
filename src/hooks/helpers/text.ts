import { useEffect, useState } from "react";

export const useFetchTxt = ({
    relativePath,
    extension = "txt",
}: {
    relativePath: string;
    extension?: string;
}) => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}${relativePath}.${extension}`)
            .then((r) => r.text())
            .then(setText);
    }, [relativePath, extension]);

    return text;
}


