# PharmXD — Project Instructions for Claude Code

## What is PharmXD?
A privacy-first Progressive Web App that provides personalized medication dosing recommendations based on genetic data from 23andMe or AncestryDNA. All processing happens client-side — no backend, no server, no data leaves the device.

**Live URL**: https://manuelcorpas.github.io/pharmxd/
**GitHub Repo**: https://github.com/manuelcorpas/pharmxd

## Architecture

Pure client-side JavaScript (no frameworks). Deployed to GitHub Pages from `docs/` folder on `main` branch.

```
docs/                           # GitHub Pages root
├── index.html                  # Main app (single page)
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker (offline + caching)
├── css/style.css               # All styles (mobile-first)
├── js/
│   ├── i18n.js                 # Internationalization (EN/ES)
│   ├── snp-parser.js           # Parses 23andMe/AncestryDNA files
│   ├── phenotype.js            # Star allele → phenotype calling
│   ├── cpic-lookup.js          # Drug guideline database + recommendations
│   └── app.js                  # Main app logic, UI, events
└── icons/                      # PWA + OG share icons
```

Support directories (not deployed):
```
CONFIG/                         # Project configuration
CONTEXT/                        # Context files for development
DATA/                           # Data files
LOGS/                           # Log files
PYTHON/                         # Python scripts (icon generation etc.)
DOCXS/                          # Documentation
```

## Data Flow

```
User uploads file → snp-parser.js (detect format, extract PGx SNPs)
                  → phenotype.js (call star alleles + phenotypes per gene)
                  → cpic-lookup.js (match phenotype → drug recommendations)
                  → app.js (render profile, summary, drug results)
```

## Current Coverage (as of January 2026)

**12 Genes**: CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, TPMT, UGT1A1, CYP3A5, CYP2B6, NUDT15, CYP1A2

**51 Drugs** including:
- Antiplatelet: clopidogrel
- Opioids: codeine, tramadol, hydrocodone, oxycodone
- Statins: simvastatin, atorvastatin, rosuvastatin, pravastatin
- Anticoagulant: warfarin (multi-gene: CYP2C9 + VKORC1)
- PPIs: omeprazole, pantoprazole, lansoprazole, esomeprazole, dexlansoprazole
- Antidepressants (TCAs): amitriptyline, nortriptyline, desipramine, imipramine, doxepin, trimipramine, clomipramine
- SSRIs/SNRIs: citalopram, escitalopram, sertraline, paroxetine, fluoxetine, venlafaxine
- Antipsychotics: clozapine, risperidone, aripiprazole, haloperidol
- NSAIDs: celecoxib, flurbiprofen, piroxicam, meloxicam
- Oncology: tamoxifen, fluorouracil, capecitabine, irinotecan
- Immunosuppressants: azathioprine, mercaptopurine, thioguanine, tacrolimus
- Antivirals: efavirenz, atazanavir
- Other: phenytoin, metoprolol, ondansetron, atomoxetine, voriconazole

## Key Features
- **File upload**: Drag-and-drop or browse for 23andMe/AncestryDNA raw data
- **Demo profiles**: Sarah (CYP2C19 intermediate) and John (CYP2D6 poor metabolizer)
- **Gene profile cards**: Color-coded by metabolizer status
- **Drug response summary**: Standard / Caution / Avoid counts
- **Clickable alert drugs**: Scroll to drug detail when tapped
- **Wallet card**: Printable/saveable pharmacogenetic alert card
- **PWA**: Installable on iOS/Android home screens, works offline
- **Bilingual**: English/Spanish with flag toggle (auto-detects browser language)
- **Open Graph**: Rich link preview when shared via WhatsApp/social media

## Deployment
Push to `main` branch → GitHub Pages auto-deploys from `docs/` (1-2 min delay).
```bash
git add docs/ && git commit -m "message" && git push origin main
```

## Service Worker Versioning
When updating cached files, **increment `CACHE_NAME`** in `sw.js` (currently `pharmxd-v2`). This triggers cache refresh for returning users.

## Demo Data
Demo profiles are embedded in `app.js` as `DEMO_DATA.sarah` and `DEMO_DATA.john`. To add a new demo, add a new object with `name`, `description`, and `data` (tab-delimited SNP format), plus a button in `index.html`.

## Common Development Tasks

### Add a new drug
1. Add entry in `cpic-lookup.js` inside `GUIDELINES` object
2. Include: name, brandNames, drugClass, gene, guidelineUrl, recommendations per phenotype
3. Each recommendation needs: recommendation, classification (standard/caution/avoid), strength, implications, icon

### Add a new gene
1. Add SNP definitions in `snp-parser.js` → `PGX_SNPS` object
2. Add gene definition in `phenotype.js` → `GENES` object (variants, phenotypeRules)
3. Add gene to `geneOrder` arrays in `app.js` (two locations: `displayProfile` and `showWalletCard`)
4. Add SNPs to demo data in `app.js` if desired

### Add a new language
1. Add translation object in `i18n.js` → `translations`
2. Update `toggleLang()` if adding more than 2 languages

## Potential Next Steps
- PDF report generation for doctors
- Save profile in localStorage
- "My Medications" list
- Drug-drug interaction warnings
- Population frequency data
- More demo profiles for new genes
- Expand to 100+ drugs
- Capacitor wrapper for App Store/Play Store
