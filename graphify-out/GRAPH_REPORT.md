# Graph Report - nutrition-web  (2026-10-19)

## Corpus Check
- 266 files · ~111,078 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1334 nodes · 3738 edges · 61 communities (45 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee431e23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Race Planning UI
- App Routing & Pages
- Redux Store & Notifications
- Form & Text Inputs
- Training Presets & Kcal Math
- Planning Calendar & Shortcuts
- Measures Page & Colors
- layout.ts
- Planning Table Cells
- Meal & Preset Editors
- Settings & Recipe Docs
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- Date Helpers & Auto-Generate
- App TS Config
- Date Header & Day Cells
- sideBar/list.tsx
- Runtime Dependencies
- Client Invitations & Checkout
- Supabase Client & Types
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- i18n Configuration
- GPX Parsing
- Supabase Table Definitions
- language.ts
- Planning Modal Editors
- Planning Row Model
- Auth & Sign-Up
- raceIngredients.ts
- queryKeys
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- Date Input Components
- Invite Client Flow
- Recipe Recommendation SQL
- Stripe Seats Trigger
- Root TS Config
- Vite Build Config
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

## God Nodes (most connected - your core abstractions)
1. `react` - 88 edges
2. `react-i18next` - 79 edges
3. `useAppSelector` - 78 edges
4. `FromDate` - 74 edges
5. `queryKeys()` - 64 edges
6. `useGetAuthSession()` - 38 edges
7. `lucide-react` - 31 edges
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

## Communities (61 total, 16 thin omitted)

### Community 0 - "Race Planning UI"
Cohesion: 0.07
Nodes (75): lucide-react, react-i18next, InputComponent, Numeric(), One(), Option, SelectOneInputProps, cardStyle (+67 more)

### Community 1 - "App Routing & Pages"
Cohesion: 0.06
Nodes (60): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+52 more)

### Community 2 - "Redux Store & Notifications"
Cohesion: 0.05
Nodes (41): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), DisplayMealsForm(), OrderInput(), KeyboardInput() (+33 more)

### Community 3 - "Form & Text Inputs"
Cohesion: 0.08
Nodes (28): react, MultiLineTextInputProps, TextInputProps, Form, FormProps, useForm(), useFormInputHandler(), Field() (+20 more)

### Community 4 - "Training Presets & Kcal Math"
Cohesion: 0.06
Nodes (54): hcToKcal(), KCAL_PER_HC_GRAM, TrainingDay, trainingNetKcal(), calculateKcalFromMacros(), List(), placeholderRecipeImg, Recipes() (+46 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "layout.ts"
Cohesion: 0.05
Nodes (86): downloadBlob(), AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE (+78 more)

### Community 8 - "Planning Table Cells"
Cohesion: 0.11
Nodes (26): @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellMeal(), getKcalColorClass(), CellPresetDay() (+18 more)

### Community 9 - "Meal & Preset Editors"
Cohesion: 0.17
Nodes (26): useLanguageCode(), AutoGenerateEditorProps, SelectEditor(), MealTypeEditor(), MealTypeOption, PresetDayEditor(), PresetOption, fetchMeals() (+18 more)

### Community 10 - "Settings & Recipe Docs"
Cohesion: 0.07
Nodes (34): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+26 more)

### Community 11 - "posterData.ts"
Cohesion: 0.08
Nodes (52): recharts, raceHc(), Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles (+44 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (25): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+17 more)

### Community 15 - "Date Helpers & Auto-Generate"
Cohesion: 0.19
Nodes (15): FromDate, dayBalanceWithoutMeals(), AutoGenerateEditor(), MealTypeEditorProps, PresetDayEditorProps, useTableRows(), WeeklyMeals(), Resume() (+7 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "Date Header & Day Cells"
Cohesion: 0.17
Nodes (16): @dnd-kit/core, parseDateOnly(), DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps (+8 more)

### Community 18 - "sideBar/list.tsx"
Cohesion: 0.33
Nodes (8): AnimationLoading(), checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient(), selectUser(), useFetchNutritionistUsers()

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "Client Invitations & Checkout"
Cohesion: 0.26
Nodes (13): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), TABLE_USER_INVITATIONS, INVITATION_MESSAGE_MAX_LENGTH (+5 more)

### Community 22 - "Supabase Client & Types"
Cohesion: 0.14
Nodes (13): @supabase/supabase-js, supabaseAnonKey, supabaseUrl, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema (+5 more)

### Community 23 - "Billing, Privacy & Deploy Docs"
Cohesion: 0.13
Nodes (19): Generate Supabase Types Workflow, EzFood HTML Entry (index.html), Nutritionist Access to Client Data, Privacy Policy (English), Supabase Data Storage in France (GDPR), Politica de Privacidad (Spanish), GitHub Pages Deployment (harrisitto.github.io/nutrition-web), Nutrition Web App (README) (+11 more)

### Community 24 - "Node TS Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 25 - "Dev Dependencies"
Cohesion: 0.10
Nodes (20): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-refresh, gh-pages, globals, postcss (+12 more)

### Community 26 - "i18n Configuration"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 27 - "GPX Parsing"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 28 - "Supabase Table Definitions"
Cohesion: 0.13
Nodes (17): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_MEASURES (+9 more)

### Community 29 - "language.ts"
Cohesion: 0.42
Nodes (6): toSupportedLanguage(), useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, SelectDateCalendar()

### Community 30 - "Planning Modal Editors"
Cohesion: 0.23
Nodes (9): react-dom, CellNumeric(), CellText(), CellTextProps, getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditorProps (+1 more)

### Community 31 - "Planning Row Model"
Cohesion: 0.13
Nodes (6): CellMealProps, CellNumericProps, CellRowLabelProps, MealRowInfo, RowInfo, TrainingHcRowInfo

### Community 32 - "Auth & Sign-Up"
Cohesion: 0.24
Nodes (10): Disclaimer(), Title(), SignUpPage(), supabase, useGetAuthInfo(), useSignOut(), useVerifyAuth(), useAddNotification() (+2 more)

### Community 33 - "raceIngredients.ts"
Cohesion: 0.14
Nodes (23): InitialAnimationProps, PropsLoading, SectionLoading(), rasterizeSvg(), resizeImage(), svgAspectRatio(), ALLOWED_IMAGE_TYPES, amountFields (+15 more)

### Community 34 - "queryKeys"
Cohesion: 0.16
Nodes (23): @tanstack/react-query, ConfirmSetup(), useFetchHasSuscription(), SupportedLanguage, TABLE_ALL_NUTRITIONISTS, AuthSession, startAuthListener(), toAuthSession() (+15 more)

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

### Community 43 - "Date Input Components"
Cohesion: 0.29
Nodes (4): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "Vite Build Config"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 341 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Form & Text Inputs` to `Race Planning UI`, `App Routing & Pages`, `Redux Store & Notifications`, `Training Presets & Kcal Math`, `Measures Page & Colors`, `layout.ts`, `Planning Table Cells`, `Meal & Preset Editors`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `Date Helpers & Auto-Generate`, `Date Header & Day Cells`, `sideBar/list.tsx`, `Client Invitations & Checkout`, `Supabase Table Definitions`, `language.ts`, `Planning Modal Editors`, `Auth & Sign-Up`, `raceIngredients.ts`, `queryKeys`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Race Planning UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06534727408513816 - nodes in this community are weakly interconnected._
- **Why does `react-i18next` connect `Race Planning UI` to `App Routing & Pages`, `Redux Store & Notifications`, `Form & Text Inputs`, `Training Presets & Kcal Math`, `Measures Page & Colors`, `layout.ts`, `Planning Table Cells`, `Meal & Preset Editors`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `Date Helpers & Auto-Generate`, `Date Header & Day Cells`, `Client Invitations & Checkout`, `i18n Configuration`, `language.ts`, `Auth & Sign-Up`, `raceIngredients.ts`, `queryKeys`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Should `App Routing & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05994397759103642 - nodes in this community are weakly interconnected._
- **Why does `FromDate` connect `Date Helpers & Auto-Generate` to `Race Planning UI`, `queryKeys`, `Redux Store & Notifications`, `Training Presets & Kcal Math`, `Measures Page & Colors`, `layout.ts`, `Planning Table Cells`, `Meal & Preset Editors`, `posterData.ts`, `Date Header & Day Cells`, `language.ts`, `Planning Modal Editors`, `Planning Row Model`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Redux Store & Notifications` be split into smaller, more focused modules?**
  _Cohesion score 0.051715309779825906 - nodes in this community are weakly interconnected._