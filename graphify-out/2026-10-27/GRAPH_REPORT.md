# Graph Report - nutrition-web  (2026-10-27)

## Corpus Check
- 315 files · ~131,020 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1568 nodes · 4796 edges · 86 communities (69 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dec8c9c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- macrosResume.tsx
- noClientsScreen/index.tsx
- gpx.ts
- store/store.ts
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- columns.tsx
- dashboard/planing/index.tsx
- config.ts
- useAppDispatch
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- preset.ts
- App TS Config
- dates.ts
- profile.ts
- poster/constants.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- config/store.ts
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- renderCommandGroup.tsx
- lucide-react
- vite.config.ts
- form/components/stepSection.tsx
- newPoint/form.ts
- layout.ts
- profileChart.tsx
- user/appointments.ts
- Form
- planing.ts
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- races/index.tsx
- Invite Client Flow
- RowInfo
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- useRaceDraft
- External Navigation Helpers
- App Store Compliance Docs
- Clone Week Migration
- Recommend Recipe Migration
- Clone Week User Migration
- Subscription Check SQL
- Ingredient Macro Notices
- React Logo Asset
- i18n Namespaces
- EZ FOOD Logo
- Info Landing Page
- Expo Folder
- useGetAuthSession
- new.tsx
- posterPreview.tsx
- components.tsx
- races.ts
- addNoteForm.tsx
- measures.ts
- dashboard/index.tsx
- queryKeys
- notification/hook.ts
- useLanguageCode
- stepsTable.tsx
- raceIngredients.ts
- assignTheme.tsx
- Form
- FromDate
- input/index.ts
- rows.ts
- error/store.ts
- error/hook.ts
- configAppointment.ts

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 113 edges
2. `useAppSelector` - 112 edges
3. `FromDate` - 111 edges
4. `react` - 110 edges
5. `queryKeys()` - 95 edges
6. `lucide-react` - 53 edges
7. `useLanguageCode()` - 45 edges
8. `useGetAuthSession()` - 41 edges
9. `useAppNavigation()` - 37 edges
10. `useNotification()` - 35 edges

## Surprising Connections (you probably didn't know these)
- `Stripe-Supabase Integration Deployment Guide` --conceptually_related_to--> `Generate Supabase Types Workflow`  [INFERRED]
  supabase/solution/README.md → .github/workflows/supabase-types.yml
- `Generate Supabase Types Workflow` --references--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  .github/workflows/supabase-types.yml → supabase/solution/README.md
- `Tiered Seat Pricing (Stripe price, quantity = clients)` --conceptually_related_to--> `Nutritionist Access to Client Data`  [INFERRED]
  supabase/solution/README.md → public/privacyPolicy/langEn.txt
- `Supabase Data Storage in France (GDPR)` --conceptually_related_to--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  public/privacyPolicy/langEn.txt → supabase/solution/README.md
- `Image Content-Security-Policy (ezfood.fit, Supabase storage)` --references--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  index.html → supabase/solution/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Calendar week drag-and-drop clone components** — src_pages_dashboard_planing__components_calendar__components_weekrow_readme_calendarview, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_draggableweekrow, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_weekrowvisual, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_daycell, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_dnd_kit_core [EXTRACTED 1.00]
- **Stripe subscription and seat billing flow** — supabase_solution_readme_create_stripe_checkout, supabase_solution_readme_create_stripe_portal, supabase_solution_readme_update_stripe_amount, supabase_solution_readme_seats_trigger, supabase_solution_readme_has_active_subscription [EXTRACTED 1.00]
- **WeeklyMeals cell + modal editor pattern** — src_pages_dashboard_planing_components_table_hooks_columns, src_pages_dashboard_planing__components_table_readme_cellpresetday, src_pages_dashboard_planing__components_table_readme_cellmeal, src_pages_dashboard_planing__components_table_readme_cellnumeric, src_pages_dashboard_planing__components_table_readme_celltext, src_pages_dashboard_planing__components_table_readme_portal [EXTRACTED 1.00]
- **Training load drives weekly meal levels, energy balance and macros** — src_assets_screenshots_screenshot_web_dashboard_carbs_per_training_hour, src_assets_screenshots_screenshot_web_dashboard_meal_codes, src_assets_screenshots_screenshot_web_dashboard_energy_balance, src_assets_screenshots_screenshot_web_dashboard_daily_macronutrients [INFERRED 0.75]
- **Client Daily Plan View (day selection drives comment, meals, training)** — src_assets_screenshots_app_calendar_weekly_day_selector, src_assets_screenshots_app_calendar_client_daily_comment, src_assets_screenshots_app_calendar_meal_card, src_assets_screenshots_app_calendar_training_session_section [INFERRED 0.85]
- **Bilingual (EN/ES) public legal and nutrition notices** — public_privacypolicy_langen_privacy_policy, public_privacypolicy_langes_politica_privacidad, public_references_recipeingredientsen_nutritional_info_notice, public_references_recipeingredientses_aviso_informacion_nutricional [INFERRED 0.85]
- **Dashboard onboarding gate flow (name, subscription, payment)** — src_pages_dashboard_readme_onboarding_gate, src_pages_dashboard__components_noclientsscreen_readme_nutritionist_name_prompt, src_pages_dashboard__components_paymentscreen_readme_payment_component, src_pages_dashboard__queries_readme_hassubscription, src_pages_dashboard__components_noclientsscreen_readme_all_nutritionist_table [INFERRED 0.85]
- **Measures page filter-visualize-edit flow** — src_assets_screenshots_screenshot_web_measures_date_range_filter, src_assets_screenshots_screenshot_web_measures_measure_time_series_chart, src_assets_screenshots_screenshot_web_measures_shown_measures_toggle_list, src_assets_screenshots_screenshot_web_measures_visible_measures_list, src_assets_screenshots_screenshot_web_measures_measure_entry_form [INFERRED 0.85]

## Communities (86 total, 17 thin omitted)

### Community 0 - "macrosResume.tsx"
Cohesion: 0.36
Nodes (6): Weight(), Resume(), CHART_COLORS, MacrosBarChart(), MacrosResume(), useFetchUserWeightForDateRange()

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "store/store.ts"
Cohesion: 0.17
Nodes (12): react-dom, react-redux, redux-persist, @tanstack/react-query-devtools, DisplayNotification(), getNotificationStyle(), AppDispatch, configPersistConfig (+4 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.10
Nodes (38): hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds (+30 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (34): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+26 more)

### Community 7 - "columns.tsx"
Cohesion: 0.13
Nodes (23): @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellMeal(), getKcalColorClass(), CellRace() (+15 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.27
Nodes (16): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), NavigateAppointments() (+8 more)

### Community 9 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 10 - "useAppDispatch"
Cohesion: 0.36
Nodes (7): DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), fetchMeals(), useFetchMeals(), useAppDispatch()

### Community 11 - "posterData.ts"
Cohesion: 0.21
Nodes (16): raceHc(), toSupportedLanguage(), altitudePoints(), buildChartData(), chartSpans(), resolveLandmarks(), useDraftChart(), IntakeCard() (+8 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (24): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+16 more)

### Community 15 - "preset.ts"
Cohesion: 0.29
Nodes (9): TABLE_USER_PRESET, TABLE_USER_PRESET_MEAL, Preset, removePresetFromList(), selectFromMeal(), updatePresetList(), useDeletePreset(), useFetchPresets() (+1 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.24
Nodes (11): @dnd-kit/core, DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps, PlaningType (+3 more)

### Community 18 - "profile.ts"
Cohesion: 0.14
Nodes (15): UserName(), TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_INVITATIONS (+7 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.10
Nodes (39): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP (+31 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.16
Nodes (21): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+13 more)

### Community 22 - "config/store.ts"
Cohesion: 0.22
Nodes (8): configSlice, ConfigState, defaultKeyboardCommands, initialState, KeyboardCategory, KeyboardCommandsState, mergeKeyboardCommands(), SetKeyboardCommandPayload

### Community 23 - "Billing, Privacy & Deploy Docs"
Cohesion: 0.13
Nodes (19): Generate Supabase Types Workflow, EzFood HTML Entry (index.html), Nutritionist Access to Client Data, Privacy Policy (English), Supabase Data Storage in France (GDPR), Politica de Privacidad (Spanish), GitHub Pages Deployment (harrisitto.github.io/nutrition-web), Nutrition Web App (README) (+11 more)

### Community 24 - "Node TS Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 25 - "Dev Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-refresh, gh-pages, globals, postcss (+12 more)

### Community 26 - "recipes.ts"
Cohesion: 0.06
Nodes (48): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, List(), placeholderRecipeImg, Recipes(), Recipes README (+40 more)

### Community 27 - "renderCommandGroup.tsx"
Cohesion: 0.25
Nodes (6): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps

### Community 28 - "lucide-react"
Cohesion: 0.18
Nodes (20): lucide-react, cardStyle, deleteButtonStyle, primaryButtonStyle, NEXT_STATUS, StatusButton(), StepNavigation(), Points (+12 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 30 - "form/components/stepSection.tsx"
Cohesion: 0.36
Nodes (5): StepSection(), APPOINTMENT_STEPS, AppointmentStep, StepDetails(), sectionStyle

### Community 31 - "newPoint/form.ts"
Cohesion: 0.20
Nodes (8): primaryIconButtonStyle, ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), fieldIds, useConfig()

### Community 33 - "layout.ts"
Cohesion: 0.08
Nodes (38): altitudeAt(), BOX_GAP, CARD_SIZES, HEADER_HEIGHT, MIN_POSTER_HEIGHT, PADDING_BOTTOM, PADDING_TOP, PILL_GAP (+30 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.12
Nodes (30): recharts, assignLanes(), ChartData, ChartLandmark, ChartPoint, ChartSpan, landmarkLanes(), LandmarkOption (+22 more)

### Community 35 - "user/appointments.ts"
Cohesion: 0.16
Nodes (30): StepProgress(), NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), FormAppointment(), PageFormAppointment(), saveErrorKey() (+22 more)

### Community 37 - "planing.ts"
Cohesion: 0.17
Nodes (17): CellPresetDay(), CellPresetDayProps, PresetDayEditor(), PresetDayEditorProps, PresetOption, highlightRingOnDarkStyle, fetchPlanningWeek(), orIlikeValue() (+9 more)

### Community 38 - "Subscription SQL View"
Cohesion: 0.25
Nodes (3): public.has_active_subscription(), public.nutri_payment, tr_sync_stripe_seats

### Community 39 - "Measures Screenshot"
Cohesion: 0.43
Nodes (8): Measures Page Screenshot (Medidas), Measures Date Range Filter (start/end date + range slider), /form-measure Route (Measures Page), Measure Entry Form (date + measure select + Enviar), Measure Time-Series Line Chart, Measure Types (Peso, Altura, Cumplimiento, Nivel de hambre, Factor de actividad), Shown Measures Toggle List (Medidas mostradas), Visible Measures Deletion List (Medidas visibles)

### Community 40 - "NPM Scripts"
Cohesion: 0.29
Nodes (7): scripts, build, deploy, dev, lint, preview, supabase-types

### Community 41 - "Mobile Calendar Screenshot"
Cohesion: 0.33
Nodes (7): App Calendar Screenshot (mobile daily plan view), Bottom Tab Navigation (Home, Calendar, Stats, More), Client Daily Comment, Daily Nutrition Planning (meals + training per day), Meal Card (Breakfast recipe image with title overlay), Morning Training Session Section, Weekly Day Selector (Mon-Sun pills, month header)

### Community 42 - "Web Dashboard Screenshot"
Cohesion: 0.43
Nodes (7): Web Dashboard Screenshot, Carbohidratos por hora de entrenamiento, Macronutrientes diarios (carbs per kg), Balance energetico (daily and weekly), Dark-green tabular dashboard layout, Meal Codes (CC / DES level), Weekly Meal Plan Grid (meal slots x weekdays)

### Community 43 - "races/index.tsx"
Cohesion: 0.13
Nodes (25): BackButton(), StepNavigation(), StepProgress(), Title(), RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext (+17 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "RowInfo"
Cohesion: 0.13
Nodes (12): CellNumeric(), CellNumericProps, CellRowLabelProps, CellText(), CellTextProps, getRoundedNumber(), NumericEditor(), ModalShell() (+4 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useRaceDraft"
Cohesion: 0.30
Nodes (16): react-i18next, InputComponent, KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput (+8 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "useGetAuthSession"
Cohesion: 0.19
Nodes (20): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), useFetchHasSuscription(), startAuthListener() (+12 more)

### Community 67 - "new.tsx"
Cohesion: 0.26
Nodes (11): SectionLoading(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE, ConfigRaceIngredients(), IngredientList() (+3 more)

### Community 68 - "posterPreview.tsx"
Cohesion: 0.67
Nodes (4): POSTER_WIDTH, renderPosterPng(), waitForFrames(), RacePoster()

### Community 70 - "components.tsx"
Cohesion: 0.08
Nodes (46): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, kcalByDate(), Point, regressionSlope() (+38 more)

### Community 72 - "races.ts"
Cohesion: 0.27
Nodes (14): downloadBlob(), RaceManager(), isMissingRaceImage(), raceImageFileName(), raceImagePath(), racesForDateRangeOptions(), selectRacesWithHc(), Tables (+6 more)

### Community 73 - "addNoteForm.tsx"
Cohesion: 0.18
Nodes (16): AddNoteForm(), AddNoteFormProps, EMPTY_NOTE, NoteForm(), NoteFieldsInputs(), NoteItem(), clampPriority(), priorityClassName() (+8 more)

### Community 74 - "measures.ts"
Cohesion: 0.12
Nodes (19): TABLE_ALL_MEASURES, TABLE_USER_MEASURES, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+11 more)

### Community 75 - "dashboard/index.tsx"
Cohesion: 0.05
Nodes (71): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+63 more)

### Community 76 - "queryKeys"
Cohesion: 0.17
Nodes (22): @supabase/supabase-js, @tanstack/react-query, Disclaimer(), Title(), SignUpPage(), supabase, supabaseAnonKey, supabaseUrl (+14 more)

### Community 78 - "notification/hook.ts"
Cohesion: 0.33
Nodes (5): @reduxjs/toolkit, initialState, Notification, NotificationSlice, NotificationState

### Community 80 - "useLanguageCode"
Cohesion: 0.25
Nodes (15): useLanguageCode(), MealTypeEditor(), MealTypeEditorProps, MealTypeOption, useFetchOrderedMealsForId(), mealsForDateRangeOptions(), mealSlotId(), mealsWeekRange() (+7 more)

### Community 83 - "stepsTable.tsx"
Cohesion: 0.23
Nodes (12): fileInputStyle, fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn (+4 more)

### Community 84 - "raceIngredients.ts"
Cohesion: 0.32
Nodes (10): rasterizeSvg(), resizeImage(), svgAspectRatio(), imagePath(), RaceIngredientImageError, RaceIngredientRow, sortByName(), useAddRaceIngredient() (+2 more)

### Community 85 - "assignTheme.tsx"
Cohesion: 0.31
Nodes (9): assignErrorKey(), assignStyles, AssignThemeCard(), ChartsAppointmentProgress(), progressStyles, ThemeProgressItem(), useFetchAppointmentThemes(), useAssignAppointmentTheme() (+1 more)

### Community 86 - "Form"
Cohesion: 0.18
Nodes (13): react, MultiLineTextInputProps, TextInputProps, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+5 more)

### Community 88 - "FromDate"
Cohesion: 0.18
Nodes (21): FromDate, parseDateOnly(), useDaysOfWeek(), useMonthsOfYear(), CalendarAppointment, CalendarNote, formatTime(), groupByDay() (+13 more)

### Community 89 - "input/index.ts"
Cohesion: 0.38
Nodes (4): Numeric(), One(), Option, SelectOneInputProps

### Community 90 - "rows.ts"
Cohesion: 0.16
Nodes (13): dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, TrainingDay, trainingIntakeKcal(), trainingNetKcal(), CellMealProps, AutoGenerateEditor(), AutoGenerateEditorProps (+5 more)

### Community 91 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 94 - "error/hook.ts"
Cohesion: 0.31
Nodes (3): ErrorBoundary(), parseError(), useError()

### Community 95 - "configAppointment.ts"
Cohesion: 0.33
Nodes (10): useForm(), ValidateMaxLength(), Appointment, createNameField(), createScheduledOnField(), createStartTimeField(), createVideoUrlField(), fieldIds (+2 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 365 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `useRaceDraft` to `macrosResume.tsx`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `config.ts`, `useAppDispatch`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `recipes.ts`, `renderCommandGroup.tsx`, `lucide-react`, `form/components/stepSection.tsx`, `newPoint/form.ts`, `profileChart.tsx`, `user/appointments.ts`, `planing.ts`, `races/index.tsx`, `useGetAuthSession`, `new.tsx`, `posterPreview.tsx`, `components.tsx`, `races.ts`, `addNoteForm.tsx`, `dashboard/index.tsx`, `queryKeys`, `useLanguageCode`, `stepsTable.tsx`, `assignTheme.tsx`, `Form`, `FromDate`, `rows.ts`, `configAppointment.ts`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0971322849213691 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `macrosResume.tsx`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `useAppDispatch`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `recipes.ts`, `renderCommandGroup.tsx`, `lucide-react`, `form/components/stepSection.tsx`, `newPoint/form.ts`, `profileChart.tsx`, `user/appointments.ts`, `planing.ts`, `races/index.tsx`, `RowInfo`, `useRaceDraft`, `useGetAuthSession`, `new.tsx`, `posterPreview.tsx`, `components.tsx`, `races.ts`, `addNoteForm.tsx`, `dashboard/index.tsx`, `queryKeys`, `useLanguageCode`, `stepsTable.tsx`, `raceIngredients.ts`, `assignTheme.tsx`, `FromDate`, `input/index.ts`, `rows.ts`, `configAppointment.ts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.10338164251207729 - nodes in this community are weakly interconnected._
- **Should `columns.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._