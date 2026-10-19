# Graph Report - nutrition-web  (2026-10-19)

## Corpus Check
- 278 files · ~110,910 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1333 nodes · 3724 edges · 66 communities (50 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 297,921 input · 0 output

## Community Hubs (Navigation)
- Race Planning UI
- App Routing & Pages
- Redux Store & Notifications
- Form & Text Inputs
- Training Presets & Kcal Math
- Planning Calendar & Shortcuts
- Measures Page & Colors
- Race Poster Layout Constants
- Planning Table Cells
- Meal & Preset Editors
- Settings & Recipe Docs
- Race Altitude Chart
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- Date Helpers & Auto-Generate
- App TS Config
- Date Header & Day Cells
- Recipes List & Macros
- Race Chart Styling
- Runtime Dependencies
- Client Invitations & Checkout
- Supabase Client & Types
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- i18n Configuration
- GPX Parsing
- Supabase Table Definitions
- Race Chart Data Building
- Planning Modal Editors
- Planning Row Model
- Auth & Sign-Up
- Images & Auth Session
- Query Keys & Subscription
- Client Info Fields
- Race Poster Geometry
- Race Poster Export
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- Date Input Components
- Invite Client Flow
- Race Poster Canvas
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
1. `react` - 87 edges
2. `react-i18next` - 79 edges
3. `useAppSelector` - 78 edges
4. `FromDate` - 74 edges
5. `queryKeys()` - 63 edges
6. `useGetAuthSession()` - 37 edges
7. `lucide-react` - 31 edges
8. `useNotification()` - 31 edges
9. `useLanguageCode()` - 30 edges
10. `WeeklyMeals Table README` - 30 edges

## Surprising Connections (you probably didn't know these)
- `Stripe-Supabase Integration Deployment Guide` --conceptually_related_to--> `Generate Supabase Types Workflow`  [INFERRED]
  supabase/solution/README.md → .github/workflows/supabase-types.yml
- `Generate Supabase Types Workflow` --references--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  .github/workflows/supabase-types.yml → supabase/solution/README.md
- `Image Content-Security-Policy (ezfood.fit, Supabase storage)` --references--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  index.html → supabase/solution/README.md
- `Tiered Seat Pricing (Stripe price, quantity = clients)` --conceptually_related_to--> `Nutritionist Access to Client Data`  [INFERRED]
  supabase/solution/README.md → public/privacyPolicy/langEn.txt
- `Supabase Data Storage in France (GDPR)` --conceptually_related_to--> `Supabase Project iivsjutltecehnnhmjok (sports-nutrition)`  [INFERRED]
  public/privacyPolicy/langEn.txt → supabase/solution/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Stripe subscription and seat billing flow** — supabase_solution_readme_create_stripe_checkout, supabase_solution_readme_create_stripe_portal, supabase_solution_readme_update_stripe_amount, supabase_solution_readme_seats_trigger, supabase_solution_readme_has_active_subscription [EXTRACTED 1.00]
- **Bilingual (EN/ES) public legal and nutrition notices** — public_privacypolicy_langen_privacy_policy, public_privacypolicy_langes_politica_privacidad, public_references_recipeingredientsen_nutritional_info_notice, public_references_recipeingredientses_aviso_informacion_nutricional [INFERRED 0.85]
- **Dashboard onboarding gate flow (name, subscription, payment)** — src_pages_dashboard_readme_onboarding_gate, src_pages_dashboard__components_noclientsscreen_readme_nutritionist_name_prompt, src_pages_dashboard__components_paymentscreen_readme_payment_component, src_pages_dashboard__queries_readme_hassubscription, src_pages_dashboard__components_noclientsscreen_readme_all_nutritionist_table [INFERRED 0.85]
- **Calendar week drag-and-drop clone components** — src_pages_dashboard_planing__components_calendar__components_weekrow_readme_calendarview, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_draggableweekrow, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_weekrowvisual, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_daycell, src_pages_dashboard_planing__components_calendar__components_weekrow_readme_dnd_kit_core [EXTRACTED 1.00]
- **WeeklyMeals cell + modal editor pattern** — src_pages_dashboard_planing_components_table_hooks_columns, src_pages_dashboard_planing__components_table_readme_cellpresetday, src_pages_dashboard_planing__components_table_readme_cellmeal, src_pages_dashboard_planing__components_table_readme_cellnumeric, src_pages_dashboard_planing__components_table_readme_celltext, src_pages_dashboard_planing__components_table_readme_portal [EXTRACTED 1.00]
- **Client Daily Plan View (day selection drives comment, meals, training)** — src_assets_screenshots_app_calendar_weekly_day_selector, src_assets_screenshots_app_calendar_client_daily_comment, src_assets_screenshots_app_calendar_meal_card, src_assets_screenshots_app_calendar_training_session_section [INFERRED 0.85]
- **Training load drives weekly meal levels, energy balance and macros** — src_assets_screenshots_screenshot_web_dashboard_carbs_per_training_hour, src_assets_screenshots_screenshot_web_dashboard_meal_codes, src_assets_screenshots_screenshot_web_dashboard_energy_balance, src_assets_screenshots_screenshot_web_dashboard_daily_macronutrients [INFERRED 0.75]
- **Measures page filter-visualize-edit flow** — src_assets_screenshots_screenshot_web_measures_date_range_filter, src_assets_screenshots_screenshot_web_measures_measure_time_series_chart, src_assets_screenshots_screenshot_web_measures_shown_measures_toggle_list, src_assets_screenshots_screenshot_web_measures_visible_measures_list, src_assets_screenshots_screenshot_web_measures_measure_entry_form [INFERRED 0.85]

## Communities (66 total, 16 thin omitted)

### Community 0 - "Race Planning UI"
Cohesion: 0.05
Nodes (93): lucide-react, react-i18next, AnimationLoading(), InitialAnimationProps, PropsLoading, SectionLoading(), InputComponent, Numeric() (+85 more)

### Community 1 - "App Routing & Pages"
Cohesion: 0.06
Nodes (59): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+51 more)

### Community 2 - "Redux Store & Notifications"
Cohesion: 0.05
Nodes (41): react-redux, redux-persist, @reduxjs/toolkit, DisplayNotification(), getNotificationStyle(), DisplayMealsForm(), OrderInput(), KeyboardInput() (+33 more)

### Community 3 - "Form & Text Inputs"
Cohesion: 0.08
Nodes (28): MultiLineTextInputProps, TextInputProps, Form, FormProps, useForm(), useFormInputHandler(), Field(), SwitchField() (+20 more)

### Community 4 - "Training Presets & Kcal Math"
Cohesion: 0.08
Nodes (42): hcToKcal(), KCAL_PER_HC_GRAM, TrainingDay, trainingNetKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context (+34 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "Race Poster Layout Constants"
Cohesion: 0.11
Nodes (38): BOX_GAP, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+30 more)

### Community 8 - "Planning Table Cells"
Cohesion: 0.13
Nodes (25): @tanstack/react-table, CellDisplay(), CellDisplayProps, CellMeal(), getKcalColorClass(), CellNumeric(), CellPresetDay(), CellPresetDayProps (+17 more)

### Community 9 - "Meal & Preset Editors"
Cohesion: 0.13
Nodes (28): useLanguageCode(), MealTypeEditor(), MealTypeEditorProps, MealTypeOption, PresetDayEditor(), PresetDayEditorProps, PresetOption, fetchMeals() (+20 more)

### Community 10 - "Settings & Recipe Docs"
Cohesion: 0.07
Nodes (33): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+25 more)

### Community 11 - "Race Altitude Chart"
Cohesion: 0.15
Nodes (25): recharts, assignLanes(), ChartData, ChartPoint, landmarkLanes(), LandmarkOption, ChartTooltip(), BLUE (+17 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.08
Nodes (26): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+18 more)

### Community 15 - "Date Helpers & Auto-Generate"
Cohesion: 0.20
Nodes (17): FromDate, parseDateOnly(), dayBalanceWithoutMeals(), CellAutoGenerate(), CellAutoGenerateProps, AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows() (+9 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "Date Header & Day Cells"
Cohesion: 0.17
Nodes (18): @dnd-kit/core, react, useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps (+10 more)

### Community 18 - "Recipes List & Macros"
Cohesion: 0.20
Nodes (15): List(), placeholderRecipeImg, Recipes(), Recipe Macro Chart README, renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType() (+7 more)

### Community 19 - "Race Chart Styling"
Cohesion: 0.11
Nodes (21): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, EYEBROW_FONT_SIZE, HEADER_HEIGHT, LABEL_FONT_SIZE, PLOT_RIGHT_PADDING (+13 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "Client Invitations & Checkout"
Cohesion: 0.19
Nodes (15): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH (+7 more)

### Community 22 - "Supabase Client & Types"
Cohesion: 0.13
Nodes (19): supabaseAnonKey, supabaseUrl, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums (+11 more)

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
Nodes (17): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_INVITATIONS (+9 more)

### Community 29 - "Race Chart Data Building"
Cohesion: 0.23
Nodes (16): raceHc(), toSupportedLanguage(), altitudePoints(), buildChartData(), ChartLandmark, ChartSpan, chartSpans(), resolveLandmarks() (+8 more)

### Community 30 - "Planning Modal Editors"
Cohesion: 0.22
Nodes (10): getRoundedNumber(), NumericEditor(), ModalShell(), SelectEditor(), SelectEditorProps, TextEditor(), TableSelection, useKeyboardNavigation() (+2 more)

### Community 31 - "Planning Row Model"
Cohesion: 0.13
Nodes (6): CellMealProps, CellNumericProps, CellRowLabelProps, MealRowInfo, RowInfo, TrainingHcRowInfo

### Community 32 - "Auth & Sign-Up"
Cohesion: 0.23
Nodes (11): @supabase/supabase-js, Disclaimer(), Title(), SignUpPage(), TABLE_ALL_NUTRITIONISTS, AuthSession, useGetAuthInfo(), useInsertAuthInfo() (+3 more)

### Community 33 - "Images & Auth Session"
Cohesion: 0.24
Nodes (14): rasterizeSvg(), resizeImage(), svgAspectRatio(), startAuthListener(), toAuthSession(), useGetAuthSession(), imagePath(), RaceIngredientImageError (+6 more)

### Community 34 - "Query Keys & Subscription"
Cohesion: 0.32
Nodes (8): @tanstack/react-query, useFetchHasSuscription(), SupportedLanguage, supabase, queryKeys(), Preset, removePresetFromList(), updatePresetList()

### Community 35 - "Client Info Fields"
Cohesion: 0.36
Nodes (12): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), Weight() (+4 more)

### Community 36 - "Race Poster Geometry"
Cohesion: 0.16
Nodes (14): altitudeAt(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), levelCount(), mergeRanges(), pillWidth() (+6 more)

### Community 37 - "Race Poster Export"
Cohesion: 0.40
Nodes (8): downloadBlob(), RacePosterData, renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster(), raceImageFileName()

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

### Community 45 - "Race Poster Canvas"
Cohesion: 0.29
Nodes (6): IntakeCard(), PosterIntake, LandmarkPill(), Overlay(), PosterCanvas(), StopBox()

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

- **Why does `react` connect `Date Header & Day Cells` to `Race Planning UI`, `App Routing & Pages`, `Redux Store & Notifications`, `Form & Text Inputs`, `Training Presets & Kcal Math`, `Measures Page & Colors`, `Race Poster Layout Constants`, `Planning Table Cells`, `Meal & Preset Editors`, `Race Altitude Chart`, `Privacy & References Text`, `Package Manifest`, `Date Helpers & Auto-Generate`, `Recipes List & Macros`, `Race Chart Styling`, `Client Invitations & Checkout`, `Race Chart Data Building`, `Planning Modal Editors`, `Auth & Sign-Up`, `Images & Auth Session`, `Client Info Fields`, `Race Poster Export`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Race Planning UI` be split into smaller, more focused modules?**
  _Cohesion score 0.0501453488372093 - nodes in this community are weakly interconnected._
- **Why does `react-i18next` connect `Race Planning UI` to `App Routing & Pages`, `Redux Store & Notifications`, `Form & Text Inputs`, `Training Presets & Kcal Math`, `Measures Page & Colors`, `Race Poster Layout Constants`, `Planning Table Cells`, `Meal & Preset Editors`, `Race Altitude Chart`, `Privacy & References Text`, `Package Manifest`, `Date Helpers & Auto-Generate`, `Date Header & Day Cells`, `Recipes List & Macros`, `Race Chart Styling`, `Client Invitations & Checkout`, `i18n Configuration`, `Auth & Sign-Up`, `Query Keys & Subscription`, `Client Info Fields`, `Race Poster Export`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **Should `App Routing & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.060814687320711415 - nodes in this community are weakly interconnected._
- **Why does `FromDate` connect `Date Helpers & Auto-Generate` to `Race Planning UI`, `Query Keys & Subscription`, `Client Info Fields`, `Training Presets & Kcal Math`, `Redux Store & Notifications`, `Measures Page & Colors`, `Planning Table Cells`, `Meal & Preset Editors`, `Date Header & Day Cells`, `Race Chart Styling`, `Supabase Client & Types`, `Planning Modal Editors`, `Planning Row Model`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `Redux Store & Notifications` be split into smaller, more focused modules?**
  _Cohesion score 0.051715309779825906 - nodes in this community are weakly interconnected._