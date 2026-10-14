import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw } from "lucide-react";
import { useAppSelector } from "@src/store/store";
import { SectionLoading } from "@src/components/global/Animations";
import {
  removeUnusedGpx,
  useFetchRacePlan,
  type RacePlanDraft,
} from "@src/services/tanstack/user/races";
import { RaceDraftContext, type DraftUpdate } from "./raceDraftContext";
import { validateRaceDraft } from "../validation";
import type { RaceStep } from "../constants";
import { secondaryButtonStyle, sectionStyle } from "../components/formStyles";

const emptyDraft = (raceDate: string, userId: string): RacePlanDraft => ({
  id: null,
  userId,
  name: "",
  raceDate,
  distanceKm: null,
  gpxPath: null,
  steps: [],
  ingredients: [],
  landmarks: [],
});

const DraftState = ({
  initialDraft,
  children,
}: {
  initialDraft: RacePlanDraft;
  children: ReactNode;
}) => {
  const [draft, setDraft] = useState(initialDraft);
  const [pendingSteps, setPendingSteps] = useState<RaceStep[]>([]);
  // Gpx que usa la carrera en la base de datos y los subidos en esta edición sin guardar
  const savedGpx = useRef(initialDraft.gpxPath);
  const uploadedGpx = useRef(new Set<string>());

  useEffect(() => {
    const uploads = uploadedGpx.current;
    // Al salir sin guardar, ninguna carrera usa los gpx subidos
    return () => {
      void removeUnusedGpx([...uploads]);
    };
  }, []);

  const updateDraft = useCallback(
    (update: DraftUpdate) =>
      setDraft((prev) => ({
        ...prev,
        ...(typeof update === "function" ? update(prev) : update),
      })),
    [],
  );

  const setPendingForm = useCallback(
    (step: RaceStep, isPending: boolean) =>
      setPendingSteps((prev) => {
        if (prev.includes(step) === isPending) return prev;
        return isPending ? [...prev, step] : prev.filter((s) => s !== step);
      }),
    [],
  );

  const addUploadedGpx = useCallback((path: string) => {
    uploadedGpx.current.add(path);
  }, []);

  const onDraftSaved = useCallback((saved: RacePlanDraft) => {
    const replaced = [...uploadedGpx.current, savedGpx.current ?? ""].filter(
      (path) => path && path !== saved.gpxPath,
    );
    uploadedGpx.current.clear();
    savedGpx.current = saved.gpxPath;
    void removeUnusedGpx(replaced);
  }, []);

  const issues = useMemo(() => validateRaceDraft(draft), [draft]);

  const value = useMemo(
    () => ({
      draft,
      updateDraft,
      issues,
      pendingSteps,
      setPendingForm,
      addUploadedGpx,
      onDraftSaved,
    }),
    [draft, updateDraft, issues, pendingSteps, setPendingForm, addUploadedGpx, onDraftSaved],
  );

  return (
    <RaceDraftContext.Provider value={value}>
      {children}
    </RaceDraftContext.Provider>
  );
};

/**
 * Borrador de la carrera compartido por los tres pasos. Se inicializa con la
 * carrera raceId (o una vacía en selectedDay para el cliente seleccionado) y
 * solo se guarda al final con save_race_plan.
 */
export const RaceDraftProvider = ({
  raceId,
  children,
}: {
  raceId: number | null;
  children: ReactNode;
}) => {
  const { t } = useTranslation();
  const selectedDay = useAppSelector((state) => state.config.selectedDay);
  const selectedUserId = useAppSelector((state) => state.config.selectedUserId);
  const raceQuery = useFetchRacePlan(raceId);

  // Sin los datos de la carrera no se monta el borrador: guardarlo vacío crearía otra carrera
  if (raceId !== null && !raceQuery.data) {
    if (!raceQuery.isError || raceQuery.isFetching) return <SectionLoading />;

    return (
      <section className={`${sectionStyle} items-center text-center`}>
        <p className="text-sm text-red-500">{t("data:races.loadError")}</p>
        <button
          type="button"
          className={secondaryButtonStyle}
          onClick={() => raceQuery.refetch()}
        >
          <RotateCcw size={16} />
          {t("data:races.retry")}
        </button>
      </section>
    );
  }

  return (
    <DraftState
      initialDraft={raceQuery.data ?? emptyDraft(selectedDay, selectedUserId ?? "")}
    >
      {children}
    </DraftState>
  );
};
