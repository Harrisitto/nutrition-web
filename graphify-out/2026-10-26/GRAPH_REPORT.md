# Graph Report - nutrition-web  (2026-10-26)

## Corpus Check
- 315 files · ~130,351 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1565 nodes · 4768 edges · 96 communities (79 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dd83204a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- noClientsScreen/index.tsx
- gpx.ts
- store/store.ts
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- columns.tsx
- dashboard/planing/index.tsx
- config.ts
- Calendar WeekRow Module README
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- queryKeys
- App TS Config
- dates.ts
- profile.ts
- poster/constants.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- posterHeader.tsx
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- renderCommandGroup.tsx
- react-i18next
- dashboard/index.tsx
- useAppSelector
- newPoint/form.ts
- routes.ts
- layout.ts
- profileChart.tsx
- data/meals.ts
- preset/components/form/hook.ts
- planing.ts
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- races/index.tsx
- Invite Client Flow
- numericCell.tsx
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
- useNotification
- raceIngredients.ts
- posterPreview.tsx
- RowInfo
- components.tsx
- SignUpPage.tsx
- races.ts
- noteItem.tsx
- supabase/types.ts
- useAppNavigation
- useGetAuthSession
- useAppNavigation
- notification/hook.ts
- info.tsx
- presetSelectInput.tsx
- history/index.tsx
- vite.config.ts
- stepsTable.tsx
- config/store.ts
- useAppDispatch
- Form
- authManagement/index.tsx
- FromDate
- input/index.ts
- rows.ts
- error/store.ts
- navigation.tsx
- text/text.tsx
- error/hook.ts
- state.config.keyboardCommands.tableNavigation

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 112 edges
2. `FromDate` - 111 edges
3. `useAppSelector` - 111 edges
4. `react` - 110 edges
5. `queryKeys()` - 94 edges
6. `lucide-react` - 53 edges
7. `useLanguageCode()` - 45 edges
8. `useGetAuthSession()` - 41 edges
9. `useAppNavigation()` - 35 edges
10. `useNotification()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Stripe-Supabase Integration Deployment Guide` --conceptually_related_to--> `Generate Supabase Types Workflow`  [INFERRED]
  supabase/solution/README.md → .github/workflows/supabase-types.yml
- `RowInfo` --semantically_similar_to--> `O(1) Map Lookup of Planning Data`  [INFERRED] [semantically similar]
  src/pages/dashboard/planing/@components/table/README.md → src/pages/dashboard/planing/@components/calendar/@components/weekRow/README.md
- `Generate Supabase Types Workflow` --references--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  .github/workflows/supabase-types.yml → supabase/solution/README.md
- `Tiered Seat Pricing (Stripe price, quantity = clients)` --conceptually_related_to--> `Nutritionist Access to Client Data`  [INFERRED]
  supabase/solution/README.md → public/privacyPolicy/langEn.txt
- `Supabase Data Storage in France (GDPR)` --conceptually_related_to--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  public/privacyPolicy/langEn.txt → supabase/solution/README.md

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

## Communities (96 total, 17 thin omitted)

### Community 0 - "react"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "store/store.ts"
Cohesion: 0.19
Nodes (11): react-redux, redux-persist, DisplayNotification(), getNotificationStyle(), ErrorBoundary(), AppDispatch, configPersistConfig, persistor (+3 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.14
Nodes (26): calculateKcalFromMacros(), Context, useContextFormPreset(), useInsert(), FieldMeal(), FieldText(), FieldTrainingHc(), InsertData() (+18 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.12
Nodes (26): WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES, CellDisplay, CellMeal, CellNumeric, CellPresetDay (+18 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "columns.tsx"
Cohesion: 0.12
Nodes (22): @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellPresetDay(), CellPresetDayProps, CellRace() (+14 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.21
Nodes (20): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), Weight() (+12 more)

### Community 9 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 10 - "Calendar WeekRow Module README"
Cohesion: 0.23
Nodes (13): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+5 more)

### Community 11 - "posterData.ts"
Cohesion: 0.33
Nodes (12): toSupportedLanguage(), altitudePoints(), buildChartData(), chartSpans(), resolveLandmarks(), useDraftChart(), PosterTotals, raceTotals() (+4 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (25): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+17 more)

### Community 15 - "queryKeys"
Cohesion: 0.21
Nodes (17): useLanguageCode(), SupportedLanguage, queryKeys(), useCloneWeek(), useGeneratePlaningDay(), mealsForDateRangeOptions(), MealType, TABLE_NAME (+9 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.16
Nodes (17): @dnd-kit/core, parseDateOnly(), useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps (+9 more)

### Community 18 - "profile.ts"
Cohesion: 0.19
Nodes (11): TABLE_ALL_MACROS, TABLE_ALL_NUTRITIONISTS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_USER_INFO, TABLE_USER_PLANING, TABLE_USER_PLANING_MEAL, TABLE_USER_PRESET (+3 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.13
Nodes (27): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH, LANDMARK_LINE (+19 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.14
Nodes (23): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+15 more)

### Community 22 - "posterHeader.tsx"
Cohesion: 0.13
Nodes (16): EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, STAT_FONT_SIZE, SUBTITLE_FONT_SIZE, TITLE_FONT_SIZE, formatNumber(), IntakeCard() (+8 more)

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

### Community 27 - "renderCommandGroup.tsx"
Cohesion: 0.25
Nodes (6): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps

### Community 28 - "react-i18next"
Cohesion: 0.15
Nodes (23): lucide-react, react-i18next, SectionLoading(), cardStyle, deleteButtonStyle, fileInputStyle, primaryButtonStyle, ALLOWED_IMAGE_TYPES (+15 more)

### Community 29 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 30 - "useAppSelector"
Cohesion: 0.10
Nodes (44): primaryIconButtonStyle, NEXT_STATUS, StatusButton(), StepNavigation(), StepProgress(), StepSection(), NewPoint, nextPositionOf() (+36 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.16
Nodes (16): useForm(), ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig() (+8 more)

### Community 32 - "routes.ts"
Cohesion: 0.62
Nodes (5): getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageNutritionistConfiguration()

### Community 33 - "layout.ts"
Cohesion: 0.09
Nodes (35): altitudeAt(), BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, CARD_SIZES, GROWN_CARD_SIZE, MIN_POSTER_HEIGHT (+27 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.13
Nodes (27): recharts, assignLanes(), ChartData, ChartLandmark, ChartPoint, ChartSpan, landmarkLanes(), LandmarkOption (+19 more)

### Community 35 - "data/meals.ts"
Cohesion: 0.15
Nodes (19): ConfigurationPages(), List(), placeholderRecipeImg, Recipes(), renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType() (+11 more)

### Community 36 - "preset/components/form/hook.ts"
Cohesion: 0.23
Nodes (11): InputState, calculateDerivedState(), commentField, createFieldForMeal(), createFieldForTrainingHc(), fieldIds, Meal, MealType (+3 more)

### Community 37 - "planing.ts"
Cohesion: 0.15
Nodes (20): HistoryPlaning(), kcalStat(), PlanningDay, toItems(), KCAL_SOURCES, KcalChart(), KcalSource, KcalStat (+12 more)

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
Nodes (24): BackButton(), RaceChart(), StepNavigation(), StepProgress(), Title(), RACE_STEPS, RaceStep, DraftUpdate (+16 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "numericCell.tsx"
Cohesion: 0.23
Nodes (9): react-dom, CellNumeric(), CellNumericProps, CellText(), getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditorProps (+1 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useRaceDraft"
Cohesion: 0.29
Nodes (15): InputComponent, KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput() (+7 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "useNotification"
Cohesion: 0.26
Nodes (14): InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), TABLE_USER_INVITATIONS, useInsertAuthInfo(), INVITATION_MESSAGE_MAX_LENGTH (+6 more)

### Community 67 - "raceIngredients.ts"
Cohesion: 0.29
Nodes (8): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 68 - "posterPreview.tsx"
Cohesion: 0.26
Nodes (12): downloadBlob(), rasterizeSvg(), resizeImage(), svgAspectRatio(), POSTER_WIDTH, RacePosterData, renderPosterPng(), waitForFrames() (+4 more)

### Community 69 - "RowInfo"
Cohesion: 0.12
Nodes (8): CellMealProps, CellRowLabelProps, CellTextProps, ALL_IDS, AllIdsValues, MealRowInfo, RowInfo, TrainingHcRowInfo

### Community 70 - "components.tsx"
Cohesion: 0.19
Nodes (20): HistoryMeasures(), UserMeasure, valuesByMeasure(), HistoryNotes(), Note, toItems(), HistoryItem, HistoryPageProps (+12 more)

### Community 71 - "SignUpPage.tsx"
Cohesion: 0.52
Nodes (5): Disclaimer(), Title(), SignUpPage(), useGetAuthInfo(), useVerifyAuth()

### Community 72 - "races.ts"
Cohesion: 0.16
Nodes (21): hcToKcal(), KCAL_PER_HC_GRAM, kcalByDate(), raceHc(), TrainingDay, trainingIntakeKcal(), trainingNetKcal(), RaceManager() (+13 more)

### Community 73 - "noteItem.tsx"
Cohesion: 0.18
Nodes (18): AddNoteFormProps, EMPTY_NOTE, NoteForm(), NoteFieldsInputs(), Note, clampPriority(), priorityClassName(), PriorityInput() (+10 more)

### Community 74 - "supabase/types.ts"
Cohesion: 0.12
Nodes (20): TABLE_ALL_MEASURES, TABLE_USER_MEASURES, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+12 more)

### Community 75 - "useAppNavigation"
Cohesion: 0.19
Nodes (12): DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), SignOut(), CancelPaymentPage() (+4 more)

### Community 76 - "useGetAuthSession"
Cohesion: 0.18
Nodes (20): @supabase/supabase-js, @tanstack/react-query, useFetchHasSuscription(), supabase, supabaseAnonKey, supabaseUrl, AuthSession, startAuthListener() (+12 more)

### Community 77 - "useAppNavigation"
Cohesion: 0.33
Nodes (9): useAppNavigation(), PageAppointments(), AppointmentDate(), daysUntil(), itemStyles, PendingAppointment, PendingAppointmentItem(), PendingAppointments() (+1 more)

### Community 78 - "notification/hook.ts"
Cohesion: 0.22
Nodes (7): @reduxjs/toolkit, useAddNotification(), useNotificationErrorQuery(), initialState, Notification, NotificationSlice, NotificationState

### Community 79 - "info.tsx"
Cohesion: 0.33
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 80 - "presetSelectInput.tsx"
Cohesion: 0.18
Nodes (16): CellMeal(), getKcalColorClass(), SelectEditor(), MealTypeEditor(), MealTypeEditorProps, MealTypeOption, PresetDayEditor(), PresetDayEditorProps (+8 more)

### Community 81 - "history/index.tsx"
Cohesion: 0.14
Nodes (16): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, Point, regressionSlope(), STEP_HISTORY_PAGES (+8 more)

### Community 82 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 83 - "stepsTable.tsx"
Cohesion: 0.26
Nodes (11): fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+3 more)

### Community 84 - "config/store.ts"
Cohesion: 0.22
Nodes (8): configSlice, ConfigState, defaultKeyboardCommands, initialState, KeyboardCategory, KeyboardCommandsState, mergeKeyboardCommands(), SetKeyboardCommandPayload

### Community 85 - "useAppDispatch"
Cohesion: 0.46
Nodes (5): DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), useAppDispatch()

### Community 86 - "Form"
Cohesion: 0.19
Nodes (11): react, Form, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType, FormConfig (+3 more)

### Community 87 - "authManagement/index.tsx"
Cohesion: 0.44
Nodes (7): Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 88 - "FromDate"
Cohesion: 0.21
Nodes (19): FromDate, CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail() (+11 more)

### Community 89 - "input/index.ts"
Cohesion: 0.38
Nodes (4): Numeric(), One(), Option, SelectOneInputProps

### Community 90 - "rows.ts"
Cohesion: 0.44
Nodes (9): dayBalanceWithoutMeals(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows(), fetchMeals(), useFetchMeals(), useFetchBmr(), useFetchPlaningMealsForDate() (+1 more)

### Community 91 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 92 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 93 - "text/text.tsx"
Cohesion: 0.33
Nodes (3): MultiLineTextInputProps, TextInputProps, InputTypes

### Community 95 - "state.config.keyboardCommands.tableNavigation"
Cohesion: 0.60
Nodes (5): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, state.config.keyboardCommands.tableNavigation

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 365 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `config.ts`, `Privacy & References Text`, `Package Manifest`, `queryKeys`, `dates.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `posterHeader.tsx`, `renderCommandGroup.tsx`, `useAppSelector`, `newPoint/form.ts`, `routes.ts`, `layout.ts`, `profileChart.tsx`, `data/meals.ts`, `planing.ts`, `races/index.tsx`, `useRaceDraft`, `useNotification`, `posterPreview.tsx`, `components.tsx`, `SignUpPage.tsx`, `races.ts`, `noteItem.tsx`, `useAppNavigation`, `useAppNavigation`, `info.tsx`, `presetSelectInput.tsx`, `history/index.tsx`, `stepsTable.tsx`, `useAppDispatch`, `Form`, `authManagement/index.tsx`, `FromDate`, `rows.ts`, `navigation.tsx`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13825757575757575 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `react`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `queryKeys`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `posterHeader.tsx`, `renderCommandGroup.tsx`, `react-i18next`, `dashboard/index.tsx`, `useAppSelector`, `newPoint/form.ts`, `routes.ts`, `profileChart.tsx`, `data/meals.ts`, `preset/components/form/hook.ts`, `planing.ts`, `races/index.tsx`, `numericCell.tsx`, `useRaceDraft`, `useNotification`, `raceIngredients.ts`, `posterPreview.tsx`, `components.tsx`, `SignUpPage.tsx`, `races.ts`, `noteItem.tsx`, `useAppNavigation`, `useGetAuthSession`, `notification/hook.ts`, `info.tsx`, `presetSelectInput.tsx`, `history/index.tsx`, `stepsTable.tsx`, `useAppDispatch`, `authManagement/index.tsx`, `FromDate`, `input/index.ts`, `rows.ts`, `navigation.tsx`, `text/text.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Why does `Recipe Macro Chart README` connect `recipes.ts` to `data/meals.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.1026827012025902 - nodes in this community are weakly interconnected._