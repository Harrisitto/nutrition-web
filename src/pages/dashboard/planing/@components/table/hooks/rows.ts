import { useMemo } from "react";
import { useFetchPlanning } from "@src/services/tanstack/user/planing";
import { useFetchMeals } from "@src/services/tanstack/data/meals";
import { MealRowInfo, RowInfo, TrainingHcRowInfo } from "../types";
import { useFetchPlaningMealsForDate } from "@src/services/tanstack/user/meals";
import { useTranslation } from "react-i18next";
import {
  useFetchBmr,
  useFetchUserWeightForDateRange,
} from "@src/services/tanstack/user/info";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import FromDate from "@src/helpers/dates";
import { dayBalanceWithoutMeals } from "@src/helpers/nutrition";
import { useRaceTotalsByDate } from "@src/services/tanstack/user/races";
import { setSelectedDay } from "@src/store/slices/config/store";
import useAppNavigation from "@src/hooks/navigation";
import { APP_ROUTES } from "@src/hooks/navigation/routes";

const MIN_TRAINING_HC_ROWS = 2;

const useTableRows = () => {
  const { t } = useTranslation();
  const planingQuery = useFetchPlanning();
  const mealsQuery = useFetchMeals();
  const userMeals = useFetchPlaningMealsForDate();
  const bmr = useFetchBmr();
  const savedDate = useAppSelector((state) => state.config.selectedDay);
  const monday = useMemo(
    () => new FromDate(savedDate).thisMonday(),
    [savedDate],
  );
  const userWeight = useFetchUserWeightForDateRange();
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
        totalKcal: number;
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
          totalKcal: 0,
        };
        userMealsMap.set(scheduledMeal.meal_id, entry);
      }

      entry.namesMap.set(date, name);
      entry.totalKcal += kcal;
    });

    return mealsQuery.data.map((meal) => {
      const mealData = userMealsMap.get(meal.id);

      return new MealRowInfo(meal.id, mealData?.totalKcal ?? 0)
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

  const createEnergyBalance = useMemo(() => {
    // Suma de Kcal provenientes de las comidas
    const mealKcalByDate = new Map<string, number>();
    userMeals.data?.forEach((scheduledMeal) => {
      const date = scheduledMeal.date;
      if (!date) return;
      const mealKcal = scheduledMeal.recipe_type?.kcal ?? 0;
      mealKcalByDate.set(date, (mealKcalByDate.get(date) ?? 0) + mealKcal);
    });

    const planningByDate = new Map(
      planingQuery.data?.map((scheduledPlan) => [
        scheduledPlan.date,
        scheduledPlan,
      ]),
    );
    const bmrKcal = typeof bmr.data === "number" ? bmr.data : null;

    // Días con algún dato y, si hay metabolismo basal (BMR), todos los de la semana
    const dates = new Set([
      ...mealKcalByDate.keys(),
      ...planningByDate.keys(),
      ...raceTotalsByDate.keys(),
      ...(bmrKcal === null
        ? []
        : Array.from({ length: 7 }, (_, index) =>
            monday.incrementDay(index).save(),
          )),
    ]);

    // Comidas + entrenamiento neto + carreras − BMR (misma cuenta que el autogenerado)
    const kcalMap = new Map(
      Array.from(dates, (date) => [
        date,
        (mealKcalByDate.get(date) ?? 0) +
          dayBalanceWithoutMeals({
            planning: planningByDate.get(date),
            raceKcal: raceTotalsByDate.get(date)?.kcal ?? 0,
            bmr: bmrKcal ?? 0,
          }),
      ]),
    );

    const totalBalance = Array.from(kcalMap.values()).reduce(
      (acc, kcal) => acc + kcal,
      0,
    );

    const stringifiedMap = new Map<string, string>(
      Array.from(kcalMap.entries()).map(([date, kcal]) => [
        date,
        `${Math.round(kcal)} Kcal`,
      ]),
    );

    return new RowInfo({
      id: "DISPLAY_ENERGY_BALANCE",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.energyBalanceResume"))
      .addMap(stringifiedMap)
      .addResume(totalBalance.toFixed(0) + " Kcal");
  }, [userMeals.data, planingQuery.data, raceTotalsByDate, bmr.data, monday, t]);

  const createUserMacros = useMemo(() => {
    const macrosMap = new Map<
      string,
      { hc: number; prot: number; fat: number }
    >();

    userMeals.data?.forEach((scheduledMeal) => {
      const { hc = 0, fat = 0, prot = 0 } = scheduledMeal.recipe_type || {};
      const key = scheduledMeal.date ?? "";
      if (!key) return;
      const saved = macrosMap.get(key) ?? { hc: 0, prot: 0, fat: 0 };
      macrosMap.set(key, {
        hc: saved.hc + hc,
        fat: saved.fat + fat,
        prot: saved.prot + prot,
      });
    });

    planingQuery.data?.forEach((scheduledPlan) => {
      const totalHc = (scheduledPlan.training_hc ?? []).reduce(
        (acc, hc) => acc + (hc || 0),
        0,
      );
      const key = scheduledPlan.date;
      if (!key) return;
      const saved = macrosMap.get(key) ?? { hc: 0, prot: 0, fat: 0 };
      macrosMap.set(key, {
        hc: saved.hc + totalHc,
        prot: saved.prot,
        fat: saved.fat,
      });
    });

    // HC tomados durante las carreras
    raceTotalsByDate.forEach(({ hc }, date) => {
      const saved = macrosMap.get(date) ?? { hc: 0, prot: 0, fat: 0 };
      macrosMap.set(date, { ...saved, hc: saved.hc + hc });
    });

    const safeWeight = userWeight.data || 1;

    const hcMap = new Map<string, string>();
    const protMap = new Map<string, string>();
    const fatMap = new Map<string, string>();

    let totalHcPerKg = 0;
    let totalProtPerKg = 0;
    let totalFatPerKg = 0;
    const entries = Array.from(macrosMap.entries());

    entries.forEach(([date, values]) => {
      const hcPerKg = values.hc / safeWeight;
      const protPerKg = values.prot / safeWeight;
      const fatPerKg = values.fat / safeWeight;

      hcMap.set(date, `${hcPerKg.toFixed(1)} g/kg`);
      protMap.set(date, `${protPerKg.toFixed(1)} g/kg`);
      fatMap.set(date, `${fatPerKg.toFixed(1)} g/kg`);

      totalHcPerKg += hcPerKg;
      totalProtPerKg += protPerKg;
      totalFatPerKg += fatPerKg;
    });

    const daysCount = entries.length || 1;
    const avgHc = (totalHcPerKg / daysCount).toFixed(1);
    const avgProt = (totalProtPerKg / daysCount).toFixed(1);
    const avgFat = (totalFatPerKg / daysCount).toFixed(1);

    const carbsRow = new RowInfo({
      id: "DISPLAY_CARBS_PER_KG",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.dailyMacros.carbsPerkg"))
      .addMap(hcMap)
      .addResume(`${avgHc} g/kg`);

    const proteinRow = new RowInfo({
      id: "DISPLAY_PROTEIN_PER_KG",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.dailyMacros.proteinPerkg"))
      .addMap(protMap)
      .addResume(`${avgProt} g/kg`);

    const fatRow = new RowInfo({
      id: "DISPLAY_FAT_PER_KG",
      isFullWidth: false,
    })
      .addLabel(t("data:dashboardTable.dailyMacros.fatsPerkg"))
      .addMap(fatMap)
      .addResume(`${avgFat} g/kg`);

    return { carbsRow, proteinRow, fatRow };
  }, [userMeals.data, planingQuery.data, raceTotalsByDate, userWeight.data, t]);

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

  const rows = useMemo<RowInfo[]>(() => {
    const { carbsRow, proteinRow, fatRow } = createUserMacros;

    return [
      new RowInfo({
        id: "INPUT_PRESET",
        isEditable: "presets",
        isFullWidth: false,
      }).addLabel(t("data:dashboardTable.navigation.presets")),
      new RowInfo({
        id: "INPUT_AUTO_GENERATE",
        isEditable: "action",
        isFullWidth: false,
      }).addLabel(t("data:dashboardTable.autoGenerate.header")),
      ...createMealRows,
      new RowInfo({
        id: "HEADER_TRAINING",
        isFullWidth: true,
      }).addLabel(t("data:dashboardTable.hcHeader")),
      createTrainingKcal,
      ...createTrainingHcRows,
      createRacesRow,
      new RowInfo({
        id: "HEADER_ENERGY_BALANCE",
        isFullWidth: true,
      }).addLabel(t("data:dashboardTable.energyBalanceHeader")),
      createEnergyBalance,
      new RowInfo({
        id: "HEADER_DAILY_MACROS",
        isFullWidth: true,
      }).addLabel(t("data:dashboardTable.dailyMacros.header")),
      carbsRow,
      proteinRow,
      fatRow,
      new RowInfo({
        id: "HEADER_COMMENTS",
        isFullWidth: true,
      }).addLabel(t("data:dashboardTable.commentsRows.header")),
      createCommentsRow,
      createEventsRow,
      createCustomUrlRow,
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
    t,
  ]);

  return {
    rows,
  };
};

export default useTableRows;
