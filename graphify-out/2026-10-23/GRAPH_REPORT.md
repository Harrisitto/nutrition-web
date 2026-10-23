# Graph Report - nutrition-web  (2026-10-23)

## Corpus Check
- 294 files · ~121,631 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1453 nodes · 4245 edges · 91 communities (73 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e28330d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- layout.ts
- gpx.ts
- App.tsx
- preset/components/form/hook.ts
- Planning Calendar & Shortcuts
- Measures Page & Colors
- new.tsx
- react-i18next
- columns.tsx
- hasSubscription
- posterData.ts
- Stripe Edge Functions
- Privacy & References Text
- Package Manifest
- races.ts
- App TS Config
- dates.ts
- profileChart.tsx
- poster/constants.ts
- Runtime Dependencies
- newPoint/form.ts
- navigation/index.ts
- Billing, Privacy & Deploy Docs
- Node TS Config
- Dev Dependencies
- i18n/config.ts
- appointmentThemes/index.tsx
- authManagement/index.tsx
- planing.ts
- useAppSelector
- stopBox.tsx
- queryKeys
- actions.tsx
- text/text.tsx
- input/index.ts
- planing/index.tsx
- useLanguageCode
- Subscription SQL View
- Measures Screenshot
- NPM Scripts
- Mobile Calendar Screenshot
- Web Dashboard Screenshot
- preset.ts
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
- posterPreview.tsx
- raceDraftContext.ts
- table/styles.ts
- recipes.ts
- useRaceDraft
- useLanguageCode
- sideBar/index.tsx
- new.tsx
- renderCommandGroup.tsx
- error/store.ts
- inviteClient/index.tsx
- FromDate
- vite.config.ts
- useAppDispatch
- manage.tsx
- stepsTable.tsx
- Form
- useAppNavigation
- error/hook.ts
- measures.ts
- config/store.ts
- configuration/index.tsx
- useNotification
- notification/hook.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 102 edges
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

## Communities (91 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.28
Nodes (10): react, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType, FormConfig, FormFieldUpdate (+2 more)

### Community 1 - "layout.ts"
Cohesion: 0.16
Nodes (23): altitudeAt(), altitudeAxis(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), IntakeStop, KmRange (+15 more)

### Community 2 - "gpx.ts"
Cohesion: 0.15
Nodes (19): @we-gold/gpxjs, fileInputStyle, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey (+11 more)

### Community 3 - "App.tsx"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.09
Nodes (42): hcToKcal(), KCAL_PER_HC_GRAM, TrainingDay, trainingNetKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context (+34 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.07
Nodes (44): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core (+36 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.10
Nodes (35): APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField(), createMeasureField() (+27 more)

### Community 7 - "new.tsx"
Cohesion: 0.32
Nodes (10): rasterizeSvg(), resizeImage(), svgAspectRatio(), imagePath(), RaceIngredientImageError, RaceIngredientRow, sortByName(), useAddRaceIngredient() (+2 more)

### Community 8 - "react-i18next"
Cohesion: 0.17
Nodes (21): lucide-react, react-i18next, cardStyle, deleteButtonStyle, primaryButtonStyle, APPOINTMENT_STEPS, AppointmentStep, AddCustomPointForm() (+13 more)

### Community 9 - "columns.tsx"
Cohesion: 0.10
Nodes (21): @tanstack/react-table, useDaysOfWeek(), CellAutoGenerate(), CellDisplay(), CellMeal(), CellMealProps, getKcalColorClass(), CellRace() (+13 more)

### Community 10 - "hasSubscription"
Cohesion: 0.07
Nodes (34): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, Recipes README, Meal Type Filter, Recipe Rating, Recipe Name Search (+26 more)

### Community 11 - "posterData.ts"
Cohesion: 0.15
Nodes (23): raceHc(), toSupportedLanguage(), altitudePoints(), assignLanes(), buildChartData(), ChartData, ChartLandmark, ChartSpan (+15 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.08
Nodes (26): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+18 more)

### Community 15 - "races.ts"
Cohesion: 0.14
Nodes (17): @supabase/supabase-js, supabaseAnonKey, supabaseUrl, CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema (+9 more)

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.19
Nodes (15): @dnd-kit/core, useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps (+7 more)

### Community 18 - "profileChart.tsx"
Cohesion: 0.22
Nodes (16): recharts, ChartPoint, landmarkLanes(), ChartTooltip(), BLUE, ChartSizes, EDITOR_CHART_SIZES, GREEN (+8 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.08
Nodes (41): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+33 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "newPoint/form.ts"
Cohesion: 0.16
Nodes (15): useForm(), ValidateMaxLength(), ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig() (+7 more)

### Community 22 - "navigation/index.ts"
Cohesion: 0.27
Nodes (7): DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), NavigateButtonProps

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

### Community 27 - "appointmentThemes/index.tsx"
Cohesion: 0.14
Nodes (24): iconButtonStyle, primaryIconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline() (+16 more)

### Community 28 - "authManagement/index.tsx"
Cohesion: 0.22
Nodes (12): SignOut(), Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal() (+4 more)

### Community 29 - "planing.ts"
Cohesion: 0.18
Nodes (14): CellPresetDay(), CellPresetDayProps, PresetDayEditor(), PresetDayEditorProps, PresetOption, highlightRingOnDarkStyle, sectionHeaderBoxStyle, fetchPlanningWeek() (+6 more)

### Community 30 - "useAppSelector"
Cohesion: 0.26
Nodes (15): NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), invalidateClientAppointments(), useDeleteAppointmentPointFromAppointment(), useFetchClientAppointmentPoints(), useFetchClientThemesWithPoints() (+7 more)

### Community 31 - "stopBox.tsx"
Cohesion: 0.15
Nodes (15): BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, formatNumber(), IntakeCard(), PlacedStop, PosterIntake (+7 more)

### Community 32 - "queryKeys"
Cohesion: 0.32
Nodes (12): useFetchHasSuscription(), AuthSession, startAuthListener(), toAuthSession(), useGetAuthInfo(), useGetAuthSession(), useInsertAuthInfo(), useDeleteRaceIngredient() (+4 more)

### Community 33 - "actions.tsx"
Cohesion: 0.25
Nodes (12): ConfirmSetup(), config, Context, fieldIds, idName, useFormSetup(), useFormSetupContext(), NoClientsPage() (+4 more)

### Community 34 - "text/text.tsx"
Cohesion: 0.33
Nodes (3): MultiLineTextInputProps, TextInputProps, InputTypes

### Community 35 - "input/index.ts"
Cohesion: 0.15
Nodes (9): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps, InputComponent, Numeric(), One(), Option (+1 more)

### Community 36 - "planing/index.tsx"
Cohesion: 0.16
Nodes (24): assignErrorKey(), assignStyles, AssignThemeCard(), ChartsAppointmentProgress(), progressStyles, ThemeProgressItem(), Age(), Email() (+16 more)

### Community 37 - "useLanguageCode"
Cohesion: 0.24
Nodes (19): dayBalanceWithoutMeals(), AutoGenerateEditor(), MealTypeEditor(), MealTypeOption, useTableRows(), fetchMeals(), useFetchMeals(), useFetchOrderedMealsForId() (+11 more)

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

### Community 43 - "preset.ts"
Cohesion: 0.17
Nodes (14): @tanstack/react-query, TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_NUTRITIONISTS, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO (+6 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "races/index.tsx"
Cohesion: 0.15
Nodes (19): StepNavigation(), StepProgress(), StepSection(), FormAppointment(), PageFormAppointment(), saveErrorKey(), StepDetails(), BackButton() (+11 more)

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
Cohesion: 0.21
Nodes (10): react-redux, redux-persist, DisplayNotification(), getNotificationStyle(), AppDispatch, configPersistConfig, persistor, rootReducer (+2 more)

### Community 67 - "posterPreview.tsx"
Cohesion: 0.38
Nodes (9): downloadBlob(), POSTER_WIDTH, renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster(), raceImageFileName() (+1 more)

### Community 68 - "raceDraftContext.ts"
Cohesion: 0.18
Nodes (16): RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext, RaceDraftContextValue, DraftState(), emptyDraft(), RaceDraftProvider() (+8 more)

### Community 69 - "table/styles.ts"
Cohesion: 0.13
Nodes (18): CellAutoGenerateProps, CellDisplayProps, CellNumeric(), CellNumericProps, CellRaceProps, CellText(), CellTextProps, getRoundedNumber() (+10 more)

### Community 70 - "recipes.ts"
Cohesion: 0.24
Nodes (12): placeholderRecipeImg, renderMacroLabel(), RecipePieChart(), IngredientsList(), RecipeType(), ViewRecipe(), RecipeInfo, selectRecipeInfo() (+4 more)

### Community 71 - "useRaceDraft"
Cohesion: 0.35
Nodes (14): KmItemList(), SelectField(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput(), useItemError() (+6 more)

### Community 72 - "useLanguageCode"
Cohesion: 0.23
Nodes (13): useLanguageCode(), SupportedLanguage, supabase, useFetchRaceLandmarkOptions(), useCloneWeek(), useGeneratePlaningDay(), Preset, removePresetFromList() (+5 more)

### Community 73 - "sideBar/index.tsx"
Cohesion: 0.47
Nodes (6): AppDashboard(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem(), SidebarNavItemProps

### Community 74 - "new.tsx"
Cohesion: 0.26
Nodes (11): SectionLoading(), ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient, MAX_IMAGE_SIZE, ConfigRaceIngredients(), IngredientList() (+3 more)

### Community 75 - "renderCommandGroup.tsx"
Cohesion: 0.25
Nodes (6): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps

### Community 76 - "error/store.ts"
Cohesion: 0.15
Nodes (9): @reduxjs/toolkit, ErrorPayload, errorSlice, ErrorState, initialState, initialState, Notification, NotificationSlice (+1 more)

### Community 77 - "inviteClient/index.tsx"
Cohesion: 0.27
Nodes (12): InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), TABLE_USER_INVITATIONS, INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH (+4 more)

### Community 78 - "FromDate"
Cohesion: 0.22
Nodes (12): FromDate, parseDateOnly(), Weight(), AutoGenerateEditorProps, MealTypeEditorProps, Resume(), CHART_COLORS, MacrosBarChart() (+4 more)

### Community 79 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): rollup-plugin-visualizer, vite, @vitejs/plugin-react-swc

### Community 80 - "useAppDispatch"
Cohesion: 0.29
Nodes (8): ConfigurationPages(), DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), List(), Recipes(), useAppDispatch()

### Community 81 - "manage.tsx"
Cohesion: 0.15
Nodes (21): AnimationLoading(), InitialAnimationProps, PropsLoading, checkUpcomingMeals(), ClosedSidebarClient(), List(), OpenSidebarClient(), SingleClient() (+13 more)

### Community 82 - "stepsTable.tsx"
Cohesion: 0.31
Nodes (9): fitAltitudeMarks(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns, StepsTable() (+1 more)

### Community 84 - "useAppNavigation"
Cohesion: 0.33
Nodes (9): useAppNavigation(), PageAppointments(), AppointmentDate(), daysUntil(), itemStyles, PendingAppointment, PendingAppointmentItem(), PendingAppointments() (+1 more)

### Community 85 - "error/hook.ts"
Cohesion: 0.31
Nodes (3): ErrorBoundary(), parseError(), useError()

### Community 86 - "measures.ts"
Cohesion: 0.28
Nodes (8): TABLE_ALL_MEASURES, TABLE_USER_MEASURES, Tables, updateUserMeasure(), upsertUserMeasureInQueries(), useInsertUserMeasure(), UserMeasure, UserMeasuresData

### Community 87 - "config/store.ts"
Cohesion: 0.22
Nodes (8): configSlice, ConfigState, defaultKeyboardCommands, initialState, KeyboardCategory, KeyboardCommandsState, mergeKeyboardCommands(), SetKeyboardCommandPayload

### Community 88 - "configuration/index.tsx"
Cohesion: 0.62
Nodes (5): getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageNutritionistConfiguration()

### Community 89 - "useNotification"
Cohesion: 0.57
Nodes (5): Disclaimer(), Title(), SignUpPage(), useVerifyAuth(), useNotification()

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 355 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `react`, `gpx.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `Privacy & References Text`, `Package Manifest`, `dates.ts`, `profileChart.tsx`, `poster/constants.ts`, `newPoint/form.ts`, `navigation/index.ts`, `i18n/config.ts`, `appointmentThemes/index.tsx`, `authManagement/index.tsx`, `planing.ts`, `stopBox.tsx`, `actions.tsx`, `planing/index.tsx`, `useLanguageCode`, `races/index.tsx`, `info.tsx`, `store/store.ts`, `posterPreview.tsx`, `raceDraftContext.ts`, `table/styles.ts`, `recipes.ts`, `useRaceDraft`, `useLanguageCode`, `sideBar/index.tsx`, `new.tsx`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`, `FromDate`, `useAppDispatch`, `stepsTable.tsx`, `useAppNavigation`, `configuration/index.tsx`, `useNotification`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08521870286576169 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `gpx.ts`, `App.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `new.tsx`, `react-i18next`, `columns.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `races.ts`, `dates.ts`, `profileChart.tsx`, `poster/constants.ts`, `newPoint/form.ts`, `navigation/index.ts`, `appointmentThemes/index.tsx`, `authManagement/index.tsx`, `planing.ts`, `queryKeys`, `actions.tsx`, `text/text.tsx`, `input/index.ts`, `planing/index.tsx`, `useLanguageCode`, `preset.ts`, `races/index.tsx`, `info.tsx`, `store/store.ts`, `posterPreview.tsx`, `raceDraftContext.ts`, `table/styles.ts`, `recipes.ts`, `useRaceDraft`, `sideBar/index.tsx`, `new.tsx`, `renderCommandGroup.tsx`, `inviteClient/index.tsx`, `FromDate`, `useAppDispatch`, `manage.tsx`, `stepsTable.tsx`, `useAppNavigation`, `configuration/index.tsx`, `useNotification`, `notification/hook.ts`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.07102040816326531 - nodes in this community are weakly interconnected._
- **Why does `Recipe Macro Chart README` connect `hasSubscription` to `recipes.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.1026827012025902 - nodes in this community are weakly interconnected._