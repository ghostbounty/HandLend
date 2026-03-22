# Spec: Mission Funding and Proof

## Requirements

### Requirement: Disaster selection and pool visibility

The system SHALL let a donor select a disaster context and immediately surface the Campaign Pool status.

#### Scenario: Donor enters the flow

- GIVEN the donor opens the funding journey
- WHEN the donor lands on `D-01`
- THEN the system shows active disasters with urgency and location context

#### Scenario: Donor views pool after selecting disaster

- GIVEN a disaster has been selected
- WHEN the donor opens `D-02`
- THEN the system prioritises the Campaign Pool status (total funds, goal, urgency) above any company list
- AND logistics companies appear in a secondary section labelled "Entities with response capacity" — not as a required selection step before donating

### Requirement: Coordinator transparency as reference only

The system SHALL expose logistics company profiles as read-only capacity reference for the donor.

#### Scenario: Donor opens a company detail

- GIVEN the donor opens a logistics company profile from the secondary list on `D-02`
- WHEN the company detail screen renders
- THEN the system shows capacity, trust, coverage, GenLayer analysis, and operational plan
- AND the screen MUST NOT include any "Donate to this company" CTA
- AND the only payment CTA available acredits funds to the Disaster Pool

### Requirement: Pool-bound funding commitment

The system MUST attach a contribution to one Disaster Pool, not to a specific logistics company.

#### Scenario: Donor confirms funding

- GIVEN the donor has reviewed the pool and optionally the coordinator list on `D-02`
- WHEN the donor confirms amount and wallet action on `D-04`
- THEN the system records a funding commitment bound to the Disaster Pool (Disaster ID)
- AND the confirmation receipt must indicate: "You have acredited funds to the [Disaster Name] Campaign"

### Requirement: Post-funding transparency

The system SHALL expose a readable timeline after funding.

#### Scenario: Donor opens reporting

- GIVEN the donor completed a pool contribution
- WHEN the donor opens `D-05`
- THEN the system shows timeline events including how the pool distributes to coordinators as validated delivery evidence is submitted

## Business Rules

- A funding commitment is associated with a Disaster Pool. The allocation to specific logistics companies is handled by the protocol based on validated delivery events.
- A delivery event cannot be settled before evidence validation completes.
- Validation decisions may be accepted, requires_review, or rejected.
- Settlement explanation must distinguish operational advance deduction from final transfer.

## AI UX Instruction

The UX flow must ensure that the donation is contextual to the disaster. Logistics companies act as capacity providers on standby. The Smart Contract (Escrow) on Avalanche receives funds at the campaign level and releases them to coordinators only after semantic validation of last-mile delivery evidence.

## Planned: Wallet Linking in Settings

> **Status: PLANNED — NOT IMPLEMENTED**

The Settings panel (accessible from the top header) will include a Wallet Linking section allowing users to connect their crypto wallet address to their HandLend account. The implementation will:

1. Display a "Connect Wallet" button in the Settings UI
2. Capture the user's wallet address (mock: manual input of address string)
3. Store the linked wallet address in the user profile (`wallet_address` field)
4. Display the linked wallet address in the top header (replacing the static `0xDemo...abcd`)
5. Use the linked wallet address when posting contribution intents to the API

**AI UX Note:** The wallet linking UI must follow the same glass-morphism dark theme. The settings section must be accessible from the header wallet icon or avatar dropdown. Do not implement blockchain wallet provider integration — only capture and store the wallet address string for simulation purposes.
