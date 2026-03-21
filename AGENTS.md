# HandLend Agent Instructions

When working on this project, load the relevant skill(s) before writing code or changing product documentation.

HandLend is built iteratively from `SDD Handlend.md`. Do not start a new feature slice until the current slice has implementation evidence, a recorded verification result, and an updated progress entry.

## Source Documents

These files are the authority for the repo:

1. `SDD Handlend.pdf`
2. `Stack HandLend.pdf`
3. `UX Spec _ Product Design Document.pdf`
4. `SDD Handlend.md`
5. `UX Spec _ Product Design Document.md`

If an artifact conflicts with one of these PDFs, update the artifact to match the PDFs unless the user explicitly asks to change the product definition.

## Required Documentation Contract

All proposals, specs, designs, task lists, implementations, bugs, and PRs must reflect HandLend directly.

- Every change must map to at least one actor: `Donor`, `Coordinator`, or `Operator`.
- When applicable, every change must name the affected screens:
  `D-01`, `D-02`, `D-03`, `D-04`, `D-05`, `C-01`, `C-02`, `C-03`, `C-04`, `O-01`, `O-02`.
- Use the official vocabulary from `docs/product/domain-glossary.md`.
- Respect the stack contract:
  `Avalanche` executes and settles, `escrow` locks and releases, `GenLayer` scores and validates, `Aave` is optional for MVP.
- Prefer product language over blockchain jargon in user-facing artifacts.
- Use `Ant Design` as the only approved UI component library for new UI work and UI refactors.
- Before choosing or composing an `Ant Design` pattern, validate the interaction against `UX Spec _ Product Design Document.md`.
- Keep `progress.md` current so work can resume cleanly after interruptions.
- **ADR-009 — Glass theme:** Always use `useGlassTheme()` from `src/lib/glassTheme.ts` spread into `<ConfigProvider>`. Never override theme tokens per-component. Use `createStyles` from `antd-style` for all custom CSS.
- **ADR-010 — Shell layout:** Use `GlassShell.tsx` (sidebar + bottom nav). The coordinator entry route is `/coordinator/dashboard`, not `/coordinator/company`. Active state is detected via `usePathname()`.
- **ADR-011 — Home is Discovery Page:** `/` renders the hero + campaign grid + metrics. No role-selector card layout.
- **ADR-008 — Frontend-first mockup (highest priority):** Every screen must be fully functional using mock data from `apps/frontend/src/lib/mockData.ts`. The backend is optional. No screen may block or show an error because the backend is down. State transitions (funding, sync, validation, settlement) are simulated client-side. Always implement mock-first, backend-second.

## How To Work In This Repo

1. Identify whether the task affects product vision, domain language, specs, design, tasks, implementation, or verification.
2. Load the relevant skill from the index below.
3. Read the HandLend artifacts that govern the affected area, starting with `SDD Handlend.md` for implementation sequence and `UX Spec _ Product Design Document.md` for screen behavior.
4. If the change touches UI, plan it with `Ant Design` and validate the pattern choice against the UX spec before implementation.
5. If the change affects behavior, testing, navigation, forms, or actor flows, prepare Playwright verification that opens a real browser.
6. Make the change while preserving SDD, stack, and UX alignment.
7. Record implementation status in `progress.md` and the relevant `openspec` change artifacts.
8. Do not begin the next feature until the current one has a `PASS` verification outcome in its `verify-report`.

## Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `sdd-init` | When initializing HandLend SDD context or re-baselining project conventions. | [`skills/sdd-init/SKILL.md`](skills/sdd-init/SKILL.md) |
| `sdd-explore` | When investigating a HandLend feature, actor flow, screen, or domain ambiguity before proposing change. | [`skills/sdd-explore/SKILL.md`](skills/sdd-explore/SKILL.md) |
| `sdd-propose` | When creating or updating a HandLend change proposal with scope, actor impact, and MVP intent. | [`skills/sdd-propose/SKILL.md`](skills/sdd-propose/SKILL.md) |
| `sdd-spec` | When writing or updating HandLend requirements and scenarios tied to actors and screens. | [`skills/sdd-spec/SKILL.md`](skills/sdd-spec/SKILL.md) |
| `sdd-design` | When defining technical approach for Next.js, Python, Avalanche, escrow, GenLayer, and optional Aave integration. | [`skills/sdd-design/SKILL.md`](skills/sdd-design/SKILL.md) |
| `sdd-tasks` | When breaking a HandLend change into concrete implementation tasks. | [`skills/sdd-tasks/SKILL.md`](skills/sdd-tasks/SKILL.md) |
| `sdd-apply` | When implementing tasks in docs, frontend, backend, contracts, or workflow artifacts. | [`skills/sdd-apply/SKILL.md`](skills/sdd-apply/SKILL.md) |
| `sdd-verify` | When validating that implementation still matches the HandLend PDFs and repo artifacts. | [`skills/sdd-verify/SKILL.md`](skills/sdd-verify/SKILL.md) |
| `sdd-archive` | When archiving a completed HandLend change after implementation and verification. | [`skills/sdd-archive/SKILL.md`](skills/sdd-archive/SKILL.md) |
| `handlend-playwright` | When verifying UI flows, actor journeys, screen behavior, or browser-based acceptance criteria with Playwright. | [`skills/handlend-playwright/SKILL.md`](skills/handlend-playwright/SKILL.md) |
| `skill-registry` | When updating the project skill registry and conventions for HandLend work. | [`skills/skill-registry/SKILL.md`](skills/skill-registry/SKILL.md) |
| `issue-creation` | When creating a GitHub issue for a HandLend bug, flow gap, or feature. | [`skills/issue-creation/SKILL.md`](skills/issue-creation/SKILL.md) |
| `branch-pr` | When preparing HandLend documentation or implementation changes for review. | [`skills/branch-pr/SKILL.md`](skills/branch-pr/SKILL.md) |
