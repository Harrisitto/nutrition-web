# Graph Report - nutrition-web  (2026-10-26)

## Corpus Check
- 314 files · ~130,150 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1562 nodes · 4757 edges · 87 communities (70 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 89 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01cf64ca`
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
- data/meals.ts
- poster/constants.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- posterHeader.tsx
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- inviteClient/index.tsx
- react-i18next
- dashboard/index.tsx
- user/appointments.ts
- newPoint/form.ts
- routes.ts
- layout.ts
- profileChart.tsx
- appointments/form/index.tsx
- Form
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
- useGetAuthSession
- raceIngredients.ts
- posterPreview.tsx
- RowInfo
- history/planing/index.tsx
- useNotification
- races.ts
- supabase/types.ts
- useAppNavigation
- raceIngredients.ts
- useAppSelector
- date/index.tsx
- vite.config.ts
- stepsTable.tsx
- Form
- authManagement/index.tsx
- FromDate
- input/index.ts
- FromDate
- assignTheme.tsx
- navigation.tsx

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 111 edges
2. `FromDate` - 111 edges
3. `useAppSelector` - 111 edges
4. `react` - 109 edges
5. `queryKeys()` - 94 edges
6. `lucide-react` - 52 edges
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

## Communities (87 total, 17 thin omitted)

### Community 0 - "react"
Cohesion: 0.17
Nodes (15): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+7 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (10): config, Context, fieldIds, idName, useFormSetup(), NoClientsPage(), Fields(), Provider() (+2 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "store/store.ts"
Cohesion: 0.06
Nodes (30): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), ErrorBoundary(), configSlice, ConfigState (+22 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.10
Nodes (37): hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds (+29 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.10
Nodes (31): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES (+23 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): react-range, APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField() (+27 more)

### Community 7 - "columns.tsx"
Cohesion: 0.14
Nodes (19): @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellPresetDay(), CellPresetDayProps, CellRace() (+11 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.09
Nodes (40): AddNoteForm(), AddNoteFormProps, EMPTY_NOTE, NoteForm(), NoteFieldsInputs(), NoteItem(), PRIORITY_STYLES, PriorityTag() (+32 more)

### Community 9 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 10 - "Calendar WeekRow Module README"
Cohesion: 0.23
Nodes (13): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+5 more)

### Community 11 - "posterData.ts"
Cohesion: 0.19
Nodes (19): raceHc(), toSupportedLanguage(), altitudeAt(), altitudePoints(), assignLanes(), buildChartData(), chartSpans(), landmarkLanes() (+11 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (23): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+15 more)

### Community 15 - "queryKeys"
Cohesion: 0.24
Nodes (16): @tanstack/react-query, useLanguageCode(), useFetchHasSuscription(), SupportedLanguage, supabase, useFetchRaceLandmarkOptions(), RecipeInfo, selectRecipes() (+8 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.15
Nodes (15): @dnd-kit/core, useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps, DraggableWeekRow() (+7 more)

### Community 18 - "data/meals.ts"
Cohesion: 0.13
Nodes (18): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_PLANING (+10 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.10
Nodes (32): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH, GROWN_CARD_SIZE (+24 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.15
Nodes (25): iconButtonStyle, primaryIconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline() (+17 more)

### Community 22 - "posterHeader.tsx"
Cohesion: 0.11
Nodes (21): BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, STAT_FONT_SIZE (+13 more)

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
Nodes (46): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, List(), placeholderRecipeImg, Recipes(), Recipes README (+38 more)

### Community 27 - "inviteClient/index.tsx"
Cohesion: 0.15
Nodes (16): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), KeyboardInput(), AnyKeyboardCommand (+8 more)

### Community 28 - "react-i18next"
Cohesion: 0.16
Nodes (25): lucide-react, react-i18next, cardStyle, deleteButtonStyle, primaryButtonStyle, NEXT_STATUS, Points, AddCustomPointForm() (+17 more)

### Community 29 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 30 - "user/appointments.ts"
Cohesion: 0.22
Nodes (18): NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), AppointmentStatus, invalidateClientAppointments(), PointKind, pointTable() (+10 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.16
Nodes (16): useForm(), ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig() (+8 more)

### Community 32 - "routes.ts"
Cohesion: 0.42
Nodes (6): getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageNutritionistConfiguration(), ConfigRaceIngredients()

### Community 33 - "layout.ts"
Cohesion: 0.14
Nodes (24): BOX_GAP, SPAN_BAR_GAP, altitudeAxis(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), IntakeStop (+16 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.16
Nodes (21): recharts, ChartData, ChartLandmark, ChartPoint, ChartSpan, ChartTooltip(), BLUE, ChartSizes (+13 more)

### Community 35 - "appointments/form/index.tsx"
Cohesion: 0.17
Nodes (16): StatusButton(), StepNavigation(), StepProgress(), StepSection(), APPOINTMENT_STEPS, AppointmentStep, FormAppointment(), PageFormAppointment() (+8 more)

### Community 37 - "planing.ts"
Cohesion: 0.22
Nodes (14): KCAL_PER_HC_GRAM, kcalByDate(), TrainingDay, trainingIntakeKcal(), trainingNetKcal(), fetchPlanningWeek(), orIlikeValue(), Planing (+6 more)

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
Cohesion: 0.15
Nodes (24): SectionLoading(), StepNavigation(), StepProgress(), RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext, RaceDraftContextValue (+16 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "numericCell.tsx"
Cohesion: 0.29
Nodes (8): CellNumeric(), CellText(), getRoundedNumber(), NumericEditor(), ModalShell(), TextEditor(), cellChipStyle, highlightRingStyle

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useRaceDraft"
Cohesion: 0.31
Nodes (15): InputComponent, KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput() (+7 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "useGetAuthSession"
Cohesion: 0.23
Nodes (13): ConfirmSetup(), useFormSetupContext(), TABLE_ALL_NUTRITIONISTS, TABLE_USER_INVITATIONS, AuthSession, startAuthListener(), toAuthSession(), useGetAuthSession() (+5 more)

### Community 67 - "raceIngredients.ts"
Cohesion: 0.29
Nodes (8): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 68 - "posterPreview.tsx"
Cohesion: 0.24
Nodes (10): html-to-image, react-dom, RaceChart(), POSTER_WIDTH, RacePosterData, renderPosterPng(), waitForFrames(), PosterPreview() (+2 more)

### Community 69 - "RowInfo"
Cohesion: 0.10
Nodes (13): CellMeal(), CellMealProps, getKcalColorClass(), CellNumericProps, CellTextProps, TableSelection, useKeyboardNavigation(), WeeklyMeals() (+5 more)

### Community 70 - "history/planing/index.tsx"
Cohesion: 0.11
Nodes (38): RangeDate(), Point, regressionSlope(), STEP_HISTORY_PAGES, StepHistory(), StepHistoryPages, HistoryMeasures(), UserMeasure (+30 more)

### Community 71 - "useNotification"
Cohesion: 0.24
Nodes (11): Disclaimer(), Title(), SignUpPage(), useGetAuthInfo(), useSignOut(), useVerifyAuth(), useRemoveClient(), useAddNotification() (+3 more)

### Community 72 - "races.ts"
Cohesion: 0.23
Nodes (15): downloadBlob(), RaceManager(), isMissingRaceImage(), raceImageFileName(), raceImagePath(), racesForDateRangeOptions(), selectRacesWithHc(), Tables (+7 more)

### Community 74 - "supabase/types.ts"
Cohesion: 0.10
Nodes (22): @supabase/supabase-js, supabaseAnonKey, supabaseUrl, TABLE_USER_MEASURES, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+14 more)

### Community 75 - "useAppNavigation"
Cohesion: 0.17
Nodes (15): ProtectedRoute(), ProtectedRouteProps, routeNeedsSelectedClient(), useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES (+7 more)

### Community 76 - "raceIngredients.ts"
Cohesion: 0.16
Nodes (21): fileInputStyle, rasterizeSvg(), resizeImage(), svgAspectRatio(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient (+13 more)

### Community 80 - "useAppSelector"
Cohesion: 0.13
Nodes (27): DisplayMealsForm(), OrderInput(), SelectEditor(), SelectEditorProps, MealTypeEditor(), MealTypeEditorProps, MealTypeOption, PresetDayEditor() (+19 more)

### Community 81 - "date/index.tsx"
Cohesion: 0.29
Nodes (4): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps

### Community 82 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 83 - "stepsTable.tsx"
Cohesion: 0.25
Nodes (11): fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+3 more)

### Community 86 - "Form"
Cohesion: 0.18
Nodes (13): react, MultiLineTextInputProps, TextInputProps, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+5 more)

### Community 87 - "authManagement/index.tsx"
Cohesion: 0.44
Nodes (7): Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 88 - "FromDate"
Cohesion: 0.27
Nodes (12): parseDateOnly(), CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail() (+4 more)

### Community 89 - "input/index.ts"
Cohesion: 0.38
Nodes (4): Numeric(), One(), Option, SelectOneInputProps

### Community 90 - "FromDate"
Cohesion: 0.29
Nodes (13): FromDate, dayBalanceWithoutMeals(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows(), Resume(), CHART_COLORS, MacrosBarChart() (+5 more)

### Community 91 - "assignTheme.tsx"
Cohesion: 0.60
Nodes (4): assignErrorKey(), assignStyles, AssignThemeCard(), useAssignAppointmentTheme()

### Community 92 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 365 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `react`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `config.ts`, `Privacy & References Text`, `Package Manifest`, `queryKeys`, `dates.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `posterHeader.tsx`, `recipes.ts`, `inviteClient/index.tsx`, `newPoint/form.ts`, `routes.ts`, `profileChart.tsx`, `appointments/form/index.tsx`, `races/index.tsx`, `useRaceDraft`, `useGetAuthSession`, `history/planing/index.tsx`, `useNotification`, `supabase/types.ts`, `useAppNavigation`, `raceIngredients.ts`, `useAppSelector`, `stepsTable.tsx`, `Form`, `authManagement/index.tsx`, `FromDate`, `FromDate`, `assignTheme.tsx`, `navigation.tsx`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `store/store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06376811594202898 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `react`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `queryKeys`, `dates.ts`, `data/meals.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `posterHeader.tsx`, `recipes.ts`, `inviteClient/index.tsx`, `react-i18next`, `dashboard/index.tsx`, `newPoint/form.ts`, `routes.ts`, `profileChart.tsx`, `appointments/form/index.tsx`, `races/index.tsx`, `numericCell.tsx`, `useRaceDraft`, `useGetAuthSession`, `raceIngredients.ts`, `RowInfo`, `history/planing/index.tsx`, `useNotification`, `races.ts`, `useAppNavigation`, `raceIngredients.ts`, `useAppSelector`, `stepsTable.tsx`, `authManagement/index.tsx`, `FromDate`, `input/index.ts`, `FromDate`, `assignTheme.tsx`, `navigation.tsx`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09951690821256039 - nodes in this community are weakly interconnected._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.10338164251207729 - nodes in this community are weakly interconnected._