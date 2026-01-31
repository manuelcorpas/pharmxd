# PharmXD Development Sessions — January 2026

## Project Origin
PharmXD was built as a pharmacogenomic dosing advisor — a client-side web app that takes raw genetic data (23andMe/AncestryDNA format) and provides personalized medication recommendations based on CPIC guidelines.

## Development Timeline

### Session 1: Core Build (mid-January 2026)
- Built complete client-side app: HTML/CSS/JS, no frameworks
- SNP parser for 23andMe and AncestryDNA raw data formats
- Phenotype calling engine (star alleles → metabolizer status)
- CPIC guideline lookup for drug recommendations
- 7 initial genes: CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, TPMT
- 26 initial drugs
- 2 demo profiles: Sarah (CYP2C19 IM), John (CYP2D6 PM)
- Deployed to GitHub Pages: https://manuelcorpas.github.io/pharmxd/

### Session 2: Feature Expansion (late January 2026)
**Clickable alert drugs**: Drug list items in summary now scroll to full drug result when tapped.

**Wallet card**: Credit-card-sized pharmacogenetic alert card with:
- Genetic profile summary
- Medications requiring attention
- Print and save-as-image (html2canvas)
- Designed to show to doctor/pharmacist

**Gene/drug expansion** (12 genes, 51 drugs):
- Added 5 new genes: UGT1A1, CYP3A5, CYP2B6, NUDT15, CYP1A2
- Added 25 new drugs across all categories
- Updated demo profiles with new gene variants

**PWA conversion**:
- Service worker for offline caching
- App icons (192px, 512px PNG + SVG)
- iOS and Android home screen installation
- manifest.json with full PWA configuration

**Open Graph meta tags**: Rich link preview for WhatsApp/social sharing with custom 1200x630 share image.

**Spanish language support**:
- i18n.js with complete EN/ES translations
- Language toggle button (flag-based, shows target language)
- Auto-detects browser language
- Stores preference in localStorage

## Key Technical Decisions

1. **No framework**: Pure vanilla JS keeps the app tiny, fast, zero dependencies (except html2canvas for wallet card export)
2. **Client-side only**: Privacy-first — genetic data never leaves the device. No backend, no API calls for analysis.
3. **IIFE module pattern**: Each JS file (SNPParser, PhenotypeCaller, CPICLookup, I18n, PharmXD) uses revealing module pattern
4. **GitHub Pages deployment**: Push to `main` → auto-deploys from `docs/` folder
5. **Service worker versioning**: Increment `CACHE_NAME` in sw.js when updating cached files

## Files Modified/Created

| File | Purpose |
|------|---------|
| `docs/index.html` | Main app page with all data-i18n attributes |
| `docs/css/style.css` | All styling including wallet card and language toggle |
| `docs/js/app.js` | Main logic: file handling, profile display, drug lookup, wallet card, i18n |
| `docs/js/snp-parser.js` | Parses 23andMe/AncestryDNA, extracts PGx SNPs (33 SNPs across 12 genes) |
| `docs/js/phenotype.js` | Star allele calling and phenotype rules for all 12 genes |
| `docs/js/cpic-lookup.js` | 51 drug entries with phenotype-specific recommendations |
| `docs/js/i18n.js` | English/Spanish translations, language detection/toggle |
| `docs/sw.js` | Service worker for offline caching (v2) |
| `docs/manifest.json` | PWA manifest |
| `docs/icons/` | icon.svg, icon-192.png, icon-512.png, og-image.png |
| `CLAUDE.md` | Project instructions for Claude Code sessions |
| `README.md` | Updated project documentation |

## How to Add a New Drug (Quick Reference)
1. `cpic-lookup.js` → add entry in `GUIDELINES` with recommendations per phenotype
2. Each recommendation: `{ recommendation, classification, strength, implications, icon }`
3. Classification must be: `standard`, `caution`, or `avoid`

## How to Add a New Gene (Quick Reference)
1. `snp-parser.js` → add SNPs to `PGX_SNPS`
2. `phenotype.js` → add gene to `GENES` with variants and phenotypeRules
3. `app.js` → add to `geneOrder` arrays (2 places: displayProfile, showWalletCard)
4. `app.js` → optionally add SNPs to demo data

## Potential Next Steps (Parked)
- PDF report generation
- localStorage profile persistence
- "My Medications" list
- Drug-drug interaction warnings
- Population frequency display
- More demo profiles (UGT1A1 PM for irinotecan, etc.)
- Expand to 100+ drugs
- Capacitor wrapper for App Store / Play Store distribution

## Collaborators & Context
- Built with Claude Code (Claude Opus 4.5)
- Discussed Adrian LLerena's perspective (CYP2D6 expert) — decided to keep simple for general public
- Commercial value assessment led to wallet card feature
- Shared with colleagues via WhatsApp for testing
