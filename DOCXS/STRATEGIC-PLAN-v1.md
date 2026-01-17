# PharmXD Strategic Plan v1.0

**Project**: PharmXD - Pharmacogenomic Dosing Advisor
**Date**: 2026-01-17
**Target Demo**: Monday 2026-01-20
**Status**: Planning Phase

---

## Executive Summary

PharmXD is a mobile-first web application that combines pill/drug identification with personal pharmacogenomic data to provide FDA-compliant dosage recommendations. Users photograph a medication, and the app cross-references their genetic profile (specifically ~50 pharmacogenes) against CPIC guidelines to deliver personalized dosing guidance.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PharmXD WebApp                           │
│                    (GitHub Pages / PWA)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Camera/Image │  │ Genetic Data │  │ Results Dashboard    │  │
│  │ Capture      │  │ Upload       │  │ - Drug ID            │  │
│  │              │  │ (23andMe/    │  │ - Your phenotype     │  │
│  │              │  │  Ancestry)   │  │ - Dosage rec         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                     Client-Side Processing                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ SNP Parser   │  │ Phenotype    │  │ CPIC Guideline       │  │
│  │ (extract PGx │  │ Caller       │  │ Matcher              │  │
│  │  variants)   │  │ (diplotype)  │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                      Static Data (Bundled)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CPIC Guidelines JSON | PharmGKB Gene-Drug | FDA Labels   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Design Decision**: All processing happens client-side. Genetic data never leaves the user's device. This is critical for privacy and regulatory compliance.

---

## Data Sources

### 1. CPIC Guidelines (Primary)
- **Source**: https://cpicpgx.org/guidelines/
- **API**: https://api.pharmgkb.org/
- **Coverage**: 34 genes, 164 drugs
- **Format**: JSON (machine-readable)
- **License**: Creative Commons public domain

### 2. FDA Pharmacogenomic Tables
- **Biomarkers**: https://www.fda.gov/drugs/science-and-research-drugs/table-pharmacogenomic-biomarkers-drug-labeling
- **Associations**: https://www.fda.gov/medical-devices/precision-medicine/table-pharmacogenetic-associations

### 3. PharmGKB
- **API**: https://api.pharmgkb.org/
- **Content**: Clinical annotations, variant annotations, drug labels
- **Requirement**: User account for bulk downloads

### 4. Drug/Pill Identification
- **NLM RxNav API**: https://lhncbc.nlm.nih.gov/RxNav/APIs/
- **OpenFDA**: Drug label information
- **Approach for MVP**: Text-based drug lookup (image recognition as Phase 2)

---

## Core Pharmacogenes (Priority List)

These ~50 genes account for >90% of clinically actionable pharmacogenomic interactions:

### Tier 1 - Critical (CPIC Level A)
| Gene | Function | Key Drugs |
|------|----------|-----------|
| CYP2D6 | Drug metabolism | Codeine, tramadol, tamoxifen, antidepressants |
| CYP2C19 | Drug metabolism | Clopidogrel, PPIs, antidepressants |
| CYP2C9 | Drug metabolism | Warfarin, phenytoin, NSAIDs |
| VKORC1 | Warfarin sensitivity | Warfarin |
| SLCO1B1 | Statin transport | Simvastatin, atorvastatin |
| TPMT | Thiopurine metabolism | Azathioprine, 6-MP |
| DPYD | Fluoropyrimidine metabolism | 5-FU, capecitabine |
| UGT1A1 | Glucuronidation | Irinotecan, atazanavir |

### Tier 2 - Important (CPIC Level A/B)
| Gene | Function | Key Drugs |
|------|----------|-----------|
| CYP3A5 | Drug metabolism | Tacrolimus |
| CYP2B6 | Drug metabolism | Efavirenz, methadone |
| HLA-B | Immune response | Abacavir (*57:01), carbamazepine (*15:02) |
| HLA-A | Immune response | Carbamazepine (*31:01) |
| G6PD | Oxidative stress | Rasburicase, primaquine |
| NUDT15 | Thiopurine toxicity | Azathioprine, 6-MP |
| CYP4F2 | Vitamin K metabolism | Warfarin |
| NAT2 | Acetylation | Isoniazid, hydralazine |
| IFNL3/4 | Interferon response | Peginterferon alfa |
| RYR1 | Malignant hyperthermia | Volatile anesthetics |
| CACNA1S | Malignant hyperthermia | Volatile anesthetics |

### Tier 3 - Emerging
CYP1A2, CYP2A6, CYP2E1, COMT, ABCB1, ABCG2, SLC6A4, HTR2A, OPRM1, etc.

---

## Implementation Phases

### Phase 1: MVP for Monday Demo (3 days)
**Goal**: Working webapp demonstrating core concept

#### Day 1 (Friday) - Data & Infrastructure
- [ ] Download CPIC guidelines JSON from PharmGKB
- [ ] Create pharmacogene variant reference database
- [ ] Set up GitHub repo with public webapp folder
- [ ] Scaffold webapp structure (HTML/CSS/JS)

#### Day 2 (Saturday) - Core Logic
- [ ] Build SNP file parser (23andMe/AncestryDNA format)
- [ ] Implement phenotype caller for CYP2D6, CYP2C19 (star alleles)
- [ ] Create drug lookup interface (text-based)
- [ ] Connect phenotype to CPIC recommendations

#### Day 3 (Sunday) - Polish & Deploy
- [ ] Mobile-responsive design
- [ ] Add 3-5 demo drugs with full guideline text
- [ ] Deploy to GitHub Pages
- [ ] Test on mobile devices
- [ ] Prepare demo script

#### MVP Feature Set
1. **Upload genetic data** - Accept 23andMe/AncestryDNA raw file
2. **Parse pharmacogenes** - Extract relevant SNPs, infer star alleles
3. **Drug lookup** - Search by drug name (text input)
4. **Dosing recommendation** - Display CPIC-guided dosing based on phenotype
5. **Privacy notice** - Clear messaging that data stays local

### Phase 2: Image Recognition (Post-MVP)
- Integrate pill image recognition API or local ML model
- Camera capture interface
- Barcode scanning for branded medications

### Phase 3: Full Product
- Medication interaction checker
- Comprehensive gene panel
- Report generation (PDF)
- Healthcare provider portal

---

## Technical Stack (MVP)

```
Frontend:
├── HTML5 + CSS3 (responsive)
├── Vanilla JavaScript (no framework for simplicity)
├── IndexedDB (local storage of genetic data)
└── Service Worker (offline capability, PWA)

Data:
├── Static JSON files bundled with app
│   ├── cpic_guidelines.json
│   ├── pharmacogene_variants.json
│   └── drug_index.json
└── No backend required for MVP

Deployment:
├── GitHub Pages (free, HTTPS)
└── Custom domain optional
```

### File Structure
```
00-PHARMDX/
├── webapp/                    # PUBLIC - deployed to GitHub Pages
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js            # Main application logic
│   │   ├── snp-parser.js     # Parse genetic data files
│   │   ├── phenotype.js      # Star allele / phenotype calling
│   │   └── cpic-lookup.js    # Guideline matching
│   ├── data/
│   │   ├── cpic_guidelines.json
│   │   ├── gene_variants.json
│   │   └── drugs.json
│   └── manifest.json         # PWA manifest
├── PYTHON/                    # PRIVATE - data processing scripts
│   ├── 00-download-cpic.py
│   ├── 01-build-variant-db.py
│   └── 02-generate-webapp-data.py
├── DATA/
│   └── CLINPGX/              # Raw CPIC/PharmGKB downloads
├── CONFIG/
│   └── settings.json
├── CONTEXT/                   # Scientific papers
└── DOCXS/                     # Documentation
```

---

## GitHub Repository Strategy

```
Repository: pharmxd (private)
├── .gitignore
│   ├── DATA/CLINPGX/         # Exclude raw database dumps
│   ├── PYTHON/               # Exclude processing scripts
│   ├── *.env                 # Exclude secrets
│   └── CONTEXT/              # Exclude PDFs
│
├── webapp/                   # Only this folder is public
│   └── (deployed via GitHub Pages)
│
└── README.md                 # Public-facing documentation
```

**GitHub Pages Settings**:
- Source: `main` branch, `/webapp` folder
- Custom domain: optional (e.g., pharmxd.app)

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| CPIC data incomplete | Start with top 5 drug-gene pairs |
| Star allele calling complex | Use simplified phenotype rules for MVP |
| 23andMe format changes | Support multiple format versions |
| Regulatory concerns | Clear disclaimers, "educational only" |
| Mobile browser camera access | Defer image feature to Phase 2 |

---

## Demo Script (Monday)

### Scenario
"Meet Sarah, a 45-year-old who just received a prescription for clopidogrel after a cardiac stent. She has 23andMe data from 3 years ago."

### Demo Flow
1. Open PharmXD on mobile browser
2. Upload Sarah's 23andMe raw data (demo file)
3. App shows: "Analyzing 487 pharmacogenomic variants..."
4. App shows: "CYP2C19: *1/*2 - Intermediate Metabolizer"
5. Search for "clopidogrel"
6. App displays:
   - **Your phenotype**: CYP2C19 Intermediate Metabolizer
   - **CPIC Recommendation**: Consider alternative antiplatelet therapy
   - **FDA Label**: "Poor metabolizers have reduced active metabolite..."
   - **Source**: CPIC Guideline for Clopidogrel (2022)

### Key Message
"In 30 seconds, PharmXD identified a potentially life-threatening drug-gene interaction that affects 25% of the population."

---

## Next Steps (Immediate)

1. **Today**: Download CPIC data, create variant reference
2. **Today**: Scaffold webapp, implement file upload
3. **Tomorrow**: Build phenotype caller for CYP2D6/CYP2C19
4. **Tomorrow**: Create drug lookup with 5 demo drugs
5. **Sunday**: Deploy, test on mobile, polish UI

---

## Resources

- [CPIC Guidelines](https://cpicpgx.org/guidelines/)
- [PharmGKB API](https://api.pharmgkb.org/)
- [FDA Pharmacogenomic Biomarkers](https://www.fda.gov/drugs/science-and-research-drugs/table-pharmacogenomic-biomarkers-drug-labeling)
- [PharmCAT (reference implementation)](https://github.com/PharmGKB/PharmCAT)
- [23andMe Raw Data Format](https://customercare.23andme.com/hc/en-us/articles/212196868)
- [Smart Pill ID](https://www.smartpillid.com/) - Pill recognition API reference

---

## Appendix: Sample 23andMe Raw Data Format

```
# rsid  chromosome  position  genotype
rs3094315    1       742429      AG
rs12124819   1       766409      AA
rs11240777   1       788822      GG
...
```

Pharmacogene example (CYP2C19):
```
rs4244285    10      96541616    AG   # *2 allele (loss of function)
rs4986893    10      96540410    GG   # *3 allele (normal)
rs12248560   10      96522463    CC   # *17 allele (normal)
```

---

*Document Version*: 1.0
*Author*: Corpas-Core / Claude
*Last Updated*: 2026-01-17
