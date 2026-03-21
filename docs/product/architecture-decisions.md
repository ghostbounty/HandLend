# Architecture Decisions

## ADR-001: Organize around business capabilities

HandLend is structured around mission funding, field proof, and reporting rather than around blockchain vendors or framework folders.

## ADR-002: Backend is the product-readable source of truth

Onchain data is authoritative for settlement, but the frontend should read normalized state from the backend.

## ADR-003: Operator experience is offline-first

Field delivery must work under unstable connectivity and support sync after capture.

## ADR-004: GenLayer does not move funds

Validation intelligence produces decisions or recommendations, while financial execution remains in escrow logic on Avalanche.

## ADR-005: Aave is optional in MVP

Aave may support an operational advance or liquidity narrative, but the MVP demo path must succeed without deep Aave coupling.

## ADR-006: Timeline is a first-class product capability

Every meaningful domain state should map to a timeline event visible to the donor or operator.

## ADR-007: Use product language for settlement

The UI should expose understandable milestones instead of raw contract states.

## ADR-009: Glass morphism as the visual theme

All UI surfaces use a glass morphism effect via `antd-style` + `useGlassTheme()`. The hook is defined in `apps/frontend/src/lib/glassTheme.ts` and spread into `<ConfigProvider>` inside `AntdProvider.tsx`.

Rules:
- Never override `ConfigProvider` theme tokens per-component. All tokens flow from `glassTheme.ts`.
- Use `createStyles` from `antd-style` for any custom CSS. Never use raw `style={{}}` for layout or visual effects.
- The global body background is a dark teal/slate gradient (`#0f172a → #134e4a`) applied in `globals.css`.
- Glass components: Card, Modal, Alert, Button (default variant), Select, Dropdown, Switch, Progress, Popover — all inherit glass effect automatically via `ConfigProvider` classNames overrides.

## ADR-010: Sidebar + bottom-nav shell layout

The app shell (`GlassShell.tsx`) uses:
- Desktop: `Layout.Sider` (260px, glass) with logo, nav items, dark mode toggle, and CTA buttons.
- Mobile: fixed bottom nav bar with 4 items.
- Top header: sticky, glass, with search bar, wallet button, dark mode toggle, and avatar.
- `AppShell.tsx` is replaced by `GlassShell.tsx`. Do not use the old flat header layout.

Nav items and their routes:
- Donor → `/donor/disasters`
- Operator → `/operator/delivery`
- Coordinator → `/coordinator/dashboard`

## ADR-011: Home page is the Discovery Page

`/` is not a role selector. It is a full discovery experience:
- Hero section with mission image, funding progress card, and two CTA buttons.
- Category filter pills (All, Earthquake, Flood, Drought, Food).
- Campaign grid showing disasters as fundable campaigns.
- Protocol metrics footer (Total Raised, Active Missions, Verified Deliveries, Active Operators).

The old 3-card role selector is removed.

## ADR-008: Frontend-first mockup strategy (hackathon priority)

**The frontend is the primary demo artifact.** All screens must appear fully functional using local mock data, even when the backend is unavailable.

Rules:
- All pages must render with mock data by default. Backend calls are optional enhancements, not dependencies.
- Mock data lives in `apps/frontend/src/lib/mockData.ts` as the single source of fake state.
- State transitions (funding confirmation, sync, validation, settlement) must be simulated client-side with realistic delays and state changes.
- No screen should show a loading spinner that never resolves, an error state, or an empty list due to backend unavailability.
- The backend (`apps/backend/`) remains valid for integration but is never a blocker for the demo.
- Every new UI screen must work standalone before backend integration is considered.
