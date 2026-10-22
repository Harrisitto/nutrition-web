import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationPages } from "../@components/title";
import { useNewAppointmentForm } from "./newAppointment/form";
import { useNewPointForm } from "./newPoint/form";
import { ListAppointmentThemes } from "./listAppointment";
import { ListPointsFrom } from "./listPoints";
import { PointsTimeline } from "./listPoints/timeline";
import { BtnInsertAppointment } from "./newAppointment/insert";
import { BtnInsertAppointmentPoint } from "./newPoint/insert";
import { useFitToScrollParent } from "./useFitToScrollParent";


export default function PageAppointmentThemes() {
  const { t } = useTranslation();
  const appointmentForm = useNewAppointmentForm();
  const pointForm = useNewPointForm();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const rowHeight = useFitToScrollParent(rowRef);

  return (
    <ConfigurationPages
        title={t("data:configuration.sections.appointmentThemes.title")}
        description={t("data:configuration.sections.appointmentThemes.description")}
    >
        {/* fixed to the remaining screen height: the page does not scroll, only the lists do */}
        <div ref={rowRef} style={{ height: rowHeight }} className="flex w-full gap-6">
        <PointsTimeline themeId={selectedThemeId} />
        <div
            className="
            grid min-w-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)] gap-4
            transition-[grid-template-columns] duration-300
            "
        >
            {/* columna 1 */}
            <div className="flex min-h-0 flex-col">
                <div className="mb-4 text-lg font-semibold">
                    {t("data:configuration.sections.appointmentThemes.forms.appointment.title")}
                </div>
                {/* icons to the right of the inputs, mb-4 matches the margin of each field */}
                <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">{appointmentForm.Fields}</div>
                    <div className="mb-4">
                        <BtnInsertAppointment form={appointmentForm.form} />
                    </div>
                </div>
                <ListAppointmentThemes
                    selectedId={selectedThemeId}
                    onSelect={setSelectedThemeId}
                />
            </div>
            {/* columna 2 */}
            <div className="flex min-h-0 flex-col">
                {selectedThemeId === null ? (
                    <div className="text-gray-500">
                        {t("data:configuration.sections.appointmentThemes.selectTheme")}
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-lg font-semibold">
                            {t("data:configuration.sections.appointmentThemes.forms.point.title")}
                        </div>
                        <div className="flex items-end gap-2">
                            <div className="min-w-0 flex-1">{pointForm.Fields}</div>
                            <div className="mb-4">
                                <BtnInsertAppointmentPoint
                                    form={pointForm.form}
                                    theme_id={selectedThemeId}
                                />
                            </div>
                        </div>
                        <ListPointsFrom themeId={selectedThemeId} />
                    </>
                )}
            </div>
        </div>
        </div>
    </ConfigurationPages>
    );
};
