# Graph Report - nutrition-web  (2026-10-22)

## Corpus Check
- 277 files · ~115,039 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1380 nodes · 3923 edges · 71 communities (55 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7da80b40`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- layout.ts
- dashboard/index.tsx
- gpx.ts
- Form
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- react-i18next
- RowInfo
- hasSubscription
- ConfigurationPages
- chartData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- error/hook.ts
- App TS Config
- weekRow/index.tsx
- error/store.ts
- layout.ts
- Runtime Dependencies
- profile.ts
- config/store.ts
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- config.ts
- posterData.ts
- sideBar/list.tsx
- SignUpPage.tsx
- useAppSelector
- columns.tsx
- planing/index.tsx
- posterPreview.tsx
- FromDate
- notification/store.ts
- mealSelectInput.tsx
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- measures.ts
- Invite Client Flow
- supabase/types.ts
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- rows.ts
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
- queryKeys
- new.tsx
- vite.config.ts
- store/store.ts
- renderCommandGroup.tsx
- inviteClient/index.tsx

## God Nodes (most connected - your core abstractions)
1. `react` - 93 edges
2. `react-i18next` - 86 edges
3. `useAppSelector` - 83 edges
4. `queryKeys()` - 78 edges
5. `FromDate` - 74 edges
6. `useGetAuthSession()` - 38 edges
7. `lucide-react` - 36 edges
8. `useNotification()` - 31 edges
9. `useLanguageCode()` - 30 edges
10. `WeeklyMeals Table README` - 30 edges

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

## Communities (71 total, 16 thin omitted)

### Community 0 - "layout.ts"
Cohesion: 0.11
Nodes (31): altitudeAt(), BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, IntakeCard(), altitudeAxis(), boxHeight() (+23 more)

### Community 1 - "dashboard/index.tsx"
Cohesion: 0.05
Nodes (70): react, react-i18next, react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy (+62 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "Form"
Cohesion: 0.06
Nodes (48): MultiLineTextInputProps, TextInputProps, deleteButtonStyle, iconButtonStyle, primaryIconButtonStyle, Form, FormProps, useForm() (+40 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.08
Nodes (45): hcToKcal(), KCAL_PER_HC_GRAM, TrainingDay, trainingNetKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context (+37 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "react-i18next"
Cohesion: 0.06
Nodes (77): lucide-react, InitialAnimationProps, PropsLoading, SectionLoading(), BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps (+69 more)

### Community 8 - "RowInfo"
Cohesion: 0.12
Nodes (7): CellMealProps, CellNumericProps, CellRowLabelProps, CellTextProps, MealRowInfo, RowInfo, TrainingHcRowInfo

### Community 9 - "hasSubscription"
Cohesion: 0.15
Nodes (17): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, No Clients Screen README, all_nutritionist Supabase Table, Shared Form Component, Nutritionist Name Prompt (+9 more)

### Community 10 - "ConfigurationPages"
Cohesion: 0.08
Nodes (32): ConfigurationPages(), DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), List(), placeholderRecipeImg, Recipes() (+24 more)

### Community 11 - "chartData.ts"
Cohesion: 0.14
Nodes (27): recharts, assignLanes(), ChartData, ChartLandmark, ChartPoint, ChartSpan, landmarkLanes(), LandmarkOption (+19 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (24): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+16 more)

### Community 15 - "error/hook.ts"
Cohesion: 0.31
Nodes (3): ErrorBoundary(), parseError(), useError()

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "weekRow/index.tsx"
Cohesion: 0.17
Nodes (16): @dnd-kit/core, DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps, PlaningType (+8 more)

### Community 18 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 19 - "layout.ts"
Cohesion: 0.07
Nodes (48): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+40 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "profile.ts"
Cohesion: 0.12
Nodes (16): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_INVITATIONS (+8 more)

### Community 22 - "config/store.ts"
Cohesion: 0.25
Nodes (7): configSlice, defaultKeyboardCommands, initialState, KeyboardCategory, KeyboardCommandsState, mergeKeyboardCommands(), SetKeyboardCommandPayload

### Community 23 - "Billing, Privacy & Deploy Docs"
Cohesion: 0.13
Nodes (19): Generate Supabase Types Workflow, EzFood HTML Entry (index.html), Nutritionist Access to Client Data, Privacy Policy (English), Supabase Data Storage in France (GDPR), Politica de Privacidad (Spanish), GitHub Pages Deployment (harrisitto.github.io/nutrition-web), Nutrition Web App (README) (+11 more)

### Community 24 - "Node TS Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 25 - "Dev Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-refresh, gh-pages, globals, postcss (+12 more)

### Community 26 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 27 - "posterData.ts"
Cohesion: 0.30
Nodes (13): toSupportedLanguage(), altitudePoints(), buildChartData(), chartSpans(), resolveLandmarks(), useDraftChart(), PosterTotals, raceTotals() (+5 more)

### Community 28 - "sideBar/list.tsx"
Cohesion: 0.43
Nodes (6): AnimationLoading(), checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient()

### Community 29 - "SignUpPage.tsx"
Cohesion: 0.52
Nodes (5): Disclaimer(), Title(), SignUpPage(), useGetAuthInfo(), useVerifyAuth()

### Community 30 - "useAppSelector"
Cohesion: 0.19
Nodes (21): useDaysOfWeek(), useLanguageCode(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, SelectDateCalendar(), PresetDayEditor(), PresetOption (+13 more)

### Community 31 - "columns.tsx"
Cohesion: 0.13
Nodes (25): @tanstack/react-table, CellAutoGenerate(), CellDisplay(), CellDisplayProps, CellNumeric(), CellPresetDay(), CellPresetDayProps, CellRace() (+17 more)

### Community 32 - "planing/index.tsx"
Cohesion: 0.26
Nodes (15): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), NavigateButton() (+7 more)

### Community 33 - "posterPreview.tsx"
Cohesion: 0.22
Nodes (14): html-to-image, react-dom, downloadBlob(), rasterizeSvg(), resizeImage(), svgAspectRatio(), POSTER_WIDTH, renderPosterPng() (+6 more)

### Community 34 - "FromDate"
Cohesion: 0.20
Nodes (12): FromDate, parseDateOnly(), Weight(), CellAutoGenerateProps, PresetDayEditorProps, WeeklyMeals(), Resume(), CHART_COLORS (+4 more)

### Community 35 - "notification/store.ts"
Cohesion: 0.33
Nodes (5): @reduxjs/toolkit, initialState, Notification, NotificationSlice, NotificationState

### Community 37 - "mealSelectInput.tsx"
Cohesion: 0.21
Nodes (11): CellMeal(), getKcalColorClass(), getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditor(), SelectEditorProps, TextEditor() (+3 more)

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

### Community 43 - "measures.ts"
Cohesion: 0.15
Nodes (21): @supabase/supabase-js, @tanstack/react-query, SupportedLanguage, supabase, supabaseAnonKey, supabaseUrl, TABLE_ALL_NUTRITIONISTS, Database (+13 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "supabase/types.ts"
Cohesion: 0.22
Nodes (8): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesUpdate

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "rows.ts"
Cohesion: 0.37
Nodes (10): dayBalanceWithoutMeals(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows(), fetchMeals(), useFetchMeals(), useFetchOrderedMealsForId(), useFetchBmr() (+2 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 68 - "queryKeys"
Cohesion: 0.27
Nodes (12): useFetchHasSuscription(), startAuthListener(), toAuthSession(), useGetAuthSession(), useInsertAuthInfo(), useSignOut(), useMutateNutriRecipe(), queryKeys() (+4 more)

### Community 69 - "new.tsx"
Cohesion: 0.17
Nodes (20): cardStyle, fileInputStyle, ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE, ConfigRaceIngredients() (+12 more)

### Community 70 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 71 - "store/store.ts"
Cohesion: 0.21
Nodes (10): react-redux, redux-persist, DisplayNotification(), getNotificationStyle(), AppDispatch, configPersistConfig, persistor, rootReducer (+2 more)

### Community 74 - "renderCommandGroup.tsx"
Cohesion: 0.22
Nodes (7): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps, ConfigState

### Community 77 - "inviteClient/index.tsx"
Cohesion: 0.18
Nodes (19): InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH, inviteClientErrorKey() (+11 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 344 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `dashboard/index.tsx` to `Form`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `react-i18next`, `ConfigurationPages`, `chartData.ts`, `Privacy & References Text`, `Package Manifest`, `weekRow/index.tsx`, `layout.ts`, `posterData.ts`, `sideBar/list.tsx`, `SignUpPage.tsx`, `useAppSelector`, `columns.tsx`, `planing/index.tsx`, `posterPreview.tsx`, `FromDate`, `mealSelectInput.tsx`, `measures.ts`, `rows.ts`, `new.tsx`, `store/store.ts`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `layout.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._
- **Why does `react-i18next` connect `dashboard/index.tsx` to `layout.ts`, `Form`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `react-i18next`, `ConfigurationPages`, `chartData.ts`, `Privacy & References Text`, `Package Manifest`, `weekRow/index.tsx`, `layout.ts`, `config.ts`, `SignUpPage.tsx`, `useAppSelector`, `columns.tsx`, `planing/index.tsx`, `posterPreview.tsx`, `FromDate`, `mealSelectInput.tsx`, `rows.ts`, `new.tsx`, `store/store.ts`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Should `dashboard/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05425742574257426 - nodes in this community are weakly interconnected._
- **Should `Form` be split into smaller, more focused modules?**
  _Cohesion score 0.0612859097127223 - nodes in this community are weakly interconnected._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08013468013468013 - nodes in this community are weakly interconnected._