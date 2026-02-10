import { useAppSelector, useError } from "../../store";
import { ErrorComponents } from "./components";

export default function ErrorBoundary({
    children,
}: {
    children: React.ReactNode
}) {
    const err = useError();
    const errorData = useAppSelector((state) => state.error);
    if(!errorData.hasError) return children;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4">
            <ErrorComponents.Title error={errorData} />
            <ErrorComponents.ClearButton onClear={() => {
                err.clear();
            }} />
        </div>
            
    )
}