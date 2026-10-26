# Graph Report - nutrition-web  (2026-10-26)

## Corpus Check
- 315 files · ~130,730 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 4, .css 1)

## Summary
- 1567 nodes · 4781 edges · 98 communities (80 shown, 18 thin omitted)
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
- language.ts
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
- lucide-react
- dashboard/index.tsx
- react-i18next
- newPoint/form.ts
- routes.ts
- layout.ts
- profileChart.tsx
- user/appointments.ts
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
- inviteClient/index.tsx
- new.tsx
- posterPreview.tsx
- RowInfo
- components.tsx
- useNotification
- races.ts
- queryKeys
- supabase/types.ts
- useAppNavigation
- client.ts
- useAppNavigation
- notification/hook.ts
- info.tsx
- useAppSelector
- date/index.tsx
- useGetAuthSession
- stepsTable.tsx
- raceIngredients.ts
- assignTheme.tsx
- Form
- authManagement/index.tsx
- FromDate
- input/index.ts
- rows.ts
- error/store.ts
- navigation.tsx
- columns.tsx
- error/hook.ts
- configAppointment.ts
- mealCell.tsx
- Notification.tsx

## God Nodes (most connected - your core abstractions)
1. `react-i18next` - 112 edges
2. `FromDate` - 111 edges
3. `useAppSelector` - 111 edges
4. `react` - 110 edges
5. `queryKeys()` - 95 edges
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

## Communities (98 total, 18 thin omitted)

### Community 0 - "react"
Cohesion: 0.23
Nodes (12): react-router-dom, App(), NotFoundPage, PageAppDashboard, PageInfo, PagePrivacyPolicy, PageReferences, SignInPage (+4 more)

### Community 1 - "noClientsScreen/index.tsx"
Cohesion: 0.26
Nodes (10): config, Context, fieldIds, idName, useFormSetup(), NoClientsPage(), Fields(), Provider() (+2 more)

### Community 2 - "gpx.ts"
Cohesion: 0.18
Nodes (16): @we-gold/gpxjs, cleanName(), coursePoints(), fileBaseName(), formatElapsed(), GpxError, GpxErrorKey, GpxRacePlan (+8 more)

### Community 3 - "store/store.ts"
Cohesion: 0.23
Nodes (9): react-redux, redux-persist, mergeKeyboardCommands(), AppDispatch, configPersistConfig, persistor, rootReducer, RootState (+1 more)

### Community 4 - "preset/components/form/hook.ts"
Cohesion: 0.09
Nodes (42): hcToKcal(), calculateKcalFromMacros(), calculateDerivedState(), commentField, Context, createFieldForMeal(), createFieldForTrainingHc(), fieldIds (+34 more)

### Community 5 - "Planning Calendar & Shortcuts"
Cohesion: 0.10
Nodes (31): Keyboard Configuration README, Comment Editor Shortcuts, Global Configuration State (Redux config), Configurable Keyboard Shortcuts, WeeklyMeals Table README, addAction / onAction, ALL_IDS, APP_ROUTES.RACES (+23 more)

### Community 6 - "Measures Page & Colors"
Cohesion: 0.09
Nodes (42): react-range, APP_DOT_COLOR_CLASSES, COLOR_CLASS_TO_HEX, getChartColorFromClass(), getDeterministicMeasureColorClass(), BtnInsertMeasure(), Context, createDateField() (+34 more)

### Community 7 - "columns.tsx"
Cohesion: 0.16
Nodes (13): CellAutoGenerate(), CellAutoGenerateProps, CellDisplayProps, CellPresetDay(), CellPresetDayProps, CellRace(), CellRaceProps, cellChipStyle (+5 more)

### Community 8 - "dashboard/planing/index.tsx"
Cohesion: 0.09
Nodes (38): AnimationLoading(), AddNoteForm(), AddNoteFormProps, EMPTY_NOTE, NoteForm(), NoteFieldsInputs(), clampPriority(), priorityClassName() (+30 more)

### Community 9 - "config.ts"
Cohesion: 0.12
Nodes (7): i18next, i18next-browser-languagedetector, instances, posterI18n(), resources, savedLngKey, supportedLngs

### Community 10 - "Calendar WeekRow Module README"
Cohesion: 0.23
Nodes (13): Calendar WeekRow Module README, CalendarView.tsx, DayCell.tsx, @dnd-kit/core, DraggableWeekRow.tsx, saveDate(), useFetchPlanning, Week Cloning via Drag and Drop (+5 more)

### Community 11 - "posterData.ts"
Cohesion: 0.13
Nodes (27): raceHc(), toSupportedLanguage(), altitudeAt(), altitudePoints(), assignLanes(), buildChartData(), ChartData, ChartLandmark (+19 more)

### Community 12 - "Stripe Edge Functions"
Cohesion: 0.08
Nodes (14): corsHeaders, stripe, corsHeaders, stripe, ALLOWED_ORIGINS, corsHeaders, ReqPayload, stripe (+6 more)

### Community 13 - "Privacy & References Text"
Cohesion: 0.15
Nodes (23): useFetchTxt(), FetchText(), LangDefault(), LangEN(), LangES(), Description(), Title(), PagePrivacyPolicy() (+15 more)

### Community 14 - "Package Manifest"
Cohesion: 0.08
Nodes (27): name, private, type, version, autoprefixer, @dnd-kit/utilities, eslint, @eslint/js (+19 more)

### Community 15 - "language.ts"
Cohesion: 0.50
Nodes (5): useDaysOfWeek(), useMonthsOfYear(), SelectDateHeader(), SelectDateHeaderProps, SelectDateCalendar()

### Community 16 - "App TS Config"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, forceConsistentCasingInFileNames, jsx, lib, module, moduleDetection (+17 more)

### Community 17 - "dates.ts"
Cohesion: 0.20
Nodes (13): @dnd-kit/core, parseDateOnly(), DayCell, DayCellProps, DraggableWeekRow(), DraggableWeekRowProps, CalendarView(), CalendarViewProps (+5 more)

### Community 18 - "profile.ts"
Cohesion: 0.12
Nodes (19): TABLE_ALL_MACROS, TABLE_ALL_MEALS, TABLE_ALL_MEASURES, TABLE_ALL_USERS, TABLE_RECIPE_TYPE_MEALS, TABLE_RECIPE_TYPES, TABLE_USER_INFO, TABLE_USER_MEASURES (+11 more)

### Community 19 - "poster/constants.ts"
Cohesion: 0.08
Nodes (41): AREA_BOTTOM, AREA_TOP, AXIS_FONT_SIZE, AXIS_INK, BOX_GAP, CARD_SIZES, CONNECTOR_DOT_RADIUS, CONNECTOR_WIDTH (+33 more)

### Community 20 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @dnd-kit/core, @dnd-kit/utilities, html-to-image, i18next, i18next-browser-languagedetector, lodash, lucide-react (+14 more)

### Community 21 - "appointmentThemes/index.tsx"
Cohesion: 0.15
Nodes (22): iconButtonStyle, PageAppointmentThemes(), ListAppointmentThemes(), Theme, ListPointsFrom(), Point, PointsTimeline(), config (+14 more)

### Community 22 - "posterHeader.tsx"
Cohesion: 0.15
Nodes (15): BOX_HEADER_HEIGHT, BOX_LABEL_FONT_SIZE, BOX_PADDING, CARD_GAP, formatNumber(), IntakeCard(), PlacedStop, PosterIntake (+7 more)

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
Nodes (44): Auth Management README, App Language Switch, Logout, Stripe Customer Portal, List(), placeholderRecipeImg, Recipes(), Recipes README (+36 more)

### Community 27 - "renderCommandGroup.tsx"
Cohesion: 0.13
Nodes (13): KeyboardInput(), AnyKeyboardCommand, KeyboardCategory, KeyboardCommand, KeyboardCommandsState, RenderCommandGroupProps, configSlice, ConfigState (+5 more)

### Community 28 - "lucide-react"
Cohesion: 0.20
Nodes (18): lucide-react, cardStyle, deleteButtonStyle, primaryButtonStyle, primaryIconButtonStyle, Points, AddCustomPointForm(), AddPendingPointForm() (+10 more)

### Community 29 - "dashboard/index.tsx"
Cohesion: 0.29
Nodes (12): PageAppointmentForm, PageAppointments, PageAppointmentsCalendar, PageConfiguration, PageDashboard(), PageFormMeasure, PageFormPreset, PageNutriRaces (+4 more)

### Community 30 - "react-i18next"
Cohesion: 0.18
Nodes (17): react-i18next, NEXT_STATUS, StatusButton(), StepNavigation(), StepProgress(), StepSection(), APPOINTMENT_STEPS, AppointmentStep (+9 more)

### Community 31 - "newPoint/form.ts"
Cohesion: 0.26
Nodes (6): ValidateMinValue(), ValidateStringRequired(), Context, createInDaysField(), createPointField(), useConfig()

### Community 32 - "routes.ts"
Cohesion: 0.54
Nodes (6): getTrailingRoute(), Header(), PageAppointmentThemes, PageInviteClient, PageNutritionistConfiguration(), ConfigRaceIngredients()

### Community 33 - "layout.ts"
Cohesion: 0.16
Nodes (22): altitudeAxis(), boxHeight(), boxLabelWidth(), boxWidth(), groupByKm(), IntakeStop, KmRange, kmTicks() (+14 more)

### Community 34 - "profileChart.tsx"
Cohesion: 0.23
Nodes (15): recharts, ChartPoint, ChartTooltip(), BLUE, ChartSizes, EDITOR_CHART_SIZES, GREEN, GRID (+7 more)

### Community 35 - "user/appointments.ts"
Cohesion: 0.26
Nodes (16): NewPoint, nextPositionOf(), PendingPoint, useFormAppointmentPoints(), AppointmentStatus, fetchClientThemesWithPoints(), invalidateClientAppointments(), PointKind (+8 more)

### Community 37 - "planing.ts"
Cohesion: 0.16
Nodes (21): kcalByDate(), HistoryPlaning(), kcalStat(), PlanningDay, toItems(), KCAL_SOURCES, KcalChart(), KcalSource (+13 more)

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
Cohesion: 0.17
Nodes (21): RaceChart(), StepNavigation(), StepProgress(), RACE_STEPS, RaceStep, DraftUpdate, RaceDraftContext, RaceDraftContextValue (+13 more)

### Community 44 - "Invite Client Flow"
Cohesion: 0.43
Nodes (6): Invite Client README, Client Invite Code, invite_client RPC, Linked Clients List, Pending Invitations List, remove_client RPC

### Community 45 - "numericCell.tsx"
Cohesion: 0.31
Nodes (7): react-dom, CellNumeric(), CellNumericProps, getRoundedNumber(), NumericEditor(), ModalShell(), TextEditor()

### Community 47 - "Stripe Seats Trigger"
Cohesion: 0.67
Nodes (4): public.trigger_sync_stripe_seats(), tr_sync_stripe_seats_del, tr_sync_stripe_seats_ins, tr_sync_stripe_seats_upd

### Community 48 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, forceConsistentCasingInFileNames, strict, files, references

### Community 49 - "useRaceDraft"
Cohesion: 0.28
Nodes (15): InputComponent, Numeric(), KmItemList(), StepSection(), usePendingForm(), useRaceDraft(), NumberInput, toNumberInput() (+7 more)

### Community 51 - "App Store Compliance Docs"
Cohesion: 0.50
Nodes (4): Privacy Policy README, Privacy Policy, References Page README, Nutrition and Web Development References

### Community 66 - "inviteClient/index.tsx"
Cohesion: 0.38
Nodes (8): ConfigurationPages(), InviteClient(), Invited(), InvitedClients(), ManageClients(), PageInviteClient(), INVITATION_MESSAGE_MAX_LENGTH, INVITATION_MESSAGE_MIN_LENGTH

### Community 67 - "new.tsx"
Cohesion: 0.20
Nodes (12): InitialAnimationProps, PropsLoading, SectionLoading(), fileInputStyle, ALLOWED_IMAGE_TYPES, amountFields, AmountKey, emptyIngredient (+4 more)

### Community 68 - "posterPreview.tsx"
Cohesion: 0.42
Nodes (8): downloadBlob(), POSTER_WIDTH, renderPosterPng(), waitForFrames(), PosterPreview(), useElementWidth(), RacePoster(), raceImageFileName()

### Community 69 - "RowInfo"
Cohesion: 0.14
Nodes (9): CellRowLabel(), CellRowLabelProps, CellTextProps, TableSelection, useKeyboardNavigation(), rowLabelStyle, ALL_IDS, AllIdsValues (+1 more)

### Community 70 - "components.tsx"
Cohesion: 0.13
Nodes (30): RangeDate(), Point, regressionSlope(), STEP_HISTORY_PAGES, StepHistory(), StepHistoryPages, HistoryMeasures(), UserMeasure (+22 more)

### Community 71 - "useNotification"
Cohesion: 0.30
Nodes (9): Disclaimer(), Title(), SignUpPage(), TABLE_ALL_NUTRITIONISTS, TablesInsert, useSignOut(), useVerifyAuth(), useRemoveClient() (+1 more)

### Community 72 - "races.ts"
Cohesion: 0.24
Nodes (14): RaceManager(), isMissingRaceImage(), raceImagePath(), racesForDateRangeOptions(), removeUnusedGpx(), selectRacePlan(), selectRacesWithHc(), Tables (+6 more)

### Community 73 - "queryKeys"
Cohesion: 0.31
Nodes (10): useGetAuthInfo(), invalidateClientNotes(), useDeleteNutritionistNote(), useFetchNutritionistNotes(), useFetchNutritionistNotesForDateRange(), useFetchScheduledNutritionistNotes(), queryKeys(), useFetchClientAppointmentPoints() (+2 more)

### Community 74 - "supabase/types.ts"
Cohesion: 0.20
Nodes (9): CompositeTypes, Constants, Database, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables (+1 more)

### Community 75 - "useAppNavigation"
Cohesion: 0.22
Nodes (10): DEFAULT_ROUTE_METADATA, ROUTE_METADATA, RouteMetadata, APP_ROUTES, AppRoute, useSearchParams(), CancelPaymentPage(), PaymentRequiredPage() (+2 more)

### Community 76 - "client.ts"
Cohesion: 0.23
Nodes (10): @tanstack/react-query, SupportedLanguage, supabase, supabaseAnonKey, supabaseUrl, RecipeInfo, selectRecipes(), useFetchRecipes() (+2 more)

### Community 77 - "useAppNavigation"
Cohesion: 0.33
Nodes (9): useAppNavigation(), PageAppointments(), AppointmentDate(), daysUntil(), itemStyles, PendingAppointment, PendingAppointmentItem(), PendingAppointments() (+1 more)

### Community 78 - "notification/hook.ts"
Cohesion: 0.22
Nodes (7): @reduxjs/toolkit, useAddNotification(), useNotificationErrorQuery(), initialState, Notification, NotificationSlice, NotificationState

### Community 79 - "info.tsx"
Cohesion: 0.33
Nodes (6): Button(), ButtonProps, ButtonSize, ButtonVariant, PhoneMockup(), PageInfo()

### Community 80 - "useAppSelector"
Cohesion: 0.16
Nodes (26): useLanguageCode(), DisplayMealsForm(), OrderInput(), RenderCommandGroup(), TableCommands(), SelectEditor(), SelectEditorProps, MealTypeEditor() (+18 more)

### Community 81 - "date/index.tsx"
Cohesion: 0.29
Nodes (4): BaseDateInputProps, RangeDateProps, RangeValue, SingleDateProps

### Community 82 - "useGetAuthSession"
Cohesion: 0.23
Nodes (13): ConfirmSetup(), useFormSetupContext(), useFetchHasSuscription(), TABLE_USER_INVITATIONS, AuthSession, startAuthListener(), toAuthSession(), useGetAuthSession() (+5 more)

### Community 83 - "stepsTable.tsx"
Cohesion: 0.25
Nodes (11): fitAltitudeMarks(), GpxUpload(), StepProfile(), RaceFields(), emptyStep(), KmStartInput(), NumericColumn, numericColumns (+3 more)

### Community 84 - "raceIngredients.ts"
Cohesion: 0.28
Nodes (11): rasterizeSvg(), resizeImage(), svgAspectRatio(), AddIngredientForm(), imagePath(), RaceIngredientImageError, RaceIngredientRow, sortByName() (+3 more)

### Community 85 - "assignTheme.tsx"
Cohesion: 0.27
Nodes (10): @supabase/supabase-js, assignErrorKey(), assignStyles, AssignThemeCard(), ChartsAppointmentProgress(), progressStyles, ThemeProgressItem(), useFetchAppointmentThemes() (+2 more)

### Community 86 - "Form"
Cohesion: 0.18
Nodes (13): react, MultiLineTextInputProps, TextInputProps, FormProps, useFormInputHandler(), Field(), SwitchField(), DerivedStateUpdaterType (+5 more)

### Community 87 - "authManagement/index.tsx"
Cohesion: 0.32
Nodes (8): SignOut(), Select(), SectionTitle(), SectionTitleProps, TitleRegion(), TitleUser(), ManageAuthState(), redirectToCustomerPortal()

### Community 88 - "FromDate"
Cohesion: 0.16
Nodes (23): FromDate, CalendarAppointment, CalendarNote, formatTime(), groupByDay(), monthGrid(), shiftMonth(), DayDetail() (+15 more)

### Community 89 - "input/index.ts"
Cohesion: 0.50
Nodes (3): One(), Option, SelectOneInputProps

### Community 90 - "rows.ts"
Cohesion: 0.20
Nodes (12): dayBalanceWithoutMeals(), KCAL_PER_HC_GRAM, TrainingDay, trainingIntakeKcal(), trainingNetKcal(), AutoGenerateEditor(), AutoGenerateEditorProps, useTableRows() (+4 more)

### Community 91 - "error/store.ts"
Cohesion: 0.29
Nodes (4): ErrorPayload, errorSlice, ErrorState, initialState

### Community 92 - "navigation.tsx"
Cohesion: 0.56
Nodes (6): AppDashboard(), NavigateCalendar(), NavigateConfiguration(), NavigateDashboard(), NavigateHomePage(), SidebarNavItem()

### Community 93 - "columns.tsx"
Cohesion: 0.35
Nodes (8): @tanstack/react-table, CellDisplay(), CellText(), features, useTableColumns(), Selection, upsertDayInWeek(), useMutatePlaning()

### Community 94 - "error/hook.ts"
Cohesion: 0.31
Nodes (3): ErrorBoundary(), parseError(), useError()

### Community 95 - "configAppointment.ts"
Cohesion: 0.33
Nodes (10): useForm(), ValidateMaxLength(), Appointment, createNameField(), createScheduledOnField(), createStartTimeField(), createVideoUrlField(), fieldIds (+2 more)

### Community 96 - "mealCell.tsx"
Cohesion: 0.28
Nodes (4): CellMeal(), CellMealProps, getKcalColorClass(), MealRowInfo

## Knowledge Gaps
- **36 isolated node(s):** `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash`, `@types/react`, `@types/react-dom` (+31 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 365 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react-i18next` connect `react-i18next` to `noClientsScreen/index.tsx`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `columns.tsx`, `dashboard/planing/index.tsx`, `config.ts`, `Privacy & References Text`, `Package Manifest`, `language.ts`, `dates.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `posterHeader.tsx`, `recipes.ts`, `renderCommandGroup.tsx`, `lucide-react`, `newPoint/form.ts`, `routes.ts`, `profileChart.tsx`, `planing.ts`, `races/index.tsx`, `useRaceDraft`, `inviteClient/index.tsx`, `new.tsx`, `posterPreview.tsx`, `components.tsx`, `useNotification`, `useAppNavigation`, `info.tsx`, `useAppSelector`, `useGetAuthSession`, `stepsTable.tsx`, `assignTheme.tsx`, `Form`, `authManagement/index.tsx`, `FromDate`, `rows.ts`, `navigation.tsx`, `columns.tsx`, `configAppointment.ts`, `Notification.tsx`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **What connects `@dnd-kit/utilities`, `react-day-picker`, `@types/lodash` to the rest of the system?**
  _36 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `preset/components/form/hook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08862745098039215 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form` to `react`, `noClientsScreen/index.tsx`, `store/store.ts`, `preset/components/form/hook.ts`, `Measures Page & Colors`, `dashboard/planing/index.tsx`, `posterData.ts`, `Privacy & References Text`, `Package Manifest`, `language.ts`, `dates.ts`, `profile.ts`, `poster/constants.ts`, `appointmentThemes/index.tsx`, `recipes.ts`, `renderCommandGroup.tsx`, `lucide-react`, `dashboard/index.tsx`, `react-i18next`, `newPoint/form.ts`, `routes.ts`, `profileChart.tsx`, `planing.ts`, `races/index.tsx`, `numericCell.tsx`, `useRaceDraft`, `inviteClient/index.tsx`, `new.tsx`, `posterPreview.tsx`, `RowInfo`, `components.tsx`, `useNotification`, `races.ts`, `useAppNavigation`, `client.ts`, `notification/hook.ts`, `info.tsx`, `useAppSelector`, `useGetAuthSession`, `stepsTable.tsx`, `raceIngredients.ts`, `assignTheme.tsx`, `authManagement/index.tsx`, `FromDate`, `input/index.ts`, `rows.ts`, `navigation.tsx`, `columns.tsx`, `configAppointment.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Should `Planning Calendar & Shortcuts` be split into smaller, more focused modules?**
  _Cohesion score 0.10160427807486631 - nodes in this community are weakly interconnected._
- **Should `Measures Page & Colors` be split into smaller, more focused modules?**
  _Cohesion score 0.0861952861952862 - nodes in this community are weakly interconnected._
- **Should `dashboard/planing/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08758503401360544 - nodes in this community are weakly interconnected._