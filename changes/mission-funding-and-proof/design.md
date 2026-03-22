# Design: Mission Funding and Proof

## Technical Approach

Use Next.js to render donor flow screens, Python backend to model pool-level funding commitments and normalized states, Avalanche escrow for locking and settlement at the campaign level, and GenLayer output as donor-readable coordinator capacity and validation context.

## Key Decisions

- The Disaster Pool is the core funding aggregate. Logistics companies are capacity providers, not funding destinations.
- Wallet confirmation does not become the frontend source of truth; backend publishes normalized pool state.
- Timeline language uses product milestones rather than raw contract state names.
- No "Donate to this company" CTA may appear on coordinator detail screens; the only payment action acredits the Disaster Pool.

## Data Flow

```text
D-01 disaster select
  -> D-02 campaign pool view (pool status primary, coordinator list secondary)
  -> [optional] coordinator detail — read-only capacity reference, no payment CTA
  -> D-04 wallet contribution -> Disaster Pool (Disaster ID)
  -> escrow lock on Avalanche at campaign level
  -> backend indexes pool commitment
  -> D-05 timeline renders pool funding and coordinator allocation as evidence is validated
```

## Interfaces

- disaster list with urgency metadata
- campaign pool status view (funds total, goal, urgency) with secondary coordinator capacity list
- coordinator detail view (read-only: capacity, trust, GenLayer analysis)
- pool funding commitment record keyed by Disaster ID
- donor timeline event feed showing pool distribution to coordinators
