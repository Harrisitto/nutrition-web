# Graph Report - nutrition-web  (2026-10-22)

## Corpus Check
- 276 files · ~114,792 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1377 nodes · 3916 edges · 71 communities (54 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7da80b40`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- dashboard/index.tsx
- newPoint/form.ts
- appointmentThemes/index.tsx
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- react-i18next
- Form
- noClientsScreen/form.ts
- Settings & Recipe Docs
- posterData.ts
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
- date/index.tsx
- displaymealsForm.tsx
- recipe/index.tsx
- useAppSelector
- columns.tsx
- planing/index.tsx
- raceIngredients.ts
- FromDate
- notification/store.ts
- user/meals.ts
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- useGetAuthSession
- Invite Client Flow
- client.ts
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
1. `react` - 92 edges
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

## Communities (71 total, 17 thin omitted)

### Community 0 - "react"
Cohesion: 0.16
Nodes (14): react, InputComponent, Numeric(), One(), Option, SelectOneInputProps, MultiLineTextInputProps, TextInputProps (+6 more)

### Community 1 - "dashboard/index.tsx"
Cohesion: 0.05
Nodes (70): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+62 more)

### Community 2 - "newPoint/form.ts"
Cohesion: 0.20
Nodes (9): primaryIconButtonStyle, ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), fieldIds (+1 more)

### Community 3 - "appointmentThemes/index.tsx"
Cohesion: 0.17
Nodes (20): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+12 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.16
Nodes (25): calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds, Meal, MealType (+17 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (36): react-i18next, APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField() (+28 more)

### Community 7 - "react-i18next"
Cohesion: 0.05
Nodes (90): lucide-react, @we-gold/gpxjs, cardStyle, deleteButtonStyle, fileInputStyle, primaryButtonStyle, downloadBlob(), cleanName() (+82 more)

### Community 9 - "noClientsScreen/form.ts"
Cohesion: 0.24
Nodes (7): FormProps, useForm(), Field(), SwitchField(), FormConfig, config, idName

### Community 10 - "Settings & Recipe Docs"
Cohesion: 0.07
Nodes (34): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+26 more)

### Community 11 - "posterData.ts"
Cohesion: 0.07
Nodes (51): recharts, hcToKcal(), KCAL_PER_HC_GRAM, raceHc(), TrainingDay, trainingNetKcal(), calculateKcalFromMacros(), toSupportedLanguage() (+43 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.09
Nodes (25): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+17 more)

### Community 15 - "error/hook.ts"
Cohesion: 0.31
Nodes (3): ErrorBoundary(), parseError(), useError()

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "weekRow/index.tsx"
Cohesion: 0.16
Nodes (18): @dnd-kit/core, DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps, PlaningType (+10 more)

### Community 18 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 19 - "layout.ts"
Cohesion: 0.05
Nodes (86): altitudeAt(), AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE (+78 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "profile.ts"
Cohesion: 0.18
Nodes (12): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_MEASURES (+4 more)

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
Nodes (6): i18next, i18next-browser-languagedetector, instances, resources, savedLngKey, supportedLngs

### Community 27 - "date/index.tsx"
Cohesion: 0.29
Nodes (4): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps

### Community 28 - "displaymealsForm.tsx"
Cohesion: 0.48
Nodes (4): DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands()

### Community 29 - "recipe/index.tsx"
Cohesion: 0.18
Nodes (17): List(), placeholderRecipeImg, Recipes(), renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType(), ViewRecipe() (+9 more)

### Community 30 - "useAppSelector"
Cohesion: 0.33
Nodes (10): useDaysOfWeek(), useLanguageCode(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, SelectDateCalendar(), useCloneWeek(), useGeneratePlaningDay() (+2 more)

### Community 31 - "columns.tsx"
Cohesion: 0.08
Nodes (33): react-dom, @tanstack/react-table, CellAutoGenerate(), CellAutoGenerateProps, CellDisplay(), CellDisplayProps, CellNumeric(), CellNumericProps (+25 more)

### Community 32 - "planing/index.tsx"
Cohesion: 0.31
Nodes (14): Age(), Email(), Goal(), InfoRow(), LastSeen(), metricStyles, Phone(), Weight() (+6 more)

### Community 33 - "raceIngredients.ts"
Cohesion: 0.28
Nodes (11): rasterizeSvg(), resizeImage(), svgAspectRatio(), imagePath(), RaceIngredientImageError, RaceIngredientRow, sortByName(), useAddRaceIngredient() (+3 more)

### Community 34 - "FromDate"
Cohesion: 0.28
Nodes (9): FromDate, parseDateOnly(), AutoGenerateEditorProps, Resume(), CHART_COLORS, MacrosBarChart(), MacrosResume(), useFetchUserWeightForDateRange() (+1 more)

### Community 35 - "notification/store.ts"
Cohesion: 0.33
Nodes (5): @reduxjs/toolkit, initialState, Notification, NotificationSlice, NotificationState

### Community 37 - "user/meals.ts"
Cohesion: 0.14
Nodes (21): CellMeal(), getKcalColorClass(), CellPresetDay(), CellPresetDayProps, SelectEditor(), SelectEditorProps, MealTypeEditor(), MealTypeEditorProps (+13 more)

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

### Community 43 - "useGetAuthSession"
Cohesion: 0.17
Nodes (18): @supabase/supabase-js, Disclaimer(), Title(), SignUpPage(), useFetchHasSuscription(), supabase, supabaseAnonKey, supabaseUrl (+10 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "client.ts"
Cohesion: 0.15
Nodes (16): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+8 more)

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "rows.ts"
Cohesion: 0.20
Nodes (12): dayBalanceWithoutMeals(), CellMealProps, AutoGenerateEditor(), useTableRows(), MealRowInfo, TrainingHcRowInfo, fetchMeals(), useFetchMeals() (+4 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 68 - "queryKeys"
Cohesion: 0.18
Nodes (16): @tanstack/react-query, TABLE_USER_PRESET, TABLE_USER_PRESET_MEAL, useInsertAppointmentPoint(), queryKeys(), queryClient, useFetchClientAppointmentPoints(), useFetchClientPendingAppointments() (+8 more)

### Community 69 - "new.tsx"
Cohesion: 0.14
Nodes (19): AnimationLoading(), InitialAnimationProps, PropsLoading, SectionLoading(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient (+11 more)

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
Cohesion: 0.19
Nodes (17): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), TABLE_USER_INVITATIONS, INVITATION_MESSAGE_MAX_LENGTH (+9 more)

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 344 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dashboard/index.tsx`, `newPoint/form.ts`, `appointmentThemes/index.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `react-i18next`, `noClientsScreen/form.ts`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `weekRow/index.tsx`, `layout.ts`, `profile.ts`, `displaymealsForm.tsx`, `recipe/index.tsx`, `useAppSelector`, `columns.tsx`, `planing/index.tsx`, `raceIngredients.ts`, `FromDate`, `user/meals.ts`, `useGetAuthSession`, `rows.ts`, `new.tsx`, `store/store.ts`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.050505050505050504 - nodes in this community are weakly interconnected._
- **Why does `react-i18next` connect `Measures Page & Colors` to `react`, `dashboard/index.tsx`, `newPoint/form.ts`, `appointmentThemes/index.tsx`, `preset/components/form/hook.ts`, `react-i18next`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `weekRow/index.tsx`, `layout.ts`, `config.ts`, `displaymealsForm.tsx`, `recipe/index.tsx`, `useAppSelector`, `columns.tsx`, `planing/index.tsx`, `FromDate`, `user/meals.ts`, `useGetAuthSession`, `rows.ts`, `new.tsx`, `store/store.ts`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Why does `Recipe Macro Chart README` connect `Settings & Recipe Docs` to `recipe/index.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.10460992907801418 - nodes in this community are weakly interconnected._