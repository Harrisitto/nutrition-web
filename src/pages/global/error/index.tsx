import { useAppSelector } from "../../../hooks/redux";
import ErrorPage from "./components/page";

export default function ErrorBoundary({
    children,
}: {
    children: React.ReactNode
}) {
    const errorData = useAppSelector((state) => state.error);
    if(!errorData.hasError) return children;
    return <ErrorPage error={errorData} />
}