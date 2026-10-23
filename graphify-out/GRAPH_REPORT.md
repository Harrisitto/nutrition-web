# Graph Report - nutrition-web  (2026-10-23)

## Corpus Check
- 294 files · ~121,575 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1455 nodes · 4256 edges · 76 communities (60 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e28330d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Calendar WeekRow Module README
- RowInfo
- gpx.ts
- App.tsx
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- table/styles.ts
- react-i18next
- columns.tsx
- hasSubscription
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- measures.ts
- App TS Config
- dates.ts
- ConfigurationPages
- layout.ts
- Runtime Dependencies
- types/index.ts
- useAppNavigation
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- i18n/config.ts
- react
- configuration/index.tsx
- planing.ts
- useAppSelector
- state.config.keyboardCommands.tableNavigation
- useGetAuthSession
- actions.tsx
- date/index.tsx
- planing/index.tsx
- user/meals.ts
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- profile.ts
- Invite Client Flow
- races/index.tsx
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- info.tsx
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
- store/store.ts
- numericCell.tsx
- recipes.ts
- sideBar/index.tsx
- config/store.ts
- inviteClient/index.tsx
- rows.ts
- vite.config.ts
- useAppDispatch
- manage.tsx
- error/hook.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 101 edges
2. `react-i18next` - 98 edges
3. `useAppSelector` - 96 edges
4. `queryKeys()` - 84 edges
5. `FromDate` - 81 edges
6. `lucide-react` - 45 edges
7. `useGetAuthSession()` - 38 edges
8. `useLanguageCode()` - 34 edges
9. `useAppNavigation()` - 33 edges
10. `useNotification()` - 33 edges

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

## Communities (76 total, 16 thin omitted)

### Community 0 - "Calendar WeekRow Module README"
Cohesion: 0.23
Nodes (13): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+5 more)

### Community 1 - "RowInfo"
Cohesion: 0.14
Nodes (4): CellRowLabelProps, CellTextProps, RowInfo, TrainingHcRowInfo

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "App.tsx"
Cohesion: 0.24
Nodes (11): App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage, InitialAnimation() (+3 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.15
Nodes (26): calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds, Meal, MealType (+18 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.12
Nodes (26): WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES, CellDisplay, CellMeal, CellNumeric, CellPresetDay (+18 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "table/styles.ts"
Cohesion: 0.24
Nodes (8): CellDisplayProps, CellRaceProps, cellChipStyle, displayChipStyle, highlightRingOnDarkStyle, highlightRingStyle, rowLabelStyle, sectionHeaderBoxStyle

### Community 8 - "react-i18next"
Cohesion: 0.06
Nodes (77): lucide-react, react-i18next, InputComponent, Numeric(), One(), Option, SelectOneInputProps, cardStyle (+69 more)

### Community 9 - "columns.tsx"
Cohesion: 0.21
Nodes (13): @tanstack/react-table, useDaysOfWeek(), CellAutoGenerate(), CellDisplay(), CellPresetDay(), CellRace(), CellRowLabel(), features (+5 more)

### Community 10 - "hasSubscription"
Cohesion: 0.07
Nodes (34): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+26 more)

### Community 11 - "posterData.ts"
Cohesion: 0.05
Nodes (75): recharts, SectionLoading(), rasterizeSvg(), resizeImage(), svgAspectRatio(), hcToKcal(), KCAL_PER_HC_GRAM, raceHc() (+67 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (25): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+17 more)

### Community 15 - "measures.ts"
Cohesion: 0.13
Nodes (18): TABLE_ALL_MEASURES, TABLE_USER_MEASURES, CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json (+10 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.12
Nodes (26): @dnd-kit/core, FromDate, parseDateOnly(), useMonthsOfYear(), AppointmentDate(), daysUntil(), SelectDateHeader(), SelectDateHeaderProps (+18 more)

### Community 18 - "ConfigurationPages"
Cohesion: 0.33
Nodes (6): ConfigurationPages(), List(), placeholderRecipeImg, Recipes(), selectRecipes(), useFetchRecipes()

### Community 19 - "layout.ts"
Cohesion: 0.05
Nodes (87): downloadBlob(), altitudeAt(), AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, BOX_HEADER_HEIGHT (+79 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "types/index.ts"
Cohesion: 0.31
Nodes (6): CellMeal(), CellMealProps, getKcalColorClass(), ALL_IDS, AllIdsValues, MealRowInfo

### Community 22 - "useAppNavigation"
Cohesion: 0.14
Nodes (18): useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), SignOut() (+10 more)

### Community 23 - "Billing, Privacy & Deploy Docs"
Cohesion: 0.13
Nodes (19): Generate Supabase Types Workflow, EzFood HTML Entry (index.html), Nutritionist Access to Client Data, Privacy Policy (English), Supabase Data Storage in France (GDPR), Politica de Privacidad (Spanish), GitHub Pages Deployment (harrisitto.github.io/nutrition-web), Nutrition Web App (README) (+11 more)

### Community 24 - "Node TS Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 25 - "Dev Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-refresh, gh-pages, globals, postcss (+12 more)

### Community 26 - "i18n/config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 27 - "react"
Cohesion: 0.05
Nodes (62): react, MultiLineTextInputProps, TextInputProps, iconButtonStyle, primaryIconButtonStyle, Form, FormProps, useForm() (+54 more)

### Community 28 - "configuration/index.tsx"
Cohesion: 0.24
Nodes (14): react-router-dom, getTrailingRoute(), Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState() (+6 more)

### Community 29 - "planing.ts"
Cohesion: 0.36
Nodes (7): TABLE_USER_PLANING, fetchPlanningWeek(), Planing, PlanningData, selectFromPlaning(), upsertDayInWeek(), useMutatePlaning()

### Community 30 - "useAppSelector"
Cohesion: 0.19
Nodes (28): NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), queryKeys(), fetchClientThemesWithPoints(), invalidateClientAppointments(), PointKind (+20 more)

### Community 31 - "state.config.keyboardCommands.tableNavigation"
Cohesion: 0.60
Nodes (5): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, state.config.keyboardCommands.tableNavigation

### Community 32 - "useGetAuthSession"
Cohesion: 0.21
Nodes (16): DisplayNotification(), getNotificationStyle(), Disclaimer(), Title(), SignUpPage(), ConfirmSetup(), useFormSetupContext(), TABLE_ALL_NUTRITIONISTS (+8 more)

### Community 33 - "actions.tsx"
Cohesion: 0.40
Nodes (7): Context, useFormSetup(), NoClientsPage(), Fields(), Provider(), Message(), Title()

### Community 35 - "date/index.tsx"
Cohesion: 0.29
Nodes (4): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps

### Community 36 - "planing/index.tsx"
Cohesion: 0.19
Nodes (20): ChartsAppointmentProgress(), progressStyles, ThemeProgressItem(), Age(), Email(), Goal(), InfoRow(), LastSeen() (+12 more)

### Community 37 - "user/meals.ts"
Cohesion: 0.17
Nodes (19): CellPresetDayProps, SelectEditor(), MealTypeEditor(), MealTypeEditorProps, MealTypeOption, PresetDayEditor(), PresetDayEditorProps, PresetOption (+11 more)

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

### Community 43 - "profile.ts"
Cohesion: 0.12
Nodes (26): @tanstack/react-query, useLanguageCode(), SupportedLanguage, supabase, supabaseAnonKey, supabaseUrl, TABLE_ALL_MACROS, TABLE_ALL_MEALS (+18 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "races/index.tsx"
Cohesion: 0.21
Nodes (14): StepNavigation(), StepProgress(), APPOINTMENT_STEPS, AppointmentStep, FormAppointment(), PageFormAppointment(), saveErrorKey(), BackButton() (+6 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "info.tsx"
Cohesion: 0.33
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "store/store.ts"
Cohesion: 0.15
Nodes (13): react-redux, redux-persist, @reduxjs/toolkit, initialState, Notification, NotificationSlice, NotificationState, AppDispatch (+5 more)

### Community 69 - "numericCell.tsx"
Cohesion: 0.23
Nodes (9): react-dom, CellNumeric(), CellNumericProps, CellText(), getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditorProps (+1 more)

### Community 70 - "recipes.ts"
Cohesion: 0.33
Nodes (9): renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType(), ViewRecipe(), RecipeInfo, selectRecipeInfo(), useFetchRecipeInfo() (+1 more)

### Community 73 - "sideBar/index.tsx"
Cohesion: 0.27
Nodes (8): AppDashboard(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem(), useAddNotification(), useNotificationErrorQuery(), useAppDispatch()

### Community 75 - "config/store.ts"
Cohesion: 0.12
Nodes (14): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps, configSlice, ConfigState (+6 more)

### Community 77 - "inviteClient/index.tsx"
Cohesion: 0.29
Nodes (10): @supabase/supabase-js, InviteClient(), Invited(), InvitedClients(), TABLE_USER_INVITATIONS, INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH, inviteClientErrorKey() (+2 more)

### Community 78 - "rows.ts"
Cohesion: 0.29
Nodes (11): dayBalanceWithoutMeals(), CellAutoGenerateProps, AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows(), useFetchMeals(), useGeneratePlaningDay(), useFetchBmr() (+3 more)

### Community 79 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 80 - "useAppDispatch"
Cohesion: 0.48
Nodes (4): DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands()

### Community 81 - "manage.tsx"
Cohesion: 0.13
Nodes (24): AnimationLoading(), InitialAnimationProps, PropsLoading, ManageClients(), PageInviteClient(), checkUpcomingMeals(), ClosedSidebarClient(), List() (+16 more)

### Community 85 - "error/hook.ts"
Cohesion: 0.18
Nodes (5): ErrorBoundary(), parseError(), useError(), ErrorPayload, ErrorState

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 352 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `preset/components/form/hook.ts`, `Measures Page & Colors`, `table/styles.ts`, `columns.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `ConfigurationPages`, `layout.ts`, `useAppNavigation`, `i18n/config.ts`, `react`, `configuration/index.tsx`, `useGetAuthSession`, `actions.tsx`, `planing/index.tsx`, `user/meals.ts`, `profile.ts`, `races/index.tsx`, `info.tsx`, `recipes.ts`, `sideBar/index.tsx`, `config/store.ts`, `inviteClient/index.tsx`, `rows.ts`, `useAppDispatch`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `RowInfo` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `App.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `react-i18next`, `columns.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `ConfigurationPages`, `layout.ts`, `useAppNavigation`, `configuration/index.tsx`, `useGetAuthSession`, `planing/index.tsx`, `user/meals.ts`, `profile.ts`, `races/index.tsx`, `info.tsx`, `store/store.ts`, `numericCell.tsx`, `recipes.ts`, `sideBar/index.tsx`, `config/store.ts`, `inviteClient/index.tsx`, `rows.ts`, `useAppDispatch`, `manage.tsx`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.1206896551724138 - nodes in this community are weakly interconnected._
- **Why does `Recipe Macro Chart README` connect `hasSubscription` to `recipes.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.1026827012025902 - nodes in this community are weakly interconnected._