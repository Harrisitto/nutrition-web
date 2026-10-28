# Graph Report - nutrition-web  (2026-10-28)

## Corpus Check
- 315 files · ~131,775 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1572 nodes · 4816 edges · 85 communities (68 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01ebf234`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- error/hook.ts
- noClientsScreen/index.tsx
- gpx.ts
- appointments/form/index.tsx
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- columns.tsx
- lucide-react
- recipes.ts
- react-i18next
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- App.tsx
- App TS Config
- dates.ts
- profile.ts
- poster/constants.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- useAppDispatch
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- language.ts
- Calendar WeekRow Module README
- vite.config.ts
- dashboard/index.tsx
- newPoint/form.ts
- sideBar/list.tsx
- layout.ts
- profileChart.tsx
- useAppSelector
- config.ts
- RowInfo
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- races.ts
- Invite Client Flow
- authManagement/index.tsx
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- stopBox.tsx
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
- raceDraftContext.ts
- posterPreview.tsx
- navigation.tsx
- components.tsx
- numericCell.tsx
- stepsTable.tsx
- input/index.ts
- Form
- navigation/index.ts
- queryKeys
- table/index.tsx
- types/index.ts
- state.config.keyboardCommands.tableNavigation
- useLanguageCode
- raceIngredients.ts
- Form
- FromDate
- rows.ts

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 113 edges
2. `useAppSelector` - 113 edges
3. `FromDate` - 111 edges
4. `react` - 110 edges
5. `queryKeys()` - 96 edges
6. `lucide-react` - 55 edges
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

## Communities (85 total, 17 thin omitted)

### Community 0 - "error/hook.ts"
Cohesion: 0.07
Nodes (24): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), ErrorBoundary(), parseError(), useError() (+16 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (17): cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan, hasRealTimes() (+9 more)

### Community 3 - "appointments/form/index.tsx"
Cohesion: 0.15
Nodes (18): NEXT_STATUS, StatusButton(), StepNavigation(), StepProgress(), APPOINTMENT_STEPS, AppointmentStep, FormAppointment(), PageFormAppointment() (+10 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.10
Nodes (37): hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds (+29 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.12
Nodes (27): WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES, CellDisplay, CellMeal, CellNumeric, CellPresetDay (+19 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "columns.tsx"
Cohesion: 0.19
Nodes (14): CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellRace(), CellRaceProps, CellRowLabel(), useTableColumns() (+6 more)

### Community 8 - "lucide-react"
Cohesion: 0.22
Nodes (15): lucide-react, cardStyle, deleteButtonStyle, primaryButtonStyle, StepSection(), Points, AddCustomPointForm(), AddPendingPointForm() (+7 more)

### Community 9 - "recipes.ts"
Cohesion: 0.22
Nodes (12): List(), placeholderRecipeImg, Recipes(), renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType(), ViewRecipe() (+4 more)

### Community 10 - "react-i18next"
Cohesion: 0.32
Nodes (15): react-i18next, InputComponent, KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput (+7 more)

### Community 11 - "posterData.ts"
Cohesion: 0.35
Nodes (11): raceHc(), toSupportedLanguage(), chartSpans(), resolveLandmarks(), useDraftChart(), PosterTotals, raceTotals(), totalElevationGain() (+3 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.08
Nodes (26): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+18 more)

### Community 15 - "App.tsx"
Cohesion: 0.17
Nodes (14): App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage, InitialAnimation() (+6 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.14
Nodes (20): @dnd-kit/core, parseDateOnly(), DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps (+12 more)

### Community 18 - "profile.ts"
Cohesion: 0.14
Nodes (16): TABLE_ALL_MACROS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_USER_INFO, TABLE_USER_INVITATIONS, TABLE_USER_MEASURES, TABLE_USER_PLANING_MEAL (+8 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.07
Nodes (48): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+40 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.15
Nodes (24): iconButtonStyle, primaryIconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline() (+16 more)

### Community 22 - "useAppDispatch"
Cohesion: 0.11
Nodes (19): DisplayMealsForm(), OrderInput(), KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroup() (+11 more)

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
Cohesion: 0.07
Nodes (34): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+26 more)

### Community 27 - "language.ts"
Cohesion: 0.50
Nodes (5): useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, SelectDateCalendar()

### Community 28 - "Calendar WeekRow Module README"
Cohesion: 0.25
Nodes (12): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+4 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 30 - "dashboard/index.tsx"
Cohesion: 0.20
Nodes (18): react-router-dom, getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageNutritionistConfiguration(), PageAppointmentForm, PageAppointments (+10 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.16
Nodes (16): useForm(), ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig() (+8 more)

### Community 32 - "sideBar/list.tsx"
Cohesion: 0.29
Nodes (8): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 33 - "layout.ts"
Cohesion: 0.16
Nodes (22): altitudeAxis(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), IntakeStop, KmRange, kmTicks() (+14 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.12
Nodes (30): recharts, altitudeAt(), altitudePoints(), assignLanes(), buildChartData(), ChartData, ChartLandmark, ChartPoint (+22 more)

### Community 35 - "useAppSelector"
Cohesion: 0.09
Nodes (52): NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), assignErrorKey(), assignStyles, AssignThemeCard(), ChartsAppointmentProgress() (+44 more)

### Community 36 - "config.ts"
Cohesion: 0.12
Nodes (6): i18next, i18next-browser-languagedetector, instances, resources, savedLngKey, supportedLngs

### Community 37 - "RowInfo"
Cohesion: 0.14
Nodes (4): CellRowLabelProps, CellTextProps, RowInfo, TrainingHcRowInfo

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

### Community 43 - "races.ts"
Cohesion: 0.15
Nodes (25): SectionLoading(), downloadBlob(), listItemStyle(), secondaryButtonStyle, sectionStyle, DraftUpdate, RaceDraftContext, DraftState() (+17 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "authManagement/index.tsx"
Cohesion: 0.26
Nodes (10): SignOut(), Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal() (+2 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "stopBox.tsx"
Cohesion: 0.24
Nodes (8): BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, IntakeCard(), PlacedStop, PosterIntake, StopBox()

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "useGetAuthSession"
Cohesion: 0.19
Nodes (17): Disclaimer(), Title(), SignUpPage(), ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients() (+9 more)

### Community 67 - "raceDraftContext.ts"
Cohesion: 0.28
Nodes (10): StepNavigation(), RACE_STEPS, RaceStep, RaceDraftContextValue, DraftIssue, DraftIssueKey, SAVE_ERRORS, saveErrorKey() (+2 more)

### Community 68 - "posterPreview.tsx"
Cohesion: 0.44
Nodes (7): POSTER_WIDTH, posterI18n(), renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster()

### Community 69 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 70 - "components.tsx"
Cohesion: 0.06
Nodes (69): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, Point, regressionSlope(), STEP_HISTORY_PAGES (+61 more)

### Community 71 - "numericCell.tsx"
Cohesion: 0.22
Nodes (10): react-dom, CellNumeric(), CellNumericProps, CellText(), getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditor() (+2 more)

### Community 72 - "stepsTable.tsx"
Cohesion: 0.31
Nodes (10): fitAltitudeMarks(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns, StepsTable() (+2 more)

### Community 73 - "input/index.ts"
Cohesion: 0.28
Nodes (5): Numeric(), One(), Option, SelectOneInputProps, availableStates

### Community 75 - "navigation/index.ts"
Cohesion: 0.16
Nodes (17): ProtectedRoute(), ProtectedRouteProps, routeNeedsSelectedClient(), useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES (+9 more)

### Community 76 - "queryKeys"
Cohesion: 0.14
Nodes (32): @supabase/supabase-js, @tanstack/react-query, useFetchHasSuscription(), SupportedLanguage, supabase, supabaseAnonKey, supabaseUrl, TABLE_ALL_NUTRITIONISTS (+24 more)

### Community 77 - "table/index.tsx"
Cohesion: 0.31
Nodes (6): @tanstack/react-table, features, TableSelection, useKeyboardNavigation(), Selection, sectionHeaderTdStyle

### Community 78 - "types/index.ts"
Cohesion: 0.31
Nodes (6): CellMeal(), CellMealProps, getKcalColorClass(), ALL_IDS, AllIdsValues, MealRowInfo

### Community 79 - "state.config.keyboardCommands.tableNavigation"
Cohesion: 0.60
Nodes (5): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, state.config.keyboardCommands.tableNavigation

### Community 80 - "useLanguageCode"
Cohesion: 0.11
Nodes (31): kcalByDate(), useLanguageCode(), CellPresetDay(), CellPresetDayProps, MealTypeEditor(), MealTypeOption, PresetDayEditor(), PresetDayEditorProps (+23 more)

### Community 84 - "raceIngredients.ts"
Cohesion: 0.15
Nodes (23): fileInputStyle, rasterizeSvg(), resizeImage(), svgAspectRatio(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient (+15 more)

### Community 86 - "Form"
Cohesion: 0.18
Nodes (13): react, MultiLineTextInputProps, TextInputProps, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+5 more)

### Community 88 - "FromDate"
Cohesion: 0.15
Nodes (23): FromDate, CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail() (+15 more)

### Community 90 - "rows.ts"
Cohesion: 0.22
Nodes (15): dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, TrainingDay, trainingIntakeKcal(), trainingNetKcal(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows() (+7 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 366 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `error/hook.ts`, `noClientsScreen/index.tsx`, `gpx.ts`, `appointments/form/index.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `lucide-react`, `recipes.ts`, `Privacy & References Text`, `Package Manifest`, `App.tsx`, `dates.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `useAppDispatch`, `language.ts`, `dashboard/index.tsx`, `newPoint/form.ts`, `profileChart.tsx`, `useAppSelector`, `config.ts`, `races.ts`, `authManagement/index.tsx`, `stopBox.tsx`, `useGetAuthSession`, `raceDraftContext.ts`, `posterPreview.tsx`, `navigation.tsx`, `components.tsx`, `stepsTable.tsx`, `input/index.ts`, `navigation/index.ts`, `useLanguageCode`, `raceIngredients.ts`, `Form`, `FromDate`, `rows.ts`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `error/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07317073170731707 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `error/hook.ts`, `noClientsScreen/index.tsx`, `gpx.ts`, `appointments/form/index.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `lucide-react`, `recipes.ts`, `react-i18next`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `App.tsx`, `dates.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `useAppDispatch`, `language.ts`, `dashboard/index.tsx`, `newPoint/form.ts`, `sideBar/list.tsx`, `profileChart.tsx`, `useAppSelector`, `races.ts`, `authManagement/index.tsx`, `useGetAuthSession`, `raceDraftContext.ts`, `posterPreview.tsx`, `navigation.tsx`, `components.tsx`, `numericCell.tsx`, `stepsTable.tsx`, `input/index.ts`, `navigation/index.ts`, `queryKeys`, `table/index.tsx`, `useLanguageCode`, `raceIngredients.ts`, `FromDate`, `rows.ts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09951690821256039 - nodes in this community are weakly interconnected._
- **Why does `useAppSelector` connect `useAppSelector` to `error/hook.ts`, `appointments/form/index.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `dates.ts`, `profile.ts`, `useAppDispatch`, `language.ts`, `sideBar/list.tsx`, `races.ts`, `useGetAuthSession`, `navigation.tsx`, `components.tsx`, `numericCell.tsx`, `navigation/index.ts`, `queryKeys`, `table/index.tsx`, `useLanguageCode`, `FromDate`, `rows.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.11724137931034483 - nodes in this community are weakly interconnected._