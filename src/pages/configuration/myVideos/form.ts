import useForm from "@src/hooks/form";
import {
  ValidateIsUrl,
  ValidateMaxLength,
  ValidateStringRequired,
  ValidateYoutubeUrl,
} from "@src/hooks/form/service/validate";
import { getYoutubeThumbnail } from "@src/helpers/youtube";
import type { InputState } from "@src/hooks/form/types";

export const fieldIds = {
  name: "name",
  url: "url",
  description: "description",
} as const;

// Static config: useForm recreates the Form instance whenever config changes
const config = [
  {
    id: fieldIds.name,
    type: "text",
    currentValue: "",
    validation: [
      (value) => ValidateStringRequired(value as string),
      (value) => ValidateMaxLength(value as string, 120),
    ],
    inputProps: {
      label: "forms:myVideos.fields.name", // text inputs translate their label
      placeholder: "...",
    },
  } as InputState<"text">,
  {
    id: fieldIds.url,
    type: "text",
    currentValue: "",
    validation: [
      (value) => ValidateStringRequired(value as string),
      (value) => ValidateIsUrl(value as string),
      (value) => ValidateYoutubeUrl(value as string),
    ],
    inputProps: {
      label: "forms:myVideos.fields.url",
      placeholder: "https://www.youtube.com/watch?v=...",
    },
  } as InputState<"text">,
  {
    id: fieldIds.description,
    type: "textarea",
    currentValue: "",
    validation: [(value) => ValidateMaxLength(value as string, 500)],
    inputProps: {
      label: "forms:myVideos.fields.description",
      placeholder: "...",
    },
  } as InputState<"textarea">,
] as InputState<"text" | "textarea">[];

// Module level so useForm doesn't re-register the updater on every render
const calculateDerivedState = (state: Record<string, unknown>) => ({
  thumbnail: getYoutubeThumbnail(state[fieldIds.url] as string),
});

export const useNewVideoForm = () => {
  return useForm({ config, calculateDerivedState });
};
