Perfecto. Te dejo un **paquete SDD inicial completo** para HandLend, ya aterrizado a **Next.js \+ Python**, usando como base directa los flujos de donante, coordinador y operador del UX Spec, además de la distribución tecnológica Avalanche \+ escrow \+ GenLayer \+ Aave del otro PDF. El producto está planteado como una plataforma de ayuda humanitaria donde el donante selecciona una operación, aporta fondos, y luego sigue un timeline verificable; mientras tanto, el operador registra entregas con QR, GPS, timestamp, soporte offline y sincronización posterior.

La arquitectura funcional que voy a reflejar en los documentos es esta: **Avalanche ejecuta y liquida**, **escrow retiene y libera fondos según reglas**, **GenLayer analiza empresas y valida evidencia**, y **Aave entra como módulo de liquidez o narrativa de lending, no como dependencia crítica del MVP**. Esa separación está bastante alineada con los PDFs y además evita que el proyecto se rompa por ambición excesiva en hackathon.

---

# **Estructura recomendada**

docs/  
  product/  
    hackathon-vision.md  
    domain-glossary.md  
    system-context.md  
    architecture-decisions.md

changes/  
  mission-funding-and-proof/  
    proposal.md  
    spec.md  
    design.md  
    tasks.md

  logistics-operations/  
    proposal.md  
    spec.md  
    design.md  
    tasks.md

  reporting-timeline/  
    proposal.md  
    spec.md  
    design.md  
    tasks.md

Para hackathon, esta estructura es mejor que abrir seis o siete módulos hiperfragmentados. El “vertical slice” fuerte del MVP es: el donante selecciona un desastre y una empresa, aporta, el operador registra evidencia, GenLayer valida, y el escrow en Avalanche liquida o libera fondos. Eso concentra justo lo más demoable del proyecto.

---

# **1\) `docs/product/hackathon-vision.md`**

\# HandLend – Hackathon Vision

\#\# One-liner  
HandLend is a conditional funding protocol for humanitarian logistics where donations are not released blindly: funds are locked in escrow, field evidence is captured during last-mile delivery, AI-assisted validation reviews the evidence, and settlement is executed onchain.

\#\# Problem  
In natural disasters, donors often lack confidence that funds are being used effectively in the final mile. Traditional donation flows provide weak transparency, delayed reporting, and little connection between funding and verifiable delivery.

\#\# Product vision  
HandLend enables donors to:  
\- select a disaster context,  
\- compare logistics operators,  
\- review an AI-generated operational summary,  
\- fund a specific mission,  
\- follow a transparent timeline of delivery evidence and settlement.

It enables coordinators to:  
\- register a logistics organization,  
\- submit an operational plan,  
\- manage field operators,  
\- monitor operational progress.

It enables operators to:  
\- capture delivery proof with minimal friction,  
\- work in the field with offline tolerance,  
\- sync later without losing operational evidence.

\#\# MVP promise
A donor selects an active disaster, reviews the Campaign Pool status, and deposits funds into the pool escrow. The pool allocates to logistics coordinators only after they submit validated delivery evidence. A field operator records delivery evidence with QR \+ GPS \+ timestamp. After validation, settlement is executed and the system explains the financial outcome in simple product language.

\#\# Core differentiator  
This is not “donation tracking” only.  
This is programmable humanitarian financing with conditional release based on operational proof.

\#\# Role of the stack  
\- Next.js: donor/coordinator/operator interface, PWA behavior, timeline UX, wallet flows.  
\- Python backend: domain API, orchestration, persistence, sync processing, audit trail, blockchain indexing.  
\- Avalanche: escrow, onchain events, settlement execution.  
\- GenLayer: logistics scoring, evidence validation, dispute/review layer.  
\- Aave: optional liquidity / operational advance narrative, not critical path for MVP.

\#\# Demo sentence  
A donor locks funds for a humanitarian mission, a field operator records delivery from the shelter, the system validates the evidence, and escrow releases the corresponding payment onchain.

Esta visión respeta exactamente el objetivo UX del producto: confianza del donante, claridad del coordinador y robustez operativa del operador incluso sin internet.

---

# **2\) `docs/product/domain-glossary.md`**

\# Domain Glossary

\#\# Disaster  
A natural disaster context that groups missions, logistics demand, urgency, and available operators.

\#\# Logistics Company  
An organization capable of executing humanitarian delivery operations for a selected disaster.

\#\# Coordinator  
A legal representative of a logistics company who registers the organization, publishes an operational plan, and manages operators.

\#\# Operator  
A field worker who performs last-mile delivery and captures delivery evidence.

\#\# Mission  
A funded humanitarian operation associated with one disaster and one logistics company.

\#\# Donation  
User-facing term for a donor contribution.  
Note: in domain terms, the system treats it as mission funding committed under conditions.

\#\# Funding Commitment  
A donor’s confirmed economic contribution associated with a mission.

\#\# Escrow  
Smart-contract mechanism that locks funds and releases them only if the mission reaches valid proof conditions.

\#\# Operational Advance  
Optional early capital made available for execution before final settlement.

\#\# Margin Transfer  
The final amount transferred after valid delivery and deduction of any operational advance.

\#\# Delivery Event  
A field event representing a delivery attempt or completed handoff.

\#\# Evidence Bundle  
The minimum proof package attached to a delivery event.  
Typical elements:  
\- operator ID  
\- lot ID  
\- QR result  
\- timestamp  
\- GPS  
\- optional note/photo

\#\# Validation Decision  
The result of semantic evaluation over a delivery evidence bundle.  
Possible outcomes:  
\- accepted  
\- requires\_review  
\- rejected

\#\# Timeline Event  
A user-visible state change that helps donors and operators understand what happened and when.

\#\# Settlement  
The contractual financial closure triggered after a validated delivery event.

\#\# GenLayer Analysis  
AI-assisted explanation of company capability, trust level, risks, limitations, or delivery evidence plausibility.

\#\# Sync Queue  
Client-side offline storage of delivery events awaiting transmission.

Esto te ayuda a cortar uno de los riesgos UX más fuertes del documento: la confusión entre donación, financiamiento, préstamo operativo y liquidación.

---

# **3\) `docs/product/system-context.md`**

\# System Context

\#\# Actors  
1\. Donor  
2\. Coordinator  
3\. Operator  
4\. Blockchain network  
5\. Validation layer  
6\. Wallet provider

\#\# High-level user journeys

\#\#\# Donor journey  
1\. Explore active disasters  
2\. Compare logistics companies  
3\. Review company profile and AI-generated analysis  
4\. Connect wallet and commit funds  
5\. View reporting timeline and evidence trail

\#\#\# Coordinator journey  
1\. Register legal/company profile  
2\. Publish operational plan  
3\. Manage field operators  
4\. Monitor mission progress

\#\#\# Operator journey  
1\. Open field delivery screen  
2\. Input or scan delivery data  
3\. Capture QR, GPS, timestamp  
4\. Save locally if offline  
5\. Sync pending events later  
6\. Review validation and settlement state

\#\# System responsibilities by layer

\#\#\# Frontend (Next.js)  
\- Present donor decision-making interfaces  
\- Provide wallet interaction  
\- Offer coordinator admin UX  
\- Provide operator field UI  
\- Support offline queue for delivery capture  
\- Render readable timeline and settlement states

\#\#\# Backend (Python)  
\- Manage users, roles, missions, deliveries, evidence, timeline  
\- Validate request integrity and permissions  
\- Persist domain state  
\- Accept synced delivery events  
\- Orchestrate calls to validation layer  
\- Index onchain events into product-readable form  
\- Expose API to frontend

\#\#\# Onchain  
\- Lock funds in escrow  
\- Record contribution commitment  
\- Emit settlement-related events  
\- Release or transfer value according to validated state

\#\#\# Validation layer  
\- Analyze logistics companies for donor-facing confidence summaries  
\- Evaluate evidence plausibility after delivery sync  
\- Return structured decisions usable by backend rules

\#\# Design principle  
Users should not need to understand blockchain terminology to understand mission status.  
The system must translate technical settlement logic into simple product states.

La parte de “no exponer la lógica blockchain solo como texto técnico” sale clarísima del flujo O-02 y de los requisitos UX transversales.

---

# **4\) `docs/product/architecture-decisions.md`**

\# Architecture Decisions

\#\# ADR-001 – Business capability over technology-first structure  
The project is organized around mission funding, field proof, and reporting, not around blockchain vendors or framework folders.

\#\# ADR-002 – Backend is the product-readable source of truth  
Onchain data is authoritative for settlement, but frontend reads normalized state from the backend to simplify UX and reduce wallet/network coupling.

\#\# ADR-003 – Operator experience is offline-first  
Field delivery must work under unstable connectivity. The operator can register events offline and sync later.

\#\# ADR-004 – GenLayer does not move funds  
Validation intelligence produces recommendations or decisions. Financial execution remains in escrow logic on Avalanche.

\#\# ADR-005 – Aave is optional in MVP critical path  
Aave may be represented as a liquidity or operational advance module, but the main demo flow must succeed without deep dependency on it.

\#\# ADR-006 – Timeline is a first-class product capability  
Every meaningful domain state must map to a timeline event visible to the donor or operator.

\#\# ADR-007 – Use product language for financial closure  
Instead of exposing raw contract states, the UI uses understandable milestones:  
\- delivery recorded  
\- evidence validated  
\- settlement in progress  
\- advance deducted  
\- margin transferred  
\- operation closed

Estas decisiones salen casi calcadas de la combinación entre el PDF técnico y el UX Spec del operador y del donante.

---

## **Ahora sí: los `changes/`**

---

# **5\) `changes/mission-funding-and-proof/proposal.md`**

\# Proposal: Mission Funding and Proof

\#\# Why  
Donors need a trustworthy way to fund humanitarian logistics and verify what happens after their contribution. The system must tie funding to a specific mission and later expose traceable delivery evidence.

\#\# Problem  
Current donation experiences often disconnect contribution, execution, and proof. Users do not clearly understand:  
\- who is executing,  
\- what plan is being funded,  
\- what happened after payment,  
\- whether the delivery was actually completed.

\#\# Proposed change  
Implement the main MVP vertical slice:  
1\. donor selects a disaster,  
2\. donor compares logistics companies,  
3\. donor reviews a company profile with GenLayer analysis,  
4\. donor commits funds through wallet flow,  
5\. funds are associated with an escrow-backed mission,  
6\. operator records delivery proof,  
7\. backend processes validation decision,  
8\. timeline reflects progress and settlement outcome.

\#\# Value  
\- Gives a compelling demo narrative  
\- Aligns funding with verifiable execution  
\- Creates transparency after contribution  
\- Connects UX, backend, AI validation, and blockchain settlement in one coherent flow

\#\# In scope  
\- D-01 to D-05 donor flow  
\- O-01 capture and sync basics  
\- O-02 settlement state explanation  
\- backend API for missions, evidence, and timeline  
\- escrow-triggered status representation

\#\# Out of scope  
\- advanced DeFi integration  
\- full dispute resolution workflow  
\- multi-step compliance/KYC automation  
\- complex multi-beneficiary routing

---

# **6\) `changes/mission-funding-and-proof/spec.md`**

\# Spec: Mission Funding and Proof

\#\# Actors  
\- Donor  
\- Operator  
\- Backend system  
\- Validation layer  
\- Escrow contract

\#\# Preconditions
\- At least one disaster is published with an active Campaign Pool
\- At least one logistics company is registered as a capacity provider for that disaster (visible as reference, not as a required selection step)
\- Donor has access to a wallet
\- Operator account exists and is assigned to a coordinator mission

\#\# User story 1
As a donor, I want to select a disaster and contribute to its Campaign Pool so I know my funds are available for the emergency, with coordinators visible as optional reference.

\#\#\# Acceptance criteria
1\. Given a donor opens the system, when active disasters are displayed, then the donor can select one disaster context.
2\. Given a disaster is selected, when the campaign view opens, then the UI must prioritise the Campaign Pool status (total funds, goal, urgency) above any company list.
3\. Given a company profile is shown, when the donor reviews it, then the UI must expose capacity, trust, risks, operational plan, and AI-generated analysis summary — but must NOT include a "Donate to this company" CTA.
4\. Given the donor confirms a contribution, when the transaction succeeds, then the commitment is bound to the Disaster Pool (Disaster ID), not to a single logistics company.

\#\# User story 2  
As a donor, I want to commit funds with clear feedback so I know my contribution was registered successfully.

\#\#\# Acceptance criteria  
1\. Given the donor is in the wallet screen, when wallet is disconnected, then the UI must clearly show connection is required.  
2\. Given the wallet is connected, when the donor enters a valid amount, then the system must allow transaction confirmation.  
3\. Given the donor confirms the transaction, when signature is pending, sent, confirmed, or failed, then the UI must show the corresponding state.  
4\. Given the transaction succeeds, then the system must:  
   \- persist the funding commitment,  
   \- associate it with the selected mission context,  
   \- provide immediate access to the reporting timeline.

\#\# User story 3  
As an operator, I want to register a delivery event with minimal friction so that field proof can be captured under real working conditions.

\#\#\# Acceptance criteria  
1\. The operator capture screen must support:  
   \- operator ID  
   \- lot ID  
   \- QR result  
   \- automatic or generated timestamp  
   \- GPS status  
2\. If there is no connectivity, the event must be stored locally without loss.  
3\. Each locally stored event must display a sync state:  
   \- pending  
   \- sending  
   \- synced  
   \- error  
   \- requires\_review  
4\. The operator must have a visible sync action.

\#\# User story 4  
As a donor, I want to view the mission timeline so I can understand what happened after my funding.

\#\#\# Acceptance criteria  
1\. The timeline must show mission-relevant events in chronological order.  
2\. Each event must include a readable label and timestamp.  
3\. Evidence-related events must provide enough summary to understand operational progress.  
4\. Settlement-related events must use product language, not only contract language.

\#\# Business rules  
\- A funding commitment is associated with a Disaster Pool. The allocation to specific logistics companies is handled by the protocol based on validated delivery events.
\- A delivery event cannot be settled before evidence validation completes.  
\- Validation decisions may be accepted, requires\_review, or rejected.  
\- Settlement explanation must distinguish operational advance deduction from final transfer.

\#\# Non-functional requirements  
\- Operator flow must remain usable under poor connectivity.  
\- Main donor states must always be visible: selected context, wallet state, transaction state, timeline state.  
\- The system must minimize manual typing for field operations.

\#\# Error states  
\- wallet disconnected  
\- invalid amount  
\- insufficient funds  
\- signature rejected  
\- sync failed  
\- GPS permission denied  
\- evidence requires review  
\- company data incomplete

Esto está directamente anclado en las pantallas D-01 a D-05, O-01 y O-02 del PDF UX.

---

# **7\) `changes/mission-funding-and-proof/design.md`**

\# Design: Mission Funding and Proof

\#\# Technical objective  
Implement a vertical slice that proves the end-to-end mission lifecycle from donor selection to funding, field evidence, validation, and settlement visibility.

\#\# Suggested stack  
\- Frontend: Next.js App Router  
\- API: FastAPI  
\- Database: PostgreSQL  
\- Client offline storage: IndexedDB  
\- Blockchain integration: Avalanche-compatible contract client  
\- Async jobs: background worker for validation and chain indexing

\#\# Frontend modules  
\- /donor/disasters  
\- /donor/companies  
\- /donor/company/\[id\]  
\- /donor/fund  
\- /donor/timeline/\[missionId\]  
\- /operator/delivery  
\- /operator/settlement/\[eventId\]

\#\# Backend modules  
\- disasters  
\- companies  
\- missions  
\- contributions  
\- deliveries  
\- evidence  
\- validations  
\- settlements  
\- timeline

\#\# Core entities  
\- Disaster  
\- LogisticsCompany  
\- CompanyAssessment  
\- Mission  
\- FundingCommitment  
\- DeliveryEvent  
\- EvidenceBundle  
\- ValidationDecision  
\- SettlementRecord  
\- TimelineEvent

\#\# API sketch

\#\#\# Donor-facing  
GET /api/disasters  
GET /api/disasters/{id}/companies  
GET /api/companies/{id}  
POST /api/contributions/intents  
POST /api/contributions/confirm  
GET /api/missions/{id}/timeline

\#\#\# Operator-facing  
POST /api/deliveries  
POST /api/deliveries/sync-batch  
GET /api/deliveries/{id}/settlement-state

\#\#\# Internal/process  
POST /api/internal/validations/ingest  
POST /api/internal/settlements/update

\#\# Sync model  
1\. operator creates local event  
2\. event is persisted in IndexedDB  
3\. sync batch sends pending events  
4\. backend deduplicates by client\_event\_id  
5\. backend stores evidence bundle  
6\. backend requests semantic validation  
7\. backend updates timeline and settlement state

\#\# State translation  
Raw technical events are mapped to user-facing labels:  
\- funding\_confirmed  
\- delivery\_recorded  
\- evidence\_under\_review  
\- evidence\_validated  
\- settlement\_processing  
\- advance\_deducted  
\- margin\_transferred  
\- mission\_closed

\#\# Smart contract role  
The contract handles:  
\- fund lock  
\- conditional release  
\- event emission for settlement milestones

The contract should not be responsible for UI-friendly read models.

\#\# Security notes  
\- Never trust client timestamps alone  
\- GPS may be missing or denied; store reason  
\- Deduplicate sync submissions  
\- Use signed wallet/session identity where applicable  
\- Audit every settlement transition

---

# **8\) `changes/mission-funding-and-proof/tasks.md`**

\# Tasks: Mission Funding and Proof

\#\# Product / domain  
\- \[ \] Finalize donor mission narrative  
\- \[ \] Freeze glossary for donation, funding, advance, and settlement  
\- \[ \] Define mission status map

\#\# Frontend  
\- \[ \] Build disasters list page  
\- \[ \] Build logistics companies list page  
\- \[ \] Build company profile page with AI summary section  
\- \[ \] Build wallet contribution screen  
\- \[ \] Build donor timeline page  
\- \[ \] Build operator delivery capture screen  
\- \[ \] Build offline queue component  
\- \[ \] Build operator settlement state page

\#\# Backend  
\- \[ \] Create Disaster model  
\- \[ \] Create LogisticsCompany and CompanyAssessment models  
\- \[ \] Create Mission model  
\- \[ \] Create FundingCommitment model  
\- \[ \] Create DeliveryEvent model  
\- \[ \] Create EvidenceBundle model  
\- \[ \] Create ValidationDecision model  
\- \[ \] Create SettlementRecord model  
\- \[ \] Create TimelineEvent model

\#\# API  
\- \[ \] GET disasters  
\- \[ \] GET companies by disaster  
\- \[ \] GET company profile  
\- \[ \] POST contribution intent  
\- \[ \] POST contribution confirmation  
\- \[ \] GET mission timeline  
\- \[ \] POST single delivery  
\- \[ \] POST sync batch  
\- \[ \] GET settlement state

\#\# Chain / validation  
\- \[ \] Define escrow event schema  
\- \[ \] Implement contribution confirmation persistence  
\- \[ \] Implement mock or minimal validation adapter  
\- \[ \] Implement settlement status ingestor  
\- \[ \] Map onchain events to timeline entries

\#\# QA / demo  
\- \[ \] Test wallet disconnected and insufficient funds states  
\- \[ \] Test offline queue persistence  
\- \[ \] Test duplicate sync prevention  
\- \[ \] Test accepted vs requires\_review validation flow  
\- \[ \] Rehearse end-to-end demo path

---

# **9\) `changes/logistics-operations/proposal.md`**

\# Proposal: Logistics Operations

\#\# Why  
The donor-facing trust model depends on a credible logistics company profile and operational readiness. Coordinators need a way to publish plans and manage field staff.

\#\# Problem  
Without structured coordinator input, the donor cannot assess who is executing the mission and the operator layer becomes detached from an accountable organization.

\#\# Proposed change  
Implement coordinator workflows:  
\- legal/company registration  
\- operational planning  
\- operator CRUD  
\- operational dashboard

\#\# Value  
\- turns logistics companies into first-class actors  
\- supplies GenLayer with structured input  
\- allows donors to compare organizations with context  
\- creates an accountable bridge between funding and field execution

---

# **10\) `changes/logistics-operations/spec.md`**

\# Spec: Logistics Operations

\#\# Actors  
\- Coordinator  
\- Backend system  
\- Donor (reader of published output)

\#\# User story 1  
As a coordinator, I want to register my organization so the system can identify a legal and operational responsible entity.

\#\#\# Acceptance criteria  
1\. Coordinator can submit company identity and required registration data.  
2\. Company remains unavailable to donors until minimum profile requirements are met.  
3\. The system stores company status such as draft, under\_review, active, or disabled.

\#\# User story 2  
As a coordinator, I want to publish an operational plan so donors can assess capacity and trust.

\#\#\# Acceptance criteria  
1\. Coordinator can create or edit an operational plan.  
2\. Plan includes at least coverage, resources, expected response time, and limitations.  
3\. A published plan becomes visible in the donor company profile.  
4\. The system can forward plan data to the validation/analysis layer for summarization.

\#\# User story 3  
As a coordinator, I want to manage operators so field events are attributable to authorized personnel.

\#\#\# Acceptance criteria  
1\. Coordinator can create, edit, deactivate, and list operators.  
2\. Operators belong to one company.  
3\. Deactivated operators cannot submit new delivery events.

\#\# User story 4  
As a coordinator, I want a dashboard so I can monitor mission progress and risks.

\#\#\# Acceptance criteria  
1\. Dashboard shows at least funds, deliveries, pending sync-related issues, and alerts.  
2\. Alerts must be visible and actionable.  
3\. Dashboard data must refresh from backend mission state.

Esto refleja C-01 a C-04 de la tabla resumida del user flow.

---

# **11\) `changes/logistics-operations/design.md`**

\# Design: Logistics Operations

\#\# Frontend routes  
\- /coordinator/company  
\- /coordinator/planning  
\- /coordinator/operators  
\- /coordinator/dashboard

\#\# Backend modules  
\- organizations  
\- planning  
\- operators  
\- dashboards

\#\# Data model  
\- Organization  
\- OrganizationDocument  
\- OperationalPlan  
\- Operator  
\- MissionAssignment  
\- DashboardMetric

\#\# Notes  
\- Coordinator-facing CRUD can be delivered quickly with conventional form workflows.  
\- Python backend should expose normalized APIs for both admin and donor-facing reads.  
\- The operational plan should be structured enough to feed GenLayer analysis later.

---

# **12\) `changes/logistics-operations/tasks.md`**

\# Tasks: Logistics Operations

\- \[ \] Create organization model  
\- \[ \] Create operational plan model  
\- \[ \] Create operator model  
\- \[ \] Build coordinator registration page  
\- \[ \] Build planning form page  
\- \[ \] Build operator CRUD page  
\- \[ \] Build dashboard page  
\- \[ \] Add company status workflow  
\- \[ \] Add plan publication workflow  
\- \[ \] Add operator activation/deactivation rule  
\- \[ \] Add donor-readable company profile projection

---

# **13\) `changes/reporting-timeline/proposal.md`**

\# Proposal: Reporting Timeline

\#\# Why  
The project’s trust promise depends on post-funding transparency. After contributing, donors must understand what happened and what the recorded evidence means.

\#\# Problem  
Raw contract events, validation outputs, and operator logs are not understandable enough for end users.

\#\# Proposed change  
Build a timeline capability that translates mission events into human-readable product states and provides access to evidence summaries.

\#\# Value  
\- makes transparency visible  
\- explains settlement in non-technical language  
\- turns proof into a product feature instead of backend exhaust

---

# **14\) `changes/reporting-timeline/spec.md`**

\# Spec: Reporting Timeline

\#\# Actors  
\- Donor  
\- Operator  
\- Backend system

\#\# User story 1  
As a donor, I want to see a readable mission timeline so I can understand how my contribution evolved over time.

\#\#\# Acceptance criteria  
1\. Timeline shows chronological mission events.  
2\. Each event has a label, timestamp, and short explanation.  
3\. Evidence-related milestones are distinguishable from funding milestones.  
4\. Timeline can be accessed immediately after successful contribution.

\#\# User story 2  
As an operator, I want to understand the financial closure state of a validated delivery so I know what happened after my field action.

\#\#\# Acceptance criteria  
1\. The settlement state screen must include:  
   \- validation status  
   \- settlement status  
   \- economic summary  
   \- sequential closure timeline  
2\. The following states must be representable:  
   \- delivery recorded  
   \- evidence validated  
   \- settlement in process  
   \- advance deducted  
   \- margin transferred  
   \- operation closed  
3\. The wording must remain understandable without smart contract knowledge.

\#\# Business rules  
\- Timeline entries must be append-only from a user perspective.  
\- Settlement events cannot appear before corresponding validation status.  
\- Evidence detail should be summarized for transparency without overloading the UI.

Eso sale literalmente del D-05 y del O-02.

---

# **15\) `changes/reporting-timeline/design.md`**

\# Design: Reporting Timeline

\#\# Backend read model  
Create a dedicated timeline projection table optimized for UI reads.

Fields:  
\- id  
\- mission\_id  
\- actor\_type  
\- event\_type  
\- title  
\- description  
\- status  
\- happened\_at  
\- metadata\_json

\#\# Timeline event sources  
\- contribution confirmation  
\- operator delivery sync  
\- validation decision  
\- settlement ingestion  
\- manual review flag if applicable

\#\# Frontend components  
\- TimelineList  
\- TimelineItem  
\- EventBadge  
\- EvidenceDrawer  
\- SettlementSummaryCard

\#\# Why a read model  
A read-optimized timeline projection avoids forcing the frontend to reconstruct state from raw relational or chain data.

---

# **16\) `changes/reporting-timeline/tasks.md`**

\# Tasks: Reporting Timeline

\- \[ \] Define timeline event taxonomy  
\- \[ \] Create timeline projection table  
\- \[ \] Map contribution events to timeline entries  
\- \[ \] Map delivery sync events to timeline entries  
\- \[ \] Map validation outcomes to timeline entries  
\- \[ \] Map settlement updates to timeline entries  
\- \[ \] Build donor timeline UI  
\- \[ \] Build event detail drawer  
\- \[ \] Build operator settlement summary UI  
\- \[ \] Test chronological ordering and empty-state UX

---

# **Recomendación concreta para Next.js \+ Python**

Con este SDD, yo lo implementaría así:

## **Frontend**

* **Next.js App Router**  
* **TypeScript**  
* **TanStack Query**  
* **IndexedDB** para cola offline del operador  
* **wagmi / ethers** si van a conectar wallet EVM  
* UI implementada con Ant Design como libreria unica de componentes, validando cada decision contra UX Spec _ Product Design Document.md

## **Backend**

* **FastAPI**  
* **SQLAlchemy \+ PostgreSQL**  
* worker async para validación e ingestión de eventos  
* endpoints REST bastante delgados  
* un “timeline projector” separado

La razón es que el PDF del operador exige muchísimo control de estado visible, conectividad irregular, cola offline y sincronización por ítems; eso se siente más natural con un frontend fuerte y un backend API-orquestador, no con páginas full server-rendered intentando hacer magia.

---

# **Qué construir primero, en orden realista**

1. **Donor flow mínimo**  
   * lista de desastres  
   * lista de empresas  
   * perfil de empresa  
   * pantalla wallet mock o real  
2. **Operator flow mínimo**  
   * captura de entrega  
   * cola offline  
   * sync  
3. **Timeline**  
   * funding confirmed  
   * delivery recorded  
   * validation result  
   * settlement result  
4. **Coordinator**  
   * si queda tiempo, forms básicos para empresa/plan/operadores  
5. **Aave**  
   * solo narrativa o stub demo, no core path

Esto sigue exactamente la recomendación del PDF técnico: el corazón demoable ya es suficientemente fuerte sin meter Aave profundo.

---

# **Mi lectura franca**

Tu proyecto ya no debería presentarse como “un lending protocol genérico”.  
La formulación correcta es algo como:

**HandLend es un protocolo de financiamiento condicionado para ayuda humanitaria, donde los fondos quedan en escrow, la última milla se prueba con evidencia operativa, GenLayer valida semánticamente la ejecución y Avalanche liquida onchain.**

Eso es mucho más coherente con tus PDFs, con el hackathon y con el SDD que acabo de armar.

En el siguiente paso te puedo dejar esto todavía más útil: una **versión lista para copiar y pegar en archivos reales**, con formato pulido de repo y un `README` técnico que conecte todo.
