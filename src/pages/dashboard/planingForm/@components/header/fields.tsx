import FromDate from "@src/helpers/dates";
import { useFetchUserWeightForDateRange } from "@src/services/tanstack/user/info";
import {
  useFetchSingleUser,
  useUpdateClientGoal,
} from "@src/services/tanstack/user/profile";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <div className={metricStyles.row}>
      <span className={metricStyles.label}>{label}</span>
      <span className={metricStyles.value}>{children}</span>
    </div>
  );
};

export const LastSeen = () => {
  const infoQuery = useFetchSingleUser();
  const { t } = useTranslation();

  const formattedLastSeen = useMemo(() => {
    const lastSeen = infoQuery.data?.last_seen;
    const neverSeen = t("data:dashboardTable.userInfo.neverSeen");
    if (!lastSeen) return neverSeen;

    const lastSeenDate = new Date(lastSeen);
    if (Number.isNaN(lastSeenDate.getTime())) return neverSeen;

    const diffInDays = Math.max(
      0,
      Math.floor((Date.now() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return t("data:dashboardTable.userInfo.lastSeen", {
      days: diffInDays,
    });
  }, [infoQuery.data, t]);

  if (!infoQuery.data) return null;

  return (
    <InfoRow label={t("data:dashboardTable.userInfo.lastSeenLabel")}>
      {formattedLastSeen}
    </InfoRow>
  );
};

export const Email = () => {
  const { t } = useTranslation();
  const infoQuery = useFetchSingleUser();

  if (!infoQuery.data) return null;

  const email = infoQuery.data?.email ?? "";
  const emailLabel = t("data:dashboardTable.userInfo.email");

  return (
    <InfoRow label={emailLabel}>
      {email ? (
        <a href={`mailto:${email}`} className={metricStyles.link}>
          {email}
        </a>
      ) : (
        "?"
      )}
    </InfoRow>
  );
};

export const Phone = () => {
  const infoQuery = useFetchSingleUser();
  const { t } = useTranslation();

  if (!infoQuery.data) return null;

  const phone = infoQuery.data?.phone ?? "";
  const normalizedPhone = phone.replace(/\D/g, "");
  const hasValidWhatsAppTarget = normalizedPhone.length > 7;
  const whatsAppUrl = hasValidWhatsAppTarget
    ? `https://web.whatsapp.com/send?phone=${normalizedPhone}`
    : "";
  const phoneLabel = t("data:dashboardTable.userInfo.phone");

  return (
    <InfoRow label={phoneLabel}>
      {phone ? (
        hasValidWhatsAppTarget ? (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={metricStyles.link}
          >
            {phone}
          </a>
        ) : (
          phone
        )
      ) : (
        "?"
      )}
    </InfoRow>
  );
};

export const Age = () => {
  const infoQuery = useFetchSingleUser();
  const { t } = useTranslation();
  const age = useMemo(() => {
    if (!infoQuery.data || !infoQuery.data?.birth_date) return null;
    const birthDate = infoQuery.data.birth_date;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, [infoQuery.data]);

  if (age === null) return null;
  return <InfoRow label={t("data:dashboardTable.userInfo.age")}>{age}</InfoRow>;
};

export const Weight = () => {
  const date = new FromDate();
  const weight = useFetchUserWeightForDateRange({
    startDate: date.thisMonday(),
    endDate: date.thisSunday(),
  });
  const { t } = useTranslation();

  if (!weight.data) return null;
  return (
    <InfoRow
      label={t("data:dashboardTable.userInfo.weight")}
    >{`${weight.data} kg`}</InfoRow>
  );
};

export const Goal = () => {
  const infoQuery = useFetchSingleUser();
  const updateQuery = useUpdateClientGoal();
  const { t } = useTranslation();
  const [goalText, setGoalText] = useState("");

  const updateGoal = useCallback(
    (text: string) => {
      // Here you would normally call a mutation to save the updated goal to the database
      // For example: updateUserGoal.mutate(goalText);
      updateQuery.mutateAsync(text);
    },
    [updateQuery],
  );

  useEffect(() => {
    if (infoQuery.data) {
      setGoalText(infoQuery.data?.goal ?? "");
    }
  }, [infoQuery.data]);

  return (
    <div className={metricStyles.card}>
      <p className={metricStyles.cardTitle}>
        {t("data:dashboardTable.userInfo.goal")}
      </p>
      <textarea
        className={metricStyles.input}
        value={goalText}
        onChange={(e) => {
          setGoalText(e.target.value);
        }}
        onBlur={() => {
          updateGoal(goalText);
        }}
        placeholder={". . ."}
      />
    </div>
  );
};

const metricStyles = {
  // Contenedor horizontal que alinea todos los elementos en una sola fila
  container:
    "w-full flex flex-row items-stretch gap-3 p-2 bg-white-green/30 rounded-2xl border border-fade-green shadow-xs overflow-x-auto",

  // Tarjeta base para InfoRow (Email, Phone, Weight, Age, LastSeen)
  row: "flex flex-col justify-center gap-1 px-4 py-2.5 bg-white rounded-xl border border-fade-green shadow-2xs hover:border-nutrition-green/40 transition-all duration-200 min-w-fit shrink-0",

  // Etiqueta (LABEL)
  label:
    "text-[10px] font-bold uppercase tracking-wider text-text-muted select-none",

  // Valor principal
  value: "text-xs font-semibold text-text-body whitespace-nowrap",

  // Enlaces interactivos (Email, WhatsApp)
  link: "text-xs font-semibold text-nutrition-blue hover:text-nutrition-green transition-colors duration-200 underline decoration-nutrition-blue/30 hover:decoration-nutrition-green",

  // Tarjeta especial para Goal (ahora integrada en la misma línea visual)
  card: "flex flex-col justify-between gap-1 p-2.5 bg-white rounded-xl border border-fade-green shadow-2xs focus-within:border-nutrition-green/60 transition-all duration-200 flex-1 min-w-[220px]",

  cardTitle:
    "text-[10px] font-bold uppercase tracking-wider text-text-muted select-none",

  // Textarea ajustado a una línea expansible limpia
  input:
    "w-full h-7 px-2 py-1 text-xs text-text-body bg-gray-blue-50/60 border border-gray-blue-200/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-nutrition-green focus:bg-white placeholder:text-gray-blue-400/70 resize-none transition-all duration-200",
} as const;
