## Recent Transactions Revamp (Transactions Page)

### Goals
- Provide a richer, scannable overview of recent payments.
- Use a horizontally scrollable carousel with snap and arrow controls.
- Keep unified transactions (`useUnifiedTransactions`) as the single source of truth.
- Preserve the project's minimalist, card-based UI consistency.

### UI/UX
- Section: "Recent Transactions" with optional count.
- Horizontal carousel of compact cards with CSS scroll-snap.
- Prev/Next buttons to advance by one viewport.
- Each card: description, category, date, colored amount (masked if `showBalance` is false).
- Loading state uses existing `SkeletonTransactionCard`.
- Responsive:
  - Mobile: ~1.15 cards visible to hint overflow.
  - Tablet: ~2 cards.
  - Desktop: 3–4 cards.

### Tech/Components
- New `RecentTransactionsCarousel` in `src/components/transactions/`.
- Uses basic scroll container + snap; no new deps.
- Reuses `useFormatting` for currency/date.

### Data
- Props: `transactions: Transaction[]`, `showBalance: boolean`, `isLoading?: boolean`, `maxItems?: number` (default 12).
- Uses unified transactions (database + Bunq) only.

### Integration
- Replace the existing header block in `src/app/transactions/page.tsx` with the new carousel.
- Leave filters and the full transactions grid unchanged.

### Out of Scope
- No changes to detail modal, filters, or data fetching.

---

## Transaction Timeline Revamp (Main List)

### Concept
- A two-column, zigzag timeline grouped by day with connecting lines, glowing day badges, and animated entries.
- Each entry has a compact card with description, category, date/time, and colored amount; clicking opens details.

### Behavior
- Group by day; show sticky day headers while scrolling.
- Alternating sides per item within a day; responsive fallback to single column on small screens.
- Virtual-friendly layout (no heavy libs) to keep it snappy.

### Component
- New `TransactionTimeline` in `src/components/transactions/`.
- Props: `transactions: Transaction[]`, `showBalance: boolean`, `onViewDetails: (tx) => void`.

### Integration
- Replace the existing grid list on the transactions page with `TransactionTimeline` (below filters).


