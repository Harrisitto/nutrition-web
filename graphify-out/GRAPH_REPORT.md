# Graph Report - nutrition-web  (2026-10-26)

## Corpus Check
- 306 files · ~127,020 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1528 nodes · 4564 edges · 80 communities (62 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 84 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `18b6d5e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- noClientsScreen/index.tsx
- gpx.ts
- races.ts
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- columns.tsx
- dashboard/planing/index.tsx
- useRaceDraft
- appointments/form/index.tsx
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- queryKeys
- App TS Config
- dates.ts
- stepsTable.tsx
- poster/constants.ts
- Runtime Dependencies
- appointmentThemes/index.tsx
- navigation/index.ts
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- recipes.ts
- inviteClient/index.tsx
- newPoint/insert.tsx
- dashboard/index.tsx
- useAppSelector
- newPoint/form.ts
- configuration/index.tsx
- layout.ts
- profileChart.tsx
- recipe/index.tsx
- config/store.ts
- useLanguageCode
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- react
- Invite Client Flow
- planing.ts
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
- races.ts
- raceIngredients.ts
- posterPreview.tsx
- RowInfo
- history/planing/index.tsx
- useNotification
- input/index.ts
- useAppDispatch
- info.tsx
- vite.config.ts
- Form
- FromDate

## God Nodes (most connected - your core abstractions)
1. `useAppSelector` - 110 edges
2. `react` - 107 edges
3. `react-i18next` - 105 edges
4. `FromDate` - 98 edges
5. `queryKeys()` - 91 edges
6. `lucide-react` - 47 edges
7. `useLanguageCode()` - 39 edges
8. `useGetAuthSession()` - 38 edges
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

## Communities (80 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.25
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 2 - "gpx.ts"
Cohesion: 0.16
Nodes (18): fileInputStyle, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+10 more)

### Community 3 - "races.ts"
Cohesion: 0.21
Nodes (15): secondaryButtonStyle, RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext, RaceDraftContextValue, DraftState(), emptyDraft() (+7 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.08
Nodes (43): hcToKcal(), KCAL_PER_HC_GRAM, TrainingDay, trainingIntakeKcal(), trainingNetKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField (+35 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "columns.tsx"
Cohesion: 0.11
Nodes (26): react-dom, @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellNumeric(), CellPresetDayProps (+18 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.24
Nodes (17): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), NavigateAppointments() (+9 more)

### Community 9 - "useRaceDraft"
Cohesion: 0.36
Nodes (13): KmItemList(), SelectField(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput(), useItemError(), useKmField() (+5 more)

### Community 10 - "appointments/form/index.tsx"
Cohesion: 0.21
Nodes (14): StepProgress(), APPOINTMENT_STEPS, AppointmentStep, FormAppointment(), PageFormAppointment(), saveErrorKey(), BackButton(), StepNavigation() (+6 more)

### Community 11 - "posterData.ts"
Cohesion: 0.26
Nodes (13): raceHc(), toSupportedLanguage(), chartSpans(), resolveLandmarks(), useDraftChart(), PosterIntake, PosterTotals, raceTotals() (+5 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.08
Nodes (26): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+18 more)

### Community 15 - "queryKeys"
Cohesion: 0.07
Nodes (69): @supabase/supabase-js, @tanstack/react-query, rasterizeSvg(), resizeImage(), svgAspectRatio(), useFetchHasSuscription(), supabase, supabaseAnonKey (+61 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.15
Nodes (16): @dnd-kit/core, parseDateOnly(), useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps (+8 more)

### Community 18 - "stepsTable.tsx"
Cohesion: 0.27
Nodes (10): StepSection(), fitAltitudeMarks(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+2 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.10
Nodes (34): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+26 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.16
Nodes (21): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+13 more)

### Community 22 - "navigation/index.ts"
Cohesion: 0.18
Nodes (14): useAppNavigation(), DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), SignOut() (+6 more)

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
Nodes (33): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+25 more)

### Community 27 - "inviteClient/index.tsx"
Cohesion: 0.30
Nodes (10): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH (+2 more)

### Community 28 - "newPoint/insert.tsx"
Cohesion: 0.67
Nodes (3): fieldIds, BtnInsertAppointmentPoint(), useInsertAppointmentPoint()

### Community 29 - "dashboard/index.tsx"
Cohesion: 0.19
Nodes (18): AnimationLoading(), checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient(), PageAppointmentForm, PageAppointments (+10 more)

### Community 30 - "useAppSelector"
Cohesion: 0.07
Nodes (46): primaryIconButtonStyle, NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), AppointmentDate(), daysUntil(), itemStyles (+38 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.16
Nodes (15): useForm(), ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig() (+7 more)

### Community 32 - "configuration/index.tsx"
Cohesion: 0.25
Nodes (12): getTrailingRoute(), Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal() (+4 more)

### Community 33 - "layout.ts"
Cohesion: 0.16
Nodes (22): altitudeAxis(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), IntakeStop, KmRange, kmTicks() (+14 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.12
Nodes (30): recharts, altitudeAt(), altitudePoints(), assignLanes(), buildChartData(), ChartData, ChartLandmark, ChartPoint (+22 more)

### Community 35 - "recipe/index.tsx"
Cohesion: 0.09
Nodes (22): i18next, i18next-browser-languagedetector, List(), placeholderRecipeImg, Recipes(), Recipe Macro Chart README, renderMacroLabel(), RecipePieChart() (+14 more)

### Community 36 - "config/store.ts"
Cohesion: 0.08
Nodes (27): react-redux, redux-persist, @reduxjs/toolkit, KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState (+19 more)

### Community 37 - "useLanguageCode"
Cohesion: 0.15
Nodes (24): kcalByDate(), useLanguageCode(), CellMeal(), getKcalColorClass(), SelectEditor(), SelectEditorProps, MealTypeEditor(), MealTypeEditorProps (+16 more)

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

### Community 43 - "react"
Cohesion: 0.18
Nodes (20): lucide-react, react, cardStyle, deleteButtonStyle, primaryButtonStyle, NEXT_STATUS, StatusButton(), StepNavigation() (+12 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "planing.ts"
Cohesion: 0.23
Nodes (12): CellPresetDay(), PresetDayEditor(), PresetDayEditorProps, PresetOption, fetchPlanningWeek(), Planing, PlanningData, selectFromPlaning() (+4 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "stopBox.tsx"
Cohesion: 0.11
Nodes (21): BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, STAT_FONT_SIZE (+13 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "races.ts"
Cohesion: 0.22
Nodes (16): downloadBlob(), RaceManager(), isMissingRaceImage(), raceImageFileName(), raceImagePath(), racesForDateRangeOptions(), removeUnusedGpx(), selectRacePlan() (+8 more)

### Community 67 - "raceIngredients.ts"
Cohesion: 0.20
Nodes (13): InitialAnimationProps, PropsLoading, SectionLoading(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE (+5 more)

### Community 68 - "posterPreview.tsx"
Cohesion: 0.44
Nodes (7): POSTER_WIDTH, posterI18n(), renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster()

### Community 69 - "RowInfo"
Cohesion: 0.10
Nodes (12): CellMealProps, CellNumericProps, CellRowLabelProps, TableSelection, useKeyboardNavigation(), WeeklyMeals(), rowLabelStyle, ALL_IDS (+4 more)

### Community 70 - "history/planing/index.tsx"
Cohesion: 0.07
Nodes (51): BaseDateInputProps, RangeDate(), RangeDateProps, RangeValue, SingleDateProps, Point, regressionSlope(), STEP_HISTORY_PAGES (+43 more)

### Community 71 - "useNotification"
Cohesion: 0.24
Nodes (9): DisplayNotification(), getNotificationStyle(), Disclaimer(), Title(), SignUpPage(), useVerifyAuth(), useAddNotification(), useNotification() (+1 more)

### Community 74 - "input/index.ts"
Cohesion: 0.32
Nodes (5): InputComponent, Numeric(), One(), Option, SelectOneInputProps

### Community 75 - "useAppDispatch"
Cohesion: 0.26
Nodes (10): DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), AppDashboard(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage() (+2 more)

### Community 76 - "info.tsx"
Cohesion: 0.31
Nodes (7): react-i18next, Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 82 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 86 - "Form"
Cohesion: 0.17
Nodes (14): MultiLineTextInputProps, TextInputProps, Form, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+6 more)

### Community 90 - "FromDate"
Cohesion: 0.25
Nodes (16): FromDate, dayBalanceWithoutMeals(), Weight(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows(), Resume(), CHART_COLORS (+8 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 363 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `info.tsx` to `noClientsScreen/index.tsx`, `gpx.ts`, `races.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `useRaceDraft`, `appointments/form/index.tsx`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `stepsTable.tsx`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `navigation/index.ts`, `inviteClient/index.tsx`, `newPoint/insert.tsx`, `useAppSelector`, `newPoint/form.ts`, `configuration/index.tsx`, `profileChart.tsx`, `recipe/index.tsx`, `config/store.ts`, `useLanguageCode`, `react`, `planing.ts`, `stopBox.tsx`, `races.ts`, `raceIngredients.ts`, `posterPreview.tsx`, `history/planing/index.tsx`, `useNotification`, `useAppDispatch`, `Form`, `FromDate`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08272859216255443 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `react`, `noClientsScreen/index.tsx`, `gpx.ts`, `races.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `useRaceDraft`, `appointments/form/index.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `queryKeys`, `dates.ts`, `stepsTable.tsx`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `navigation/index.ts`, `inviteClient/index.tsx`, `dashboard/index.tsx`, `useAppSelector`, `newPoint/form.ts`, `configuration/index.tsx`, `profileChart.tsx`, `recipe/index.tsx`, `config/store.ts`, `useLanguageCode`, `planing.ts`, `stopBox.tsx`, `races.ts`, `raceIngredients.ts`, `posterPreview.tsx`, `RowInfo`, `history/planing/index.tsx`, `useNotification`, `input/index.ts`, `useAppDispatch`, `info.tsx`, `text/text.tsx`, `Form`, `FromDate`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Why does `Recipe Macro Chart README` connect `recipe/index.tsx` to `recipes.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.1026827012025902 - nodes in this community are weakly interconnected._