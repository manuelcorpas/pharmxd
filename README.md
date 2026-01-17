# PharmXD - Pharmacogenomic Dosing Advisor

A mobile-first web application that provides personalized medication dosing recommendations based on your genetic profile.

## Live Demo

**[Try PharmXD](https://yourusername.github.io/pharmxd/)** *(Update with your actual URL)*

## Features

- **Upload Genetic Data**: Supports 23andMe and AncestryDNA raw data files
- **Pharmacogene Analysis**: Analyzes 7 key pharmacogenes (CYP2C19, CYP2D6, CYP2C9, VKORC1, SLCO1B1, DPYD, TPMT)
- **CPIC Guidelines**: Evidence-based dosing recommendations from the Clinical Pharmacogenetics Implementation Consortium
- **Privacy-First**: All data processing happens in your browser - genetic data never leaves your device
- **Mobile Responsive**: Works on phones, tablets, and desktops

## Supported Drugs

- Clopidogrel (Plavix) - CYP2C19
- Codeine - CYP2D6
- Simvastatin (Zocor) - SLCO1B1
- Warfarin (Coumadin) - CYP2C9/VKORC1
- Omeprazole (Prilosec) - CYP2C19
- Tramadol (Ultram) - CYP2D6
- Tamoxifen (Nolvadex) - CYP2D6
- Atorvastatin (Lipitor) - SLCO1B1
- Amitriptyline (Elavil) - CYP2D6

## How It Works

1. Upload your raw genetic data file (or try a demo profile)
2. PharmXD extracts pharmacogenomic variants
3. Star alleles and metabolizer phenotypes are determined
4. Search for any medication to get personalized recommendations

## Technology

- Pure HTML/CSS/JavaScript (no frameworks)
- Client-side processing only
- Progressive Web App (PWA) ready
- Based on CPIC guidelines (cpicpgx.org)

## Data Sources

- [CPIC Guidelines](https://cpicpgx.org/) - Clinical Pharmacogenetics Implementation Consortium
- [PharmGKB](https://www.pharmgkb.org/) - Pharmacogenomics Knowledge Base
- [FDA Drug Labels](https://www.fda.gov/) - Pharmacogenomic biomarker information

## Disclaimer

**PharmXD is for educational and informational purposes only.** It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician or pharmacist before making any medication decisions.

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please open an issue or submit a pull request.
