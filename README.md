# HandLend


## Deployment

### Backend (FastAPI + SQLite)

1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the server (runs on `http://localhost:8000`):
   ```bash
   uvicorn main:app --reload --port 8000
   ```
*(Note: The `handlend.db` SQLite database is automatically created and seeded with demo data on the first run.)*

### Frontend (Next.js)

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd apps/frontend
   ```
2. Install Node.js dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server (runs on `http://localhost:3000`):
   ```bash
   pnpm run dev
   ```
4. For production deployment, build and then start the server:
   ```bash
   pnpm run build
   pnpm run start
   ```


HandLend is a humanitarian funding platform where donor money is not released blindly. Funds are committed to a mission, locked in escrow on Avalanche, validated through operational evidence, and surfaced to users through product-readable timelines instead of raw blockchain jargon.

This repository uses Spec-Driven Development as the operating model for HandLend itself. The three source documents for the repo are:

- `SDD Handlend.pdf`
- `Stack HandLend.pdf`
- `UX Spec _ Product Design Document.pdf`

Everything in this repo must stay consistent with those documents.

## Delivery Rules

- `SDD Handlend.md` is the implementation sequence for the application. Build one slice at a time and keep it mapped to actor and screen IDs.
- `UX Spec _ Product Design Document.md` is the UI decision reference. Every `Ant Design` pattern choice should be checked against it before implementation.
- `Ant Design` is the only approved UI component library for new UI work and UI refactors.
- `Playwright` is the mandatory browser-testing strategy for UI, navigation, form, and actor-flow verification.
- Do not start the next feature until the current one has recorded progress and a `PASS` verification report.

## Product Summary

HandLend connects three actors:

- `Donor`: chooses a disaster context, compares logistics companies, commits funds, and follows a verifiable timeline.
- `Coordinator`: registers a logistics company, publishes the operating plan, manages operators, and monitors funds and deliveries.
- `Operator`: records last-mile deliveries with QR, GPS, timestamp, offline queueing, and later synchronization.

## MVP Flow

1. A donor selects an active disaster.
2. The donor compares logistics companies and reviews a GenLayer-generated summary.
3. The donor commits funds to a mission.
4. Funds are locked in escrow on Avalanche.
5. A field operator records delivery evidence with QR, GPS, timestamp, and optional notes.
6. Synced evidence is evaluated by GenLayer.
7. Escrow releases or settles funds according to mission rules.
8. The donor and operator see simple product states such as `delivery recorded`, `evidence validated`, and `margin transferred`.

## Stack Contract

- `Next.js`: donor, coordinator, and operator interfaces; wallet flows; timeline UX; mobile/PWA behavior.
- `Python backend`: normalized domain API, persistence, sync processing, role and mission management, audit trail, onchain event indexing.
- `Avalanche`: execution and settlement layer.
- `Escrow`: trust and conditional-release mechanism.
- `GenLayer`: company scoring, evidence validation, and review/dispute intelligence.
- `Aave`: optional liquidity or operational-advance module. It is not a critical dependency for the MVP path.

## Documentation Map

- [Product Vision](docs/product/hackathon-vision.md)
- [Domain Glossary](docs/product/domain-glossary.md)
- [System Context](docs/product/system-context.md)
- [Architecture Decisions](docs/product/architecture-decisions.md)
- [System Architecture](docs/architecture.md)
- [Documentation Contracts](docs/concepts.md)
- [Artifact Source of Truth](docs/persistence.md)
- [Agent Workflow for HandLend](docs/sub-agents.md)
- [Contributor Workspace Guide](docs/installation.md)
- [Implementation Progress](progress.md)

## Initial SDD Changes

- [`changes/mission-funding-and-proof/proposal.md`](changes/mission-funding-and-proof/proposal.md)
- [`changes/logistics-operations/proposal.md`](changes/logistics-operations/proposal.md)
- [`changes/reporting-timeline/proposal.md`](changes/reporting-timeline/proposal.md)

These change sets are the initial roadmap and the primary implementation slices for the MVP.

## Documentation Rules

- Every proposal, spec, design, task list, issue, and PR must map to at least one actor.
- When relevant, work must name the affected screen IDs: `D-01..D-05`, `C-01..C-04`, `O-01..O-02`.
- Use `Ant Design` as the sole UI library and justify component decisions against `UX Spec _ Product Design Document.md`.
- Use `SDD Handlend.md` as the sequencing source for iterative delivery.
- Record current status in `progress.md` and in the corresponding `openspec/changes/*` artifacts.
- Require Playwright verification with a real browser for UI and actor-flow work before continuing to a new feature.
- Documentation must use product language for financial closure:
  `delivery recorded`, `evidence validated`, `settlement in progress`, `advance deducted`, `margin transferred`, `operation closed`.
- Do not describe Aave as a critical MVP dependency.
- Do not expose blockchain state to users without translating it into a product-readable milestone.
