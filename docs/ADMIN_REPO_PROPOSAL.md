# F3 Company/Admin Repository Proposal

## Purpose

A separate administrative repository for F3 Capital Region that manages organizational content, vision documents, community partnerships, and administrative resources that are separate from the application codebase.

## Rationale

The current `f3invigorate` repository is focused on the application codebase (Next.js app, API routes, database schema, etc.). An admin repository would:

1. **Separate concerns**: Keep organizational/administrative content separate from application code
2. **Enable collaboration**: Allow non-developers to contribute vision documents, partner information, etc.
3. **Version control**: Track changes to organizational strategy, partnerships, and initiatives
4. **Documentation hub**: Centralize all F3 Capital Region administrative documentation

## Proposed Structure

```
f3-company-admin/
├── README.md
├── vision/
│   ├── 2026_F3_CAPITAL_REGION_VISION.md
│   └── [future vision documents]
├── community-partners/
│   ├── README.md
│   ├── wesley-housing.md
│   ├── kitchen-of-purpose.md
│   ├── 703-warriors.md
│   ├── veterans-on-the-rise.md
│   └── travis-manion-foundation.md
├── events/
│   ├── 2026/
│   │   ├── amazing-race-2026.md
│   │   └── [other 2026 events]
│   └── [future years]
├── initiatives/
│   └── [ongoing initiatives and programs]
├── resources/
│   ├── branding/
│   ├── templates/
│   └── [other resources]
└── .github/
    └── workflows/
        └── [CI/CD for documentation if needed]
```

## Content Categories

### Vision Documents
- Annual vision statements
- Strategic planning documents
- Mission alignment materials

### Community Partners
- Partner profiles
- Partnership agreements (if appropriate for version control)
- Contact information
- Impact metrics and reports

### Events
- Event planning documents
- Registration information
- Post-event reports
- Financial summaries

### Initiatives
- Ongoing programs
- Fundraising campaigns
- Community engagement activities

### Resources
- Branding guidelines
- Document templates
- Standard operating procedures

## Integration with Application

The admin repo could serve as a source of truth for:

1. **Community Partner Data**: The application could reference partner information from the admin repo
2. **Event Information**: Event details could be synced or referenced from the admin repo
3. **Content Management**: Static content displayed in the app could be managed here

## Benefits

- **Clear separation**: Administrative content separate from code
- **Accessibility**: Non-technical contributors can easily add/edit markdown files
- **History**: Full version control of organizational decisions and changes
- **Collaboration**: Multiple people can contribute without touching application code
- **Transparency**: Public-facing admin repo could increase community transparency

## Next Steps

1. Create the `f3-company-admin` repository
2. Migrate the 2026 Vision document to the new repo
3. Create individual partner profile documents
4. Set up basic structure and README
5. Define contribution guidelines for non-technical contributors

