# Google Reviews Integration

## Findings
- Google Places API (new) does not return individual reviews (only aggregate rating & count).
- Individual reviews require Google My Business API with business verification and OAuth.
- Scraping is against ToS.

## Costs
- Places Details: ~$17 per 1000 requests; still no review text.
- Google My Business: free but requires verification and OAuth complexity.

## Options
1) Manual export/import from Google My Business dashboard.
2) Third-party review aggregators (ReviewPush, Grade.us, Podium, Birdeye) — paid.
3) Full Google My Business API integration (2-4 weeks, requires verification).

## Recommendation for MVP
- Focus on Hostaway integration and mock data.
- Plan future Google integration once verification is available.
