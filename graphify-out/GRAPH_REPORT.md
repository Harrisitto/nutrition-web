# Graph Report - nutrition-web  (2026-10-27)

## Corpus Check
- 315 files · ~131,072 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1568 nodes · 4797 edges · 87 communities (70 shown, 17 thin omitted)
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
- useNotification
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
- useAppNavigation
- lucide-react
- vite.config.ts
- dashboard/index.tsx
- newPoint/form.ts
- sideBar/list.tsx
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
- authManagement/index.tsx
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
- navigation.tsx
- components.tsx
- mealCell.tsx
- races.ts
- addNoteForm.tsx
- queryKeys
- navigation/index.ts
- queryKeys
- info.tsx
- useLanguageCode
- stepsTable.tsx
- raceIngredients.ts
- assignTheme.tsx
- Form
- FromDate
- input/index.ts
- rows.ts
- configAppointment.ts

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 113 edges
2. `useAppSelector` - 112 edges
3. `FromDate` - 111 edges
4. `react` - 110 edges
5. `queryKeys()` - 95 edges
6. `lucide-react` - 54 edges
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

## Communities (87 total, 17 thin omitted)

### Community 0 - "macrosResume.tsx"
Cohesion: 0.23
Nodes (13): FromDate, AppointmentDate(), daysUntil(), Weight(), MealTypeEditorProps, PresetDayEditorProps, Resume(), CHART_COLORS (+5 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "store/store.ts"
Cohesion: 0.08
Nodes (24): react-dom, react-redux, redux-persist, @reduxjs/toolkit, @tanstack/react-query-devtools, DisplayNotification(), getNotificationStyle(), ErrorBoundary() (+16 more)

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
Cohesion: 0.08
Nodes (35): @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellNumeric(), CellNumericProps, CellPresetDay() (+27 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.29
Nodes (15): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), NavigateAppointments() (+7 more)

### Community 9 - "config.ts"
Cohesion: 0.11
Nodes (9): i18next, i18next-browser-languagedetector, toSupportedLanguage(), instances, posterI18n(), resources, savedLngKey, SupportedLanguage (+1 more)

### Community 10 - "useNotification"
Cohesion: 0.15
Nodes (17): Disclaimer(), Title(), SignUpPage(), TABLE_ALL_NUTRITIONISTS, CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema (+9 more)

### Community 11 - "posterData.ts"
Cohesion: 0.20
Nodes (19): altitudeAt(), altitudePoints(), assignLanes(), buildChartData(), ChartSpan, chartSpans(), landmarkLanes(), LandmarkOption (+11 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (24): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+16 more)

### Community 15 - "App.tsx"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.14
Nodes (17): @dnd-kit/core, parseDateOnly(), useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps (+9 more)

### Community 18 - "profile.ts"
Cohesion: 0.13
Nodes (16): UserName(), TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_PLANING (+8 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.11
Nodes (36): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH, EYEBROW_FONT_SIZE, HEADER_HEIGHT (+28 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.16
Nodes (21): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+13 more)

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
Cohesion: 0.06
Nodes (48): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, List(), placeholderRecipeImg, Recipes(), Recipes README (+40 more)

### Community 27 - "useAppNavigation"
Cohesion: 0.27
Nodes (9): useAppNavigation(), APP_ROUTES, SignOut(), PageAppointments(), PendingAppointmentItem(), PendingAppointments(), CancelPaymentPage(), PaymentRequiredPage() (+1 more)

### Community 28 - "lucide-react"
Cohesion: 0.15
Nodes (23): lucide-react, react-i18next, cardStyle, deleteButtonStyle, primaryButtonStyle, NEXT_STATUS, StatusButton(), StepNavigation() (+15 more)

### Community 29 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 30 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.20
Nodes (8): primaryIconButtonStyle, ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), fieldIds, useConfig()

### Community 32 - "sideBar/list.tsx"
Cohesion: 0.29
Nodes (8): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 33 - "layout.ts"
Cohesion: 0.07
Nodes (42): BOX_GAP, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, CARD_SIZES, GROWN_CARD_SIZE, MIN_POSTER_HEIGHT (+34 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.16
Nodes (21): recharts, ChartData, ChartLandmark, ChartPoint, ChartTooltip(), BLUE, ChartSizes, EDITOR_CHART_SIZES (+13 more)

### Community 35 - "user/appointments.ts"
Cohesion: 0.21
Nodes (25): StepProgress(), NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), FormAppointment(), PageFormAppointment(), saveErrorKey() (+17 more)

### Community 37 - "planing.ts"
Cohesion: 0.27
Nodes (12): kcalByDate(), fetchPlanningWeek(), orIlikeValue(), Planing, PlanningData, planningForDateRangeOptions(), selectFromPlaning(), upsertDayInWeek() (+4 more)

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
Cohesion: 0.14
Nodes (24): BackButton(), secondaryButtonStyle, StepNavigation(), StepProgress(), Title(), RACE_STEPS, RaceStep, DraftUpdate (+16 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "authManagement/index.tsx"
Cohesion: 0.40
Nodes (7): Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useRaceDraft"
Cohesion: 0.30
Nodes (15): InputComponent, raceHc(), KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput (+7 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "useGetAuthSession"
Cohesion: 0.26
Nodes (13): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), TABLE_USER_INVITATIONS, INVITATION_MESSAGE_MAX_LENGTH (+5 more)

### Community 67 - "new.tsx"
Cohesion: 0.36
Nodes (7): fileInputStyle, ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE, NewRaceIngredient

### Community 68 - "posterPreview.tsx"
Cohesion: 0.54
Nodes (6): POSTER_WIDTH, renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster()

### Community 69 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 70 - "components.tsx"
Cohesion: 0.09
Nodes (42): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, Point, regressionSlope(), STEP_HISTORY_PAGES (+34 more)

### Community 71 - "mealCell.tsx"
Cohesion: 0.28
Nodes (4): CellMeal(), CellMealProps, getKcalColorClass(), MealRowInfo

### Community 72 - "races.ts"
Cohesion: 0.20
Nodes (17): downloadBlob(), listItemStyle(), RaceManager(), isMissingRaceImage(), raceImageFileName(), raceImagePath(), racesForDateRangeOptions(), selectRacePlan() (+9 more)

### Community 73 - "addNoteForm.tsx"
Cohesion: 0.18
Nodes (17): AddNoteForm(), AddNoteFormProps, EMPTY_NOTE, NoteForm(), NoteFieldsInputs(), Note, NoteItem(), clampPriority() (+9 more)

### Community 74 - "queryKeys"
Cohesion: 0.11
Nodes (26): useFetchHasSuscription(), TABLE_ALL_MEASURES, TABLE_USER_MEASURES, Tables, startAuthListener(), toAuthSession(), useGetAuthSession(), useInsertAuthInfo() (+18 more)

### Community 75 - "navigation/index.ts"
Cohesion: 0.22
Nodes (11): DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, AppRoute, getTrailingRoute(), useSearchParams(), Header(), PageAppointmentThemes (+3 more)

### Community 76 - "queryKeys"
Cohesion: 0.19
Nodes (15): @supabase/supabase-js, @tanstack/react-query, supabase, supabaseAnonKey, supabaseUrl, AuthSession, useFetchNutritionistNotes(), useFetchNutritionistNotesForDateRange() (+7 more)

### Community 77 - "info.tsx"
Cohesion: 0.33
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 80 - "useLanguageCode"
Cohesion: 0.21
Nodes (19): useLanguageCode(), SelectEditor(), SelectEditorProps, MealTypeEditor(), MealTypeOption, PresetDayEditor(), PresetOption, mealsForDateRangeOptions() (+11 more)

### Community 83 - "stepsTable.tsx"
Cohesion: 0.25
Nodes (12): fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+4 more)

### Community 84 - "raceIngredients.ts"
Cohesion: 0.19
Nodes (17): SectionLoading(), rasterizeSvg(), resizeImage(), svgAspectRatio(), ConfigRaceIngredients(), IngredientList(), normalize(), AddIngredientForm() (+9 more)

### Community 85 - "assignTheme.tsx"
Cohesion: 0.31
Nodes (9): assignErrorKey(), assignStyles, AssignThemeCard(), ChartsAppointmentProgress(), progressStyles, ThemeProgressItem(), useFetchAppointmentThemes(), useAssignAppointmentTheme() (+1 more)

### Community 86 - "Form"
Cohesion: 0.18
Nodes (13): react, MultiLineTextInputProps, TextInputProps, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+5 more)

### Community 88 - "FromDate"
Cohesion: 0.31
Nodes (12): CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail(), PageAppointmentsCalendar() (+4 more)

### Community 89 - "input/index.ts"
Cohesion: 0.38
Nodes (4): Numeric(), One(), Option, SelectOneInputProps

### Community 90 - "rows.ts"
Cohesion: 0.20
Nodes (14): dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, TrainingDay, trainingIntakeKcal(), trainingNetKcal(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows() (+6 more)

### Community 95 - "configAppointment.ts"
Cohesion: 0.33
Nodes (10): useForm(), ValidateMaxLength(), Appointment, createNameField(), createScheduledOnField(), createStartTimeField(), createVideoUrlField(), fieldIds (+2 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 365 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `lucide-react` to `macrosResume.tsx`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `config.ts`, `useNotification`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `useAppDispatch`, `recipes.ts`, `useAppNavigation`, `newPoint/form.ts`, `layout.ts`, `profileChart.tsx`, `user/appointments.ts`, `races/index.tsx`, `authManagement/index.tsx`, `useRaceDraft`, `useGetAuthSession`, `new.tsx`, `posterPreview.tsx`, `navigation.tsx`, `components.tsx`, `races.ts`, `addNoteForm.tsx`, `navigation/index.ts`, `info.tsx`, `useLanguageCode`, `stepsTable.tsx`, `raceIngredients.ts`, `assignTheme.tsx`, `Form`, `FromDate`, `rows.ts`, `configAppointment.ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `store/store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07557354925775979 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `macrosResume.tsx`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `useNotification`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `App.tsx`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `useAppDispatch`, `recipes.ts`, `useAppNavigation`, `lucide-react`, `dashboard/index.tsx`, `newPoint/form.ts`, `sideBar/list.tsx`, `profileChart.tsx`, `user/appointments.ts`, `races/index.tsx`, `authManagement/index.tsx`, `useRaceDraft`, `useGetAuthSession`, `new.tsx`, `posterPreview.tsx`, `navigation.tsx`, `components.tsx`, `races.ts`, `addNoteForm.tsx`, `navigation/index.ts`, `queryKeys`, `info.tsx`, `useLanguageCode`, `stepsTable.tsx`, `raceIngredients.ts`, `assignTheme.tsx`, `FromDate`, `input/index.ts`, `rows.ts`, `configAppointment.ts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0971322849213691 - nodes in this community are weakly interconnected._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.10338164251207729 - nodes in this community are weakly interconnected._