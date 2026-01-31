# PharmXD - Pharmacogenomic Dosing Advisor

A privacy-first Progressive Web App that provides personalized medication dosing recommendations based on your genetic profile.

## Live Demo

**[Try PharmXD](https://manuelcorpas.github.io/pharmxd/)**

## Features

- **Upload Genetic Data**: Supports 23andMe and AncestryDNA raw data files
- **12 Pharmacogenes**: CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, TPMT, UGT1A1, CYP3A5, CYP2B6, NUDT15, CYP1A2
- **51 Medications**: Evidence-based dosing recommendations from CPIC guidelines
- **Privacy-First**: All processing happens in your browser — genetic data never leaves your device
- **Progressive Web App**: Install on your phone's home screen, works offline
- **Bilingual**: English and Spanish with one-tap language toggle
- **Wallet Card**: Save or print a pharmacogenetic alert card for your doctor
- **WhatsApp-Ready**: Rich link preview when sharing

## Supported Drug Categories

| Category | Drugs |
|----------|-------|
| Antiplatelet | Clopidogrel |
| Opioids | Codeine, Tramadol, Hydrocodone, Oxycodone |
| Statins | Simvastatin, Atorvastatin, Rosuvastatin, Pravastatin |
| Anticoagulant | Warfarin |
| PPIs | Omeprazole, Pantoprazole, Lansoprazole, Esomeprazole, Dexlansoprazole |
| Antidepressants | Amitriptyline, Nortriptyline, Desipramine, Imipramine, Doxepin, Trimipramine, Clomipramine, Citalopram, Escitalopram, Sertraline, Paroxetine, Fluoxetine, Venlafaxine |
| Antipsychotics | Clozapine, Risperidone, Aripiprazole, Haloperidol |
| NSAIDs | Celecoxib, Flurbiprofen, Piroxicam, Meloxicam |
| Oncology | Tamoxifen, Fluorouracil, Capecitabine, Irinotecan |
| Immunosuppressants | Azathioprine, Mercaptopurine, Thioguanine, Tacrolimus |
| Antivirals | Efavirenz, Atazanavir |
| Other | Phenytoin, Metoprolol, Ondansetron, Atomoxetine, Voriconazole |

## How It Works

1. Upload your raw genetic data file (or try a demo profile)
2. PharmXD extracts pharmacogenomic variants
3. Star alleles and metabolizer phenotypes are determined
4. Get a summary of which drugs need attention
5. Search for any medication for personalized recommendations
6. Save a wallet card to show your doctor

## Install as Mobile App

**iPhone:**
1. Open the link in Safari
2. Tap Share (square with arrow)
3. Tap "Add to Home Screen"

**Android:**
1. Open the link in Chrome
2. Tap menu (three dots)
3. Tap "Install app"

## Technology

- Pure HTML/CSS/JavaScript (no frameworks, no build step)
- Client-side processing only (no backend)
- Progressive Web App with service worker
- Deployed to GitHub Pages

## Data Sources

- [CPIC Guidelines](https://cpicpgx.org/) - Clinical Pharmacogenetics Implementation Consortium
- [PharmGKB](https://www.pharmgkb.org/) - Pharmacogenomics Knowledge Base
- [FDA Drug Labels](https://www.fda.gov/) - Pharmacogenomic biomarker information

## Disclaimer

**PharmXD is for educational and informational purposes only.** It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or pharmacist before making any medication decisions.

## License

MIT License

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
