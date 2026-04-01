import { useFetchSingleUser } from "@src/services/tanstack/user/profile"

export const Email = () => {
    const infoQuery = useFetchSingleUser();

    if (!infoQuery.data) return null;
    return <p className="text-sm text-text-secondary">{
        `${"No email"}`
    }</p>;
}

export const Phone = () => {
    const infoQuery = useFetchSingleUser();

    if (!infoQuery.data) return null;
    return <p className="text-sm text-text-secondary">
        {`"No phone number"}`}
    </p>;
}