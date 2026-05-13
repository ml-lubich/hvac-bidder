# HVAC BidPro

> AI bid calculator for HVAC contractors. Enter job details, get a
> formatted bid with material costs, labor estimates, and profit
> margins. Competitors charge $50-200/mo — we charge **$19/mo**.

```mermaid
flowchart LR
    USER[("👤 HVAC contractor")]
    LANDING["🌐 / · landing"]
    AUTH{{"🔐 /signup · /login<br/>Supabase Auth"}}
    DASH["📊 /dashboard<br/>your bids"]
    NEW["🪄 /bid/new<br/>wizard"]
    AI["🤖 cost + labor<br/>estimator"]
    BID["🧾 /bid/[id]<br/>view · edit · PDF"]
    DB[("🗄 Supabase<br/>Postgres")]
    PRICING[/"💳 /pricing<br/>$19/mo"/]

    USER --> LANDING --> AUTH --> DASH
    DASH --> NEW --> AI --> DB --> BID
    LANDING --> PRICING

    classDef io fill:#0e1116,stroke:#2f81f7,stroke-width:1.5px,color:#e6edf3;
    classDef tool fill:#161b22,stroke:#3fb950,stroke-width:1.5px,color:#e6edf3;
    classDef brain fill:#161b22,stroke:#d29922,stroke-width:1.5px,color:#e6edf3;
    classDef out fill:#0e1116,stroke:#a371f7,stroke-width:1.5px,color:#e6edf3;
    class USER,DB io;
    class NEW,AI,LANDING,DASH tool;
    class AUTH brain;
    class BID,PRICING out;
```

## Table of contents

- [Stack](#stack)
- [Architecture](#architecture)
- [Bid build (algorithm)](#bid-build-algorithm)
- [Bid lifecycle (state)](#bid-lifecycle-state)
- [Getting Started](#getting-started)

## Bid build (algorithm)

```mermaid
flowchart LR
    A([/bid/new])
    B["collect job inputs<br/>scope · tonnage · site"]
    C["materials lookup<br/>SKU prices"]
    D["labor estimate<br/>crew × hours"]
    E["overhead %"]
    F["profit margin %"]
    G["total = mat + labor + OH + profit"]
    H["render bid PDF"]
    I["insert /bid row"]
    Z([/bid/[id]])
    A --> B --> C --> D --> E --> F --> G --> H --> I --> Z
```

## Bid lifecycle (state)

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> SENT: email PDF to client
    SENT --> WON: client accepts
    SENT --> LOST: client declines / no reply
    WON --> SCHEDULED: install booked
    SCHEDULED --> [*]
    LOST --> [*]
```

## Stack

- Next.js 16 + React 19 + Tailwind CSS 4
- Supabase (auth + database)
- Vercel deployment
- TypeScript strict mode
- Bun package manager

## Architecture

- `/` — Landing page
- `/signup`, `/login` — Auth flows (Supabase)
- `/dashboard` — User's bids/estimates
- `/bid/new` — Create new bid wizard
- `/bid/[id]` — View / edit / PDF export
- `/pricing` — Plans (Free: 3 bids/mo, Pro: $19/mo unlimited)

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).
