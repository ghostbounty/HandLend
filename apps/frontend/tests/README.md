# HandLend UI Tests (Playwright)

## Run tests

```bash
# Install browsers (first time only)
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run with UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/ui-smoke.spec.ts
```

## Test coverage

- Home page: hero section, campaign grid, metrics footer, category filters
- Navigation: sidebar (desktop) and bottom nav links
- Donor flow: disasters, companies, company profile, fund, timeline
- Operator flow: delivery form, QR simulation
- Coordinator flow: dashboard stats
