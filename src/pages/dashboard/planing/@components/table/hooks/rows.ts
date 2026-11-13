import { useMemo } from "react";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { MealRowInfo, RowInfo, TrainingHcRowInfo } from "../types";
import { useFetchPlaningMealsForDate } from "@src/services/tanstack/user/meals";
import { useTranslation } from "react-i18next";
import { useFetchMacrosForDateRange } from "@src/services/tanstack/user/macros";
import { useFetchMyDocuments } from "@src/services/tanstack/data/documents";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useRaceTotalsByDate } from "@src/services/tanstack/user/races";
import { setSelectedDay } from "@src/store/slices/config/store";
import type { TableRowKey } from "@src/store/slices/config/store";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

const MIN_TRAINING_HC_ROWS = 2;

const useTableRows = () => {
  const { t } = useTranslation();
  const planingQuery = useFetchPlanning();
  const mealsQuery = useFetchMeals();
  const userMeals = useFetchPlaningMealsForDate();
  const dayMacros = useFetchMacrosForDateRange();
  const documents = useFetchMyDocuments().data;
  // HC y kcal tomados en carreras por fecha
  const { totalsByDate: raceTotalsByDate } = useRaceTotalsByDate();
  const dispatch = useAppDispatch();
  const { navigateTo } = useAppNavigation();

  const createMealRows = useMemo(() => {
    if (!mealsQuery.data) return [];
    const userMealsMap = new Map<
      number,
      {
        namesMap: Map<string, string>;
        fixedRecipes: Map<string, string>;
        recipeComments: Map<string, string>;
        kcalByDate: Map<string, number>;
      }
    >();

    userMeals.data?.forEach((scheduledMeal) => {

      const date = scheduledMeal.date ?? "";
      const name = String(scheduledMeal.recipe_type?.name ?? "");
      const kcal = Number(scheduledMeal.recipe_type?.kcal ?? 0);

      let entry = userMealsMap.get(scheduledMeal.meal_id);

      if (!entry) {
        entry = {
          namesMap: new Map<string, string>(),
          fixedRecipes: new Map<string, string>(),
          recipeComments: new Map<string, string>(),
          kcalByDate: new Map<string, number>(),
        };
        userMealsMap.set(scheduledMeal.meal_id, entry);
      }

      entry.namesMap.set(date, name);
      if (scheduledMeal.is_fixed_recipe) {
        entry.fixedRecipes.set(date, String(scheduledMeal.fixed_recipe?.name ?? ""));
      }
      if (scheduledMeal.recipe_comment) {
        entry.recipeComments.set(date, scheduledMeal.recipe_comment);
      }
      entry.kcalByDate.set(date, kcal);
    });

    return mealsQuery.data.map((meal) => {
      const mealData = userMealsMap.get(meal.id);

      return new MealRowInfo(
        meal.id,
        mealData?.kcalByDate ?? new Map(),
        mealData?.fixedRecipes,
        mealData?.recipeComments,
      )
        .addLabel(String(meal.name))
        .addMap(mealData?.namesMap ?? new Map());
    });
  }, [userMeals.data, mealsQuery.data]);

  const createTrainingHcRows = useMemo(() => {
    const lengths =
      planingQuery.data?.map((el) => el.training_hc?.length ?? 0) ?? [];
    // Siempre una fila vacía extra para seguir añadiendo horas, con un mínimo de 2 filas
    const maxHcLength = Math.max(
      MIN_TRAINING_HC_ROWS,
      Math.max(0, ...lengths) + 1,
    );

    // Array completo de cada día, para que al editar una hora se conserven las demás
    const hcByDate = new Map(
      planingQuery.data?.map((day) => [day.date, day.training_hc ?? []]) ?? [],
    );

    return Array.from({ length: maxHcLength }, (_, index) =>
      new TrainingHcRowInfo(index, hcByDate)
        .addLabel(`${index + 1} H`)
        .addMap(
          planingQuery.data?.map((hc) => [
            hc.date,
            hc.training_hc?.[index]?.toString() ?? "",
          ]) ?? [],
        ),
    );
  }, [planingQuery.data]);

  const createTrainingKcal = useMemo(() => {
    return new RowInfo({
      id: "INPUT_TRAINING_KCAL",
      isEditable: "numeric",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.trainingKcalHeader"))
      .addMap(
        planingQuery.data?.map((planing) => [
          planing.date,
          planing.training_kcal?.toString() ?? "0",
        ]) ?? [],
      );
  }, [planingQuery.data, t]);

  const createRacesRow = useMemo(() => {
    return new RowInfo({
      id: "INPUT_RACES",
      isEditable: "action",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.racesRow"))
      .addMap(
        Array.from(raceTotalsByDate, ([date, { kcal }]) => [
          date,
          Math.round(kcal),
        ]),
      )
      // La página races muestra las carreras de selectedDay: se fija el día pulsado
      .addAction((date) => {
        dispatch(setSelectedDay(date.save()));
        navigateTo(APP_ROUTES.RACES);
      });
  }, [raceTotalsByDate, t, dispatch, navigateTo]);

  // Kcal y macros de cada día los calcula la RPC calculate_macros_for_date_range
  const macrosByDate = useMemo(
    () => new Map(dayMacros.data?.map((day) => [day.date, day]) ?? []),
    [dayMacros.data],
  );

  const createEnergyBalance = useMemo(() => {
    // Solo los días con algo que sumar o restar (BMR, ingesta o gasto)
    const days = Array.from(macrosByDate.values()).filter(
      (day) => day.bmr_kcal || day.total_intake_kcal || day.total_burnt_kcal,
    );

    // Fila de solo lectura con el valor diario en kcal y la suma semanal
    const kcalRow = (
      id:
        | "DISPLAY_INTAKE_KCAL"
        | "DISPLAY_BURNT_KCAL"
        | "DISPLAY_ENERGY_BALANCE",
      label: string,
      kcal: (day: (typeof days)[number]) => number,
    ) => {
      const total = days.reduce((acc, day) => acc + kcal(day), 0);
      return new RowInfo({ id, isFullWidth: false })
        .addLabel(t(label))
        .addMap(days.map((day) => [day.date, `${Math.round(kcal(day))} Kcal`]))
        .addResume(`${total.toFixed(0)} Kcal`);
    };

    return {
      intakeRow: kcalRow(
        "DISPLAY_INTAKE_KCAL",
        "data:dashboardTable.intakeKcalRow",
        (day) => day.total_intake_kcal,
      ),
      burntRow: kcalRow(
        "DISPLAY_BURNT_KCAL",
        "data:dashboardTable.burntKcalRow",
        (day) => day.total_burnt_kcal,
      ),
      balanceRow: kcalRow(
        "DISPLAY_ENERGY_BALANCE",
        "data:dashboardTable.energyBalanceResume",
        (day) => day.final_kcal_balance,
      ),
    };
  }, [macrosByDate, t]);

  const createUserMacros = useMemo(() => {
    // Solo los días en los que se ha comido algo (comidas, entreno o carreras)
    const days = Array.from(macrosByDate.values()).filter(
      (day) =>
        day.total_eating_hc_per_kg ||
        day.total_eating_prot_per_kg ||
        day.total_eating_fat_per_kg,
    );
    const daysCount = days.length || 1;

    const macroRow = (
      id: "DISPLAY_CARBS_PER_KG" | "DISPLAY_PROTEIN_PER_KG" | "DISPLAY_FAT_PER_KG",
      label: string,
      perKg: (day: (typeof days)[number]) => number,
    ) => {
      const avg = days.reduce((acc, day) => acc + perKg(day), 0) / daysCount;
      return new RowInfo({ id, isFullWidth: false })
        .addLabel(t(label))
        .addMap(days.map((day) => [day.date, `${perKg(day).toFixed(1)} g/kg`]))
        .addResume(`${avg.toFixed(1)} g/kg`);
    };

    return {
      carbsRow: macroRow(
        "DISPLAY_CARBS_PER_KG",
        "data:dashboardTable.dailyMacros.carbsPerkg",
        (day) => day.total_eating_hc_per_kg,
      ),
      proteinRow: macroRow(
        "DISPLAY_PROTEIN_PER_KG",
        "data:dashboardTable.dailyMacros.proteinPerkg",
        (day) => day.total_eating_prot_per_kg,
      ),
      fatRow: macroRow(
        "DISPLAY_FAT_PER_KG",
        "data:dashboardTable.dailyMacros.fatsPerkg",
        (day) => day.total_eating_fat_per_kg,
      ),
    };
  }, [macrosByDate, t]);

  const createCommentsRow = useMemo(() => {
    return new RowInfo({
      id: "INPUT_COMMENTS",
      isEditable: "text",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.commentsRows.rowHeader"))
      .addMap(
        planingQuery.data?.map((planing) => [
          planing.date,
          planing.comment ?? "", // Cambia 'comment' por el nombre exacto de la propiedad en tu backend
        ]) ?? [],
      );
  }, [planingQuery.data, t]);

  const createEventsRow = useMemo(() => {
    return new RowInfo({
      id: "INPUT_EVENTS",
      isEditable: "text",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.eventsRow.header"))
      .addMap(
        planingQuery.data?.map((planing) => [
          planing.date,
          planing.event ?? "",
        ]) ?? [],
      );
  }, [planingQuery.data, t]);

  const createCustomUrlRow = useMemo(() => {
    return new RowInfo({
      id: "INPUT_CUSTOM_URL",
      isEditable: "text",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.customUrlRow.header"))
      .addMap(
        planingQuery.data?.map((planing) => [
          planing.date,
          planing.custom_url ?? "",
        ]) ?? [],
      );
  }, [planingQuery.data, t]);

  // Valor de la celda: el id del documento; la celda busca su nombre en useFetchMyDocuments
  const createDocumentRow = useMemo(() => {
    return new RowInfo({
      id: "INPUT_DOCUMENT",
      isEditable: "document",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.documentRow.header"))
      .addMap(
        planingQuery.data?.map((planing) => [
          planing.date,
          planing.document_id ?? "",
        ]) ?? [],
      )
      // Como la celda: un documento que no está en la lista (de un nutricionista anterior) sale como "otro"
      .addDisplayFormat(
        (id) =>
          documents?.find((doc) => doc.id === id)?.name ??
          t("data:dashboardTable.documentRow.other"),
      );
  }, [planingQuery.data, documents, t]);

  const rowsVisibility = useAppSelector(
    (state) => state.config.showRowsInTable,
  );

  const rows = useMemo<RowInfo[]>(() => {
    const { carbsRow, proteinRow, fatRow } = createUserMacros;
    const { intakeRow, burntRow, balanceRow } = createEnergyBalance;
    // Solo las filas que el nutricionista no ha ocultado en la configuración
    const visible = (
      entries: [TableRowKey, RowInfo | RowInfo[]][],
    ): RowInfo[] =>
      entries.flatMap(([key, row]) => (rowsVisibility[key] ? row : []));
    // La cabecera de una sección solo se muestra si queda alguna fila visible
    const section = (header: RowInfo, sectionRows: RowInfo[]) =>
      sectionRows.length ? [header, ...sectionRows] : [];

    return [
      ...visible([
        [
          "presets",
          new RowInfo({
            id: "INPUT_PRESET",
            isEditable: "presets",
            isFullWidth: false,
          }).addLabel(t("data:dashboardTable.navigation.presets")),
        ],
        [
          "autoGenerate",
          new RowInfo({
            id: "INPUT_AUTO_GENERATE",
            isEditable: "action",
            isFullWidth: false,
          }).addLabel(t("data:dashboardTable.autoGenerate.header")),
        ],
      ]),
      ...createMealRows,
      ...section(
        new RowInfo({
          id: "HEADER_TRAINING",
          isFullWidth: true,
        }).addLabel(t("data:dashboardTable.hcHeader")),
        visible([
          ["trainingKcal", createTrainingKcal],
          ["trainingHc", createTrainingHcRows],
          ["races", createRacesRow],
        ]),
      ),
      ...section(
        new RowInfo({
          id: "HEADER_ENERGY_BALANCE",
          isFullWidth: true,
        }).addLabel(t("data:dashboardTable.energyBalanceHeader")),
        visible([
          ["intakeKcal", intakeRow],
          ["burntKcal", burntRow],
          ["energyBalance", balanceRow],
        ]),
      ),
      ...section(
        new RowInfo({
          id: "HEADER_DAILY_MACROS",
          isFullWidth: true,
        }).addLabel(t("data:dashboardTable.dailyMacros.header")),
        visible([
          ["carbsPerKg", carbsRow],
          ["proteinPerKg", proteinRow],
          ["fatPerKg", fatRow],
        ]),
      ),
      ...section(
        new RowInfo({
          id: "HEADER_COMMENTS",
          isFullWidth: true,
        }).addLabel(t("data:dashboardTable.commentsRows.header")),
        visible([
          ["comments", createCommentsRow],
          ["events", createEventsRow],
          ["links", createCustomUrlRow],
          ["documents", createDocumentRow],
        ]),
      ),
    ];
  }, [
    createMealRows,
    createTrainingHcRows,
    createTrainingKcal,
    createRacesRow,
    createEnergyBalance,
    createUserMacros,
    createCommentsRow,
    createEventsRow,
    createCustomUrlRow,
    createDocumentRow,
    rowsVisibility,
    t,
  ]);

  return {
    rows,
  };
};

export default useTableRows;
