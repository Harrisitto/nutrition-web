# Graph Report - nutrition-web  (2026-10-29)

## Corpus Check
- 330 files · ~136,267 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .css 1)

## Summary
- 1631 nodes · 5017 edges · 97 communities (76 shown, 21 thin omitted)
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
- queryKeys
- posterLayout
- Runtime Dependencies
- appointmentThemes/index.tsx
- profile.ts
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- error/store.ts
- config.ts
- races.ts
- gpx.ts
- newPoint/form.ts
- RaceManager
- store/store.ts
- profileChart.tsx
- FromDate
- measures.ts
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
- react-i18next
- language.ts
- components/styles.ts
- posterProfile.tsx
- all_videos_nutri_id_idx
- react-i18next
- dates.ts
- dashboard/index.tsx
- sideBar/list.tsx
- configuration/index.tsx
- autoGenerateInput.tsx
- recipes.ts
- navigation.tsx
- posterPreview.tsx
- input/index.ts
- vite.config.ts
- raceIngredients.ts
- text/text.tsx
- Form
- configAppointment.ts
- user_preset_global_nutri_id_idx
- configuration/index.tsx
- info.tsx
- ModalShell
- PosterCanvas
- one.tsx
- public.clone_week_planing

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

## Communities (97 total, 21 thin omitted)

### Community 0 - "poster/constants.ts"
Cohesion: 0.11
Nodes (38): BOX_GAP, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+30 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "raceDraftContext.ts"
Cohesion: 0.14
Nodes (24): BackButton(), sectionStyle, StepNavigation(), StepProgress(), Title(), RACE_STEPS, RaceStep, DraftUpdate (+16 more)

### Community 3 - "App.tsx"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.09
Nodes (42): hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds (+34 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.11
Nodes (33): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+25 more)

### Community 7 - "columns.tsx"
Cohesion: 0.14
Nodes (23): CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellMeal(), getKcalColorClass(), CellNumeric(), CellPresetDay() (+15 more)

### Community 8 - "planing.ts"
Cohesion: 0.07
Nodes (53): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, TrainingDay (+45 more)

### Community 9 - "useRaceDraft"
Cohesion: 0.35
Nodes (14): KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput(), useItemError() (+6 more)

### Community 10 - "useAppNavigation"
Cohesion: 0.16
Nodes (16): useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), SignOut() (+8 more)

### Community 11 - "posterData.ts"
Cohesion: 0.23
Nodes (16): raceHc(), toSupportedLanguage(), altitudePoints(), buildChartData(), ChartLandmark, ChartSpan, chartSpans(), resolveLandmarks() (+8 more)

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
Cohesion: 0.17
Nodes (19): kcalByDate(), SelectEditor(), SelectEditorProps, MealTypeEditor(), MealTypeEditorProps, MealTypeOption, PresetDayEditor(), PresetDayEditorProps (+11 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dashboard/planing/index.tsx"
Cohesion: 0.21
Nodes (20): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), Weight() (+12 more)

### Community 18 - "queryKeys"
Cohesion: 0.16
Nodes (24): useFetchHasSuscription(), startAuthListener(), toAuthSession(), useGetAuthInfo(), useGetAuthSession(), useFetchNutritionistNotes(), useFetchNutritionistNotesForDateRange(), useFetchPendingNutritionistTasks() (+16 more)

### Community 19 - "posterLayout"
Cohesion: 0.16
Nodes (14): altitudeAt(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), levelCount(), mergeRanges(), pillWidth() (+6 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.15
Nodes (24): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+16 more)

### Community 22 - "profile.ts"
Cohesion: 0.27
Nodes (9): @supabase/supabase-js, @tanstack/react-query, supabase, supabaseAnonKey, supabaseUrl, AuthSession, queryClient, GenerateError (+1 more)

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

### Community 27 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 28 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 29 - "races.ts"
Cohesion: 0.13
Nodes (18): CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables (+10 more)

### Community 30 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.39
Nodes (6): ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig()

### Community 32 - "RaceManager"
Cohesion: 0.50
Nodes (5): RaceManager(), isMissingRaceImage(), raceImagePath(), useDeleteRace(), useDownloadRaceImage()

### Community 33 - "store/store.ts"
Cohesion: 0.05
Nodes (41): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), DisplayMealsForm(), OrderInput(), KeyboardInput() (+33 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.15
Nodes (25): recharts, assignLanes(), ChartData, ChartPoint, landmarkLanes(), LandmarkOption, ChartTooltip(), BLUE (+17 more)

### Community 35 - "FromDate"
Cohesion: 0.20
Nodes (15): FromDate, groupByDay(), monthGrid(), shiftMonth(), PageAppointmentsCalendar(), AppointmentDate(), daysUntil(), useTableRows() (+7 more)

### Community 36 - "measures.ts"
Cohesion: 0.12
Nodes (20): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_NUTRITIONISTS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO (+12 more)

### Community 37 - "RowInfo"
Cohesion: 0.09
Nodes (16): @tanstack/react-table, CellMealProps, CellNumericProps, CellRowLabelProps, CellTextProps, features, TableSelection, useKeyboardNavigation() (+8 more)

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
Cohesion: 0.10
Nodes (42): primaryIconButtonStyle, StatusButton(), StepNavigation(), StepProgress(), NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints() (+34 more)

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
Cohesion: 0.15
Nodes (16): getYoutubeThumbnail(), getYoutubeVideoId(), ID_PATHS, YOUTUBE_HOSTS, ValidateIsUrl(), ValidateYoutubeUrl(), calculateDerivedState(), config (+8 more)

### Community 67 - "authManagement/index.tsx"
Cohesion: 0.40
Nodes (7): Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 68 - "react-i18next"
Cohesion: 0.20
Nodes (18): lucide-react, react-i18next, cardStyle, deleteButtonStyle, primaryButtonStyle, PendingTasks(), NEXT_STATUS, StepSection() (+10 more)

### Community 69 - "language.ts"
Cohesion: 0.18
Nodes (15): useLanguageCode(), SupportedLanguage, TABLE_USER_PLANING, fetchPlanningWeek(), Planing, PlanningData, planningForDateRangeOptions(), selectFromPlaning() (+7 more)

### Community 70 - "components/styles.ts"
Cohesion: 0.23
Nodes (12): SectionLoading(), fileInputStyle, ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE, ConfigRaceIngredients() (+4 more)

### Community 71 - "posterProfile.tsx"
Cohesion: 0.11
Nodes (21): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, PLOT_RIGHT_PADDING (+13 more)

### Community 73 - "react-i18next"
Cohesion: 0.12
Nodes (29): useDaysOfWeek(), CalendarAppointment, CalendarNote, formatTime(), DayDetail(), MonthGrid(), noteDotClassName(), AddNoteForm() (+21 more)

### Community 74 - "dates.ts"
Cohesion: 0.17
Nodes (16): @dnd-kit/core, parseDateOnly(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps, DraggableWeekRow() (+8 more)

### Community 75 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 76 - "sideBar/list.tsx"
Cohesion: 0.29
Nodes (8): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 77 - "configuration/index.tsx"
Cohesion: 0.25
Nodes (12): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), List(), Recipes() (+4 more)

### Community 78 - "autoGenerateInput.tsx"
Cohesion: 0.39
Nodes (9): AutoGenerateEditor(), AutoGenerateEditorProps, useSaveTraining(), fetchMeals(), useFetchMeals(), useFetchOrderedMealsForId(), parseGenerateError(), useGeneratePlaningDay() (+1 more)

### Community 79 - "recipes.ts"
Cohesion: 0.24
Nodes (12): placeholderRecipeImg, renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType(), ViewRecipe(), RecipeInfo, selectRecipeInfo() (+4 more)

### Community 80 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 81 - "posterPreview.tsx"
Cohesion: 0.40
Nodes (8): downloadBlob(), RacePosterData, renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster(), raceImageFileName()

### Community 82 - "input/index.ts"
Cohesion: 0.47
Nodes (3): InputComponent, Numeric(), Toggle()

### Community 83 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 84 - "raceIngredients.ts"
Cohesion: 0.32
Nodes (10): rasterizeSvg(), resizeImage(), svgAspectRatio(), imagePath(), RaceIngredientImageError, RaceIngredientRow, sortByName(), useAddRaceIngredient() (+2 more)

### Community 85 - "text/text.tsx"
Cohesion: 0.33
Nodes (3): MultiLineTextInputProps, TextInputProps, InputTypes

### Community 86 - "Form"
Cohesion: 0.19
Nodes (12): react, Form, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType, FormConfig (+4 more)

### Community 87 - "configAppointment.ts"
Cohesion: 0.33
Nodes (10): useForm(), ValidateMaxLength(), Appointment, createNameField(), createScheduledOnField(), createStartTimeField(), createVideoUrlField(), fieldIds (+2 more)

### Community 91 - "configuration/index.tsx"
Cohesion: 0.38
Nodes (7): getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageMyVideos, PageNutritionistConfiguration(), PageUserPreset

### Community 92 - "info.tsx"
Cohesion: 0.33
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 93 - "ModalShell"
Cohesion: 0.43
Nodes (5): react-dom, getRoundedNumber(), NumericEditor(), ModalShell(), TextEditor()

### Community 94 - "PosterCanvas"
Cohesion: 0.29
Nodes (6): IntakeCard(), PosterIntake, LandmarkPill(), Overlay(), PosterCanvas(), StopBox()

### Community 95 - "one.tsx"
Cohesion: 0.50
Nodes (3): One(), Option, SelectOneInputProps

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 385 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `poster/constants.ts`, `noClientsScreen/index.tsx`, `raceDraftContext.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `planing.ts`, `useRaceDraft`, `useAppNavigation`, `Privacy & References Text`, `Package Manifest`, `user/meals.ts`, `dashboard/planing/index.tsx`, `appointmentThemes/index.tsx`, `config.ts`, `newPoint/form.ts`, `store/store.ts`, `profileChart.tsx`, `FromDate`, `profile/index.tsx`, `useAppSelector`, `useNotification`, `myVideos/list.tsx`, `authManagement/index.tsx`, `language.ts`, `components/styles.ts`, `posterProfile.tsx`, `react-i18next`, `dates.ts`, `configuration/index.tsx`, `autoGenerateInput.tsx`, `recipes.ts`, `navigation.tsx`, `posterPreview.tsx`, `Form`, `configAppointment.ts`, `configuration/index.tsx`, `info.tsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `poster/constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10801393728222997 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `poster/constants.ts`, `noClientsScreen/index.tsx`, `raceDraftContext.ts`, `App.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `planing.ts`, `useRaceDraft`, `useAppNavigation`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `user/meals.ts`, `dashboard/planing/index.tsx`, `appointmentThemes/index.tsx`, `profile.ts`, `races.ts`, `newPoint/form.ts`, `store/store.ts`, `profileChart.tsx`, `FromDate`, `RowInfo`, `profile/index.tsx`, `useAppSelector`, `useNotification`, `myVideos/list.tsx`, `authManagement/index.tsx`, `react-i18next`, `components/styles.ts`, `posterProfile.tsx`, `react-i18next`, `dates.ts`, `dashboard/index.tsx`, `sideBar/list.tsx`, `configuration/index.tsx`, `autoGenerateInput.tsx`, `recipes.ts`, `navigation.tsx`, `posterPreview.tsx`, `raceIngredients.ts`, `text/text.tsx`, `configAppointment.ts`, `configuration/index.tsx`, `info.tsx`, `ModalShell`, `one.tsx`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Should `raceDraftContext.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1354723707664884 - nodes in this community are weakly interconnected._
- **Why does `FromDate` connect `FromDate` to `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `planing.ts`, `user/meals.ts`, `dashboard/planing/index.tsx`, `queryKeys`, `profile.ts`, `races.ts`, `store/store.ts`, `measures.ts`, `RowInfo`, `useAppSelector`, `react-i18next`, `language.ts`, `posterProfile.tsx`, `react-i18next`, `dates.ts`, `autoGenerateInput.tsx`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0942684766214178 - nodes in this community are weakly interconnected._