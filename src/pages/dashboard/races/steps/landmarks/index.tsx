import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetchRaceLandmarkOptions } from "@src/services/tanstack/data/raceLandmarks";
import { useRaceDraft } from "../../context/raceDraftContext";
import { StepSection } from "../../components/stepSection";
import { KmItemList } from "../../components/kmItemList";
import { useItemError } from "../../hooks";
import { AddLandmarkForm } from "./addLandmarkForm";

export const StepLandmarks = () => {
  const { t } = useTranslation();
  const { draft, updateDraft } = useRaceDraft();
  const { data: options } = useFetchRaceLandmarkOptions();
  const errorOf = useItemError("landmarks");

  const optionsById = useMemo(
    () => new Map(options?.map((option) => [option.id, option])),
    [options],
  );

  const onRemove = (index: number) =>
    updateDraft((prev) => ({
      landmarks: prev.landmarks.filter((_, i) => i !== index),
    }));

  return (
    <StepSection step="landmarks">
      <AddLandmarkForm options={options ?? []} />
      <KmItemList
        items={draft.landmarks}
        emptyText={t("data:races.landmarks.empty")}
        removeLabel={t("data:races.landmarks.remove")}
        onRemove={onRemove}
        errorOf={errorOf}
        renderItem={(landmark) => {
          const option = optionsById.get(landmark.landmark_id);
          return (
            <>
              {option?.url && (
                <img alt="" src={option.url} className="h-6 w-6 shrink-0" />
              )}
              <span className="min-w-0 flex-1 truncate text-text-title">
                {landmark.name || option?.name}
                {landmark.name && option?.name && (
                  <span className="ml-2 text-xs text-text-muted">{option.name}</span>
                )}
              </span>
            </>
          );
        }}
      />
    </StepSection>
  );
};
