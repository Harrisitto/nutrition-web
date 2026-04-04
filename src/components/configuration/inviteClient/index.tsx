import { useDeleteUserInvitation, useFetchAvailableClients, useFetchInvitedClients, useMutateUserInvitations } from "@src/services/tanstack/user/invitations";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationPages } from "../default/pages";

const Invitation = ({
    id,
    code,
}: {
    id: string;
    code: string;
}) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const inviteMutation = useMutateUserInvitations();

     const handleSendInvitation = useCallback(() => {
        if(message.length < 10) {
            setError(t("data:configuration.sections.invitations.messageTooShort") ?? "Message must be at least 10 characters long");
            return;
        }
    
        setError(null);
        inviteMutation.mutate({ clientId: id, message });
    }, [inviteMutation, id, message]);

    return (
        <li className="rounded-xl border border-nutrition-green/20 bg-white-green/60 p-4 shadow-sm transition-colors hover:border-nutrition-green/35">
            <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {t("data:configuration.sections.invitations.invitationCode")}
                </p>
                <span className="rounded-full border border-nutrition-green/25 bg-white px-3 py-1 text-xs font-semibold text-dark-green">
                    {code}
                </span>
            </div>
            <p className="text-sm font-medium text-dark-green">{t("data:configuration.sections.invitations.writeMessage")}</p>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("data:configuration.sections.invitations.messagePlaceholder") ?? "Write a message..."}
                className="mt-2 min-h-24 w-full rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
            />
                {error && <p className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <button
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-nutrition-green px-4 py-2 text-sm font-semibold text-white-green transition-colors hover:bg-dark-green disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSendInvitation}
                disabled={inviteMutation.isPending || !message.trim()}
            >
                {t("data:configuration.sections.invitations.sendInvitation")}
            </button>
        </li>
    )
}

const Invited = ({
    message,
    clientId,
}: {
    message?: string;
    clientId: string;
}) => {
    const { t } = useTranslation();
    const deleteMutation = useDeleteUserInvitation();
    return (
        <li className="rounded-xl border border-nutrition-green/20 bg-white-green/60 p-4 shadow-sm transition-colors hover:border-nutrition-green/35">
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {t("data:configuration.sections.invitations.client")}
                </p>
                <span className="rounded-full border border-nutrition-green/25 bg-white px-3 py-1 text-xs font-semibold text-dark-green">
                    {clientId}
                </span>
            </div>
            {message ? (
                <p className="text-sm text-dark-green/90">{t("data:configuration.sections.invitations.message", { message })}</p>
            ) : null}
            <button
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => deleteMutation.mutate(clientId)}
                disabled={deleteMutation.isPending}
            >
                {t("data:configuration.sections.invitations.revoke")}
            </button>
        </li>
    )
}

export const InviteClient = () => {

    const [code, setCode] = useState("");
    const { t } = useTranslation();
    const query = useFetchAvailableClients({ invitationCode: code });

    return (
        <ConfigurationPages
            title={t("data:configuration.sections.invitations.title")}
            description={t("data:configuration.sections.invitations.description")}
        >
            <section className="rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-5 shadow-md">

                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t("data:configuration.sections.invitations.searchPlaceholder") ?? "Search by invitation code..."}
                    className="mb-4 w-full rounded-lg border border-nutrition-green/20 bg-white px-3 py-2 text-sm text-dark-green outline-none transition-all placeholder:text-text-muted/80 focus:border-nutrition-green/50 focus:ring-2 focus:ring-light-green/40"
                />

                {query.isLoading && <p className="text-sm text-text-muted">{t("data:configuration.sections.invitations.loading")}</p>}
                {query.isError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{t("data:configuration.sections.invitations.error")}</p>}
                {query.data && query.data.length === 0 && <p className="rounded-lg border border-nutrition-green/15 bg-white-green/40 px-3 py-3 text-sm text-text-muted">{t("data:configuration.sections.invitations.noResults")}</p>}
                {query.data && query.data.length > 0 && (
                    <ul className="space-y-3">
                        {query.data.map((client) => (
                            <Invitation key={client.invitation_code} code={client.invitation_code} id={client.user_id} />
                        ))}
                    </ul>
                )}
            </section>
        </ConfigurationPages>
    )
}

export const InvitedClients = () => {
    const { t } = useTranslation();
    const query = useFetchInvitedClients();

    return (
        <ConfigurationPages
            title={t("data:configuration.sections.invitations.invitedTitle")}
            description={t("data:configuration.sections.invitations.description")}
        >
            <section className="rounded-2xl border border-nutrition-green/20 bg-gradient-to-br from-white to-white-green/70 p-5 shadow-md">
                {query.isLoading && <p className="text-sm text-text-muted">{t("data:configuration.sections.invitations.loading")}</p>}
                {query.isError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{t("data:configuration.sections.invitations.error")}</p>}
                {query.data && query.data.length === 0 && <p className="rounded-lg border border-nutrition-green/15 bg-white-green/40 px-3 py-3 text-sm text-text-muted">{t("data:configuration.sections.invitations.noInvitations")}</p>}
                {query.data && query.data.length > 0 && (
                    <ul className="space-y-3">
                        {query.data.map((invitation) => (
                            <Invited key={invitation.client_id} clientId={invitation.client_id} />
                        ))}
                    </ul>
                )}
            </section>
        </ConfigurationPages>
    )
}