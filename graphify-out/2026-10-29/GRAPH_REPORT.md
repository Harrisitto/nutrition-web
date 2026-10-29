# Graph Report - nutrition-web  (2026-10-29)

## Corpus Check
- 329 files · ~136,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .css 1)

## Summary
- 1627 nodes · 5014 edges · 91 communities (71 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b46b696`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- poster/constants.ts
- noClientsScreen/index.tsx
- raceDraftContext.ts
- App.tsx
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- columns.tsx
- planing.ts
- useRaceDraft
- useAppNavigation
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- user/meals.ts
- App TS Config
- dashboard/planing/index.tsx
- useGetAuthSession
- layout.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- queryKeys
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- store/store.ts
- config.ts
- measures.ts
- gpx.ts
- newPoint/form.ts
- races.ts
- useAppDispatch
- profileChart.tsx
- FromDate
- profile.ts
- RowInfo
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- profile/index.tsx
- Invite Client Flow
- useAppSelector
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- useNotification
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
- myVideos/list.tsx
- authManagement/index.tsx
- react
- language.ts
- components/styles.ts
- posterHeader.tsx
- all_videos_nutri_id_idx
- react-i18next
- dates.ts
- dashboard/index.tsx
- sideBar/list.tsx
- configuration/index.tsx
- autoGenerateInput.tsx
- Calendar WeekRow Module README
- navigation.tsx
- posterPreview.tsx
- input/index.ts
- vite.config.ts
- notification/hook.ts
- text/text.tsx
- Form
- priority.ts
- user_preset_global_nutri_id_idx

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 118 edges
2. `useAppSelector` - 116 edges
3. `react` - 112 edges
4. `FromDate` - 112 edges
5. `queryKeys()` - 100 edges
6. `lucide-react` - 58 edges
7. `useGetAuthSession()` - 48 edges
8. `useLanguageCode()` - 45 edges
9. `useNotification()` - 39 edges
10. `useAppNavigation()` - 37 edges

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

## Communities (91 total, 20 thin omitted)

### Community 0 - "poster/constants.ts"
Cohesion: 0.12
Nodes (28): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH, GROWN_CARD_SIZE (+20 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "raceDraftContext.ts"
Cohesion: 0.16
Nodes (19): RaceChart(), StepNavigation(), StepProgress(), Title(), RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext (+11 more)

### Community 3 - "App.tsx"
Cohesion: 0.14
Nodes (18): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+10 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.09
Nodes (44): recharts, hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc() (+36 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.10
Nodes (31): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES (+23 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.11
Nodes (33): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+25 more)

### Community 7 - "columns.tsx"
Cohesion: 0.12
Nodes (26): CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellMeal(), getKcalColorClass(), CellNumeric(), CellNumericProps (+18 more)

### Community 8 - "planing.ts"
Cohesion: 0.08
Nodes (52): dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, kcalByDate(), TrainingDay, trainingIntakeKcal(), trainingNetKcal(), Point, regressionSlope() (+44 more)

### Community 9 - "useRaceDraft"
Cohesion: 0.31
Nodes (15): InputComponent, KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput() (+7 more)

### Community 10 - "useAppNavigation"
Cohesion: 0.16
Nodes (16): useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), SignOut() (+8 more)

### Community 11 - "posterData.ts"
Cohesion: 0.30
Nodes (13): raceHc(), toSupportedLanguage(), altitudePoints(), buildChartData(), chartSpans(), resolveLandmarks(), useDraftChart(), PosterTotals (+5 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (25): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+17 more)

### Community 15 - "user/meals.ts"
Cohesion: 0.19
Nodes (20): SelectEditor(), MealTypeEditor(), MealTypeOption, PresetDayEditor(), PresetOption, fetchTypesForMeal(), useFetchAllMealTypes(), useFetchOrderedMealsForId() (+12 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dashboard/planing/index.tsx"
Cohesion: 0.20
Nodes (21): AddNoteForm(), Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone() (+13 more)

### Community 18 - "useGetAuthSession"
Cohesion: 0.16
Nodes (22): @supabase/supabase-js, TABLE_USER_INVITATIONS, AuthSession, startAuthListener(), toAuthSession(), useGetAuthSession(), imagePath(), RaceIngredientImageError (+14 more)

### Community 19 - "layout.ts"
Cohesion: 0.10
Nodes (34): altitudeAt(), BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, CARD_SIZES, MIN_POSTER_HEIGHT, PADDING_BOTTOM (+26 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.15
Nodes (22): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+14 more)

### Community 22 - "queryKeys"
Cohesion: 0.22
Nodes (14): @tanstack/react-query, useFetchHasSuscription(), supabase, useGetAuthInfo(), useInsertAppointmentPoint(), useInsertAppointmentTheme(), useFetchNutritionistNotes(), useFetchNutritionistNotesForDateRange() (+6 more)

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
Nodes (42): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, placeholderRecipeImg, Recipes README, Meal Type Filter, Recipe Rating (+34 more)

### Community 27 - "store/store.ts"
Cohesion: 0.10
Nodes (18): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), ErrorBoundary(), parseError(), useError() (+10 more)

### Community 28 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 29 - "measures.ts"
Cohesion: 0.11
Nodes (21): supabaseAnonKey, supabaseUrl, TABLE_ALL_MEASURES, TABLE_USER_MEASURES, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+13 more)

### Community 30 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.23
Nodes (7): ValidateIsUrl(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig()

### Community 32 - "races.ts"
Cohesion: 0.17
Nodes (20): InitialAnimationProps, PropsLoading, SectionLoading(), DraftState(), emptyDraft(), RaceDraftProvider(), RaceManager(), validateRaceDraft() (+12 more)

### Community 33 - "useAppDispatch"
Cohesion: 0.10
Nodes (21): DisplayMealsForm(), OrderInput(), KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroup() (+13 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.14
Nodes (26): assignLanes(), ChartData, ChartLandmark, ChartPoint, ChartSpan, landmarkLanes(), LandmarkOption, ChartTooltip() (+18 more)

### Community 35 - "FromDate"
Cohesion: 0.17
Nodes (20): FromDate, CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail() (+12 more)

### Community 36 - "profile.ts"
Cohesion: 0.15
Nodes (14): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_NUTRITIONISTS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_PLANING (+6 more)

### Community 37 - "RowInfo"
Cohesion: 0.10
Nodes (17): @tanstack/react-table, CellMealProps, CellRowLabelProps, CellTextProps, features, TableSelection, useKeyboardNavigation(), useTableRows() (+9 more)

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

### Community 43 - "profile/index.tsx"
Cohesion: 0.25
Nodes (11): fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+3 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "useAppSelector"
Cohesion: 0.06
Nodes (60): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, ValidateMaxLength(), StatusButton(), StepNavigation() (+52 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useNotification"
Cohesion: 0.42
Nodes (7): Disclaimer(), Title(), SignUpPage(), useInsertAuthInfo(), useSignOut(), useVerifyAuth(), useNotification()

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "myVideos/list.tsx"
Cohesion: 0.19
Nodes (16): getYoutubeThumbnail(), getYoutubeVideoId(), ID_PATHS, YOUTUBE_HOSTS, useForm(), ValidateYoutubeUrl(), calculateDerivedState(), config (+8 more)

### Community 67 - "authManagement/index.tsx"
Cohesion: 0.40
Nodes (7): Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 68 - "react"
Cohesion: 0.25
Nodes (12): react, StepSection(), Points, AddCustomPointForm(), AddPendingPointForm(), AddThemePointForm(), pointStyles, StepPoints() (+4 more)

### Community 69 - "language.ts"
Cohesion: 0.23
Nodes (12): useLanguageCode(), SupportedLanguage, RecipeInfo, selectRecipes(), useFetchRecipes(), useMutateNutriRecipe(), Preset, removePresetFromList() (+4 more)

### Community 70 - "components/styles.ts"
Cohesion: 0.18
Nodes (16): cardStyle, deleteButtonStyle, fileInputStyle, primaryButtonStyle, ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient (+8 more)

### Community 71 - "posterHeader.tsx"
Cohesion: 0.13
Nodes (16): EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, STAT_FONT_SIZE, SUBTITLE_FONT_SIZE, TITLE_FONT_SIZE, formatNumber(), IntakeCard() (+8 more)

### Community 73 - "react-i18next"
Cohesion: 0.14
Nodes (21): lucide-react, react-i18next, primaryIconButtonStyle, NEXT_STATUS, AddNoteFormProps, EMPTY_NOTE, NoteForm(), availableStates (+13 more)

### Community 74 - "dates.ts"
Cohesion: 0.15
Nodes (17): @dnd-kit/core, parseDateOnly(), useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps (+9 more)

### Community 75 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 76 - "sideBar/list.tsx"
Cohesion: 0.43
Nodes (6): AnimationLoading(), checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 77 - "configuration/index.tsx"
Cohesion: 0.19
Nodes (17): getTrailingRoute(), Header(), ConfigurationPages(), PageAppointmentThemes, PageInviteClient, PageMyVideos, PageNutritionistConfiguration(), PageUserPreset (+9 more)

### Community 78 - "autoGenerateInput.tsx"
Cohesion: 0.23
Nodes (11): react-dom, AutoGenerateEditor(), AutoGenerateEditorProps, ModalShell(), SelectEditorProps, TextEditor(), useSaveTraining(), fetchMeals() (+3 more)

### Community 79 - "Calendar WeekRow Module README"
Cohesion: 0.23
Nodes (13): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+5 more)

### Community 80 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 81 - "posterPreview.tsx"
Cohesion: 0.26
Nodes (12): downloadBlob(), rasterizeSvg(), resizeImage(), svgAspectRatio(), POSTER_WIDTH, RacePosterData, renderPosterPng(), waitForFrames() (+4 more)

### Community 82 - "input/index.ts"
Cohesion: 0.31
Nodes (5): Numeric(), One(), Option, SelectOneInputProps, Toggle()

### Community 83 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 84 - "notification/hook.ts"
Cohesion: 0.24
Nodes (6): useAddNotification(), useNotificationErrorQuery(), initialState, Notification, NotificationSlice, NotificationState

### Community 85 - "text/text.tsx"
Cohesion: 0.33
Nodes (3): MultiLineTextInputProps, TextInputProps, InputTypes

### Community 86 - "Form"
Cohesion: 0.19
Nodes (11): Form, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType, FormConfig, FormFieldUpdate (+3 more)

### Community 87 - "priority.ts"
Cohesion: 0.53
Nodes (4): priorityClassName(), PriorityTag(), NOTE_PRIORITY_MAX, NOTE_PRIORITY_MIN

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `poster/constants.ts`, `noClientsScreen/index.tsx`, `raceDraftContext.ts`, `App.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `planing.ts`, `useRaceDraft`, `useAppNavigation`, `Privacy & References Text`, `Package Manifest`, `user/meals.ts`, `dashboard/planing/index.tsx`, `layout.ts`, `appointmentThemes/index.tsx`, `recipes.ts`, `store/store.ts`, `config.ts`, `newPoint/form.ts`, `races.ts`, `useAppDispatch`, `profileChart.tsx`, `FromDate`, `RowInfo`, `profile/index.tsx`, `useAppSelector`, `useNotification`, `myVideos/list.tsx`, `authManagement/index.tsx`, `react`, `language.ts`, `components/styles.ts`, `posterHeader.tsx`, `dates.ts`, `configuration/index.tsx`, `autoGenerateInput.tsx`, `navigation.tsx`, `posterPreview.tsx`, `Form`, `priority.ts`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `poster/constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `poster/constants.ts`, `noClientsScreen/index.tsx`, `raceDraftContext.ts`, `App.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `planing.ts`, `useRaceDraft`, `useAppNavigation`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `user/meals.ts`, `dashboard/planing/index.tsx`, `useGetAuthSession`, `appointmentThemes/index.tsx`, `recipes.ts`, `store/store.ts`, `newPoint/form.ts`, `races.ts`, `useAppDispatch`, `profileChart.tsx`, `FromDate`, `profile.ts`, `RowInfo`, `profile/index.tsx`, `useAppSelector`, `useNotification`, `myVideos/list.tsx`, `authManagement/index.tsx`, `language.ts`, `components/styles.ts`, `posterHeader.tsx`, `react-i18next`, `dates.ts`, `dashboard/index.tsx`, `sideBar/list.tsx`, `configuration/index.tsx`, `autoGenerateInput.tsx`, `navigation.tsx`, `posterPreview.tsx`, `input/index.ts`, `notification/hook.ts`, `text/text.tsx`, `Form`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Why does `FromDate` connect `FromDate` to `races.ts`, `useAppDispatch`, `react`, `RowInfo`, `components/styles.ts`, `Measures Page & Colors`, `planing.ts`, `react-i18next`, `dates.ts`, `columns.tsx`, `preset/components/form/hook.ts`, `useAppSelector`, `autoGenerateInput.tsx`, `user/meals.ts`, `posterHeader.tsx`, `dashboard/planing/index.tsx`, `queryKeys`, `measures.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09294199860237597 - nodes in this community are weakly interconnected._