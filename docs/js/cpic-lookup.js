/**
 * cpic-lookup.js
 * CPIC Guideline Lookup for PharmXD
 * Contains embedded guideline data and lookup functions
 */

const CPICLookup = (function() {
    'use strict';

    /**
     * CPIC Guidelines Database
     * Based on cpicpgx.org guidelines (simplified for MVP)
     */
    const GUIDELINES = {
        clopidogrel: {
            name: 'Clopidogrel',
            brandNames: ['Plavix'],
            drugClass: 'Antiplatelet Agent',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-clopidogrel-and-cyp2c19/',
            lastUpdated: '2022',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal or increased platelet inhibition.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal clopidogrel metabolism; expected platelet inhibition.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider alternative antiplatelet therapy (prasugrel, ticagrelor) if no contraindication exists. If using clopidogrel, be aware of possible reduced platelet inhibition.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced formation of active metabolite; reduced platelet inhibition; increased risk for adverse cardiovascular events.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Use alternative antiplatelet therapy (prasugrel or ticagrelor) as recommended.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Significantly reduced formation of active metabolite; significantly reduced platelet inhibition; significantly increased risk for adverse cardiovascular events.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Tests are available to identify patients who are CYP2C19 poor metabolizers. Consider use of another platelet P2Y12 inhibitor in patients identified as CYP2C19 poor metabolizers.'
        },

        codeine: {
            name: 'Codeine',
            brandNames: ['Tylenol with Codeine', 'Various combinations'],
            drugClass: 'Opioid Analgesic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid codeine. Select alternative analgesic such as morphine (not tramadol or hydrocodone).',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Greatly increased morphine formation, leading to higher risk of toxicity including respiratory depression and death.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use label-recommended age- or weight-specific dosing.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal morphine formation following codeine administration.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use label-recommended age- or weight-specific dosing. If inadequate pain relief, consider alternative analgesic.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced morphine formation. May result in reduced analgesia.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid codeine. Select alternative analgesic such as morphine (not tramadol).',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Greatly reduced morphine formation. Significantly reduced analgesia; risk of therapeutic failure.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Some individuals may be ultra-rapid metabolizers because of a specific CYP2D6 genotype. These individuals convert codeine into its active metabolite, morphine, more rapidly and completely than other people. This rapid conversion results in higher than expected serum morphine levels.'
        },

        simvastatin: {
            name: 'Simvastatin',
            brandNames: ['Zocor'],
            drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
            gene: 'SLCO1B1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/',
            lastUpdated: '2014',
            recommendations: {
                normal_function: {
                    recommendation: 'Prescribe desired starting dose and adjust based on disease-specific guidelines.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal myopathy risk.',
                    icon: '✓'
                },
                intermediate_function: {
                    recommendation: 'Prescribe a lower dose or consider an alternative statin (e.g., pravastatin, rosuvastatin). Consider routine creatine kinase surveillance.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Increased plasma concentration of simvastatin acid; 4.5-fold increased risk of myopathy.',
                    icon: '⚠'
                },
                poor_function: {
                    recommendation: 'Prescribe alternative statin (pravastatin, rosuvastatin) or if simvastatin is required, limit dose to ≤20 mg/day.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Significantly increased plasma concentration of simvastatin acid; 17-fold increased risk of myopathy.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Predisposing factors for myopathy include the SLCO1B1 (c.521T>C) polymorphism.'
        },

        warfarin: {
            name: 'Warfarin',
            brandNames: ['Coumadin', 'Jantoven'],
            drugClass: 'Anticoagulant',
            genes: ['CYP2C9', 'VKORC1'],
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/',
            lastUpdated: '2017',
            recommendations: {
                standard: {
                    recommendation: 'Use warfarin dosing algorithm. Calculate dose based on CYP2C9 and VKORC1 genotypes using validated algorithms (e.g., warfarindosing.org).',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Genotype-guided dosing reduces time to stable INR and bleeding risk.',
                    icon: '✓'
                },
                reduced_dose: {
                    recommendation: 'Reduce initial dose. CYP2C9 variants and/or VKORC1 A allele require lower doses to achieve therapeutic INR.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Increased warfarin sensitivity; higher bleeding risk at standard doses.',
                    icon: '⚠'
                },
                significantly_reduced: {
                    recommendation: 'Significantly reduce dose (may need 50-80% reduction). Consider alternative anticoagulant (e.g., DOAC) if available and appropriate.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Very high warfarin sensitivity; high bleeding risk even at low doses.',
                    icon: '✗'
                }
            },
            fdaLabel: 'The patient\'s CYP2C9 and VKORC1 genotype information, when available, can assist in selection of the initial dose of COUMADIN.'
        },

        omeprazole: {
            name: 'Omeprazole',
            brandNames: ['Prilosec', 'Losec'],
            drugClass: 'Proton Pump Inhibitor',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-proton-pump-inhibitors-and-cyp2c19/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'For H. pylori eradication: increase dose by 50-100% or use alternative PPI (rabeprazole). For GERD: standard dose; increase if inadequate response.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased metabolism may reduce efficacy, especially for H. pylori eradication.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism and expected efficacy.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Slightly increased drug exposure; standard dosing appropriate.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'For chronic therapy (>12 weeks): consider 50% dose reduction and monitor for adverse effects.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Substantially increased drug exposure. Long-term high exposure may increase risks.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'In poor metabolizers, omeprazole plasma concentrations are substantially elevated.'
        },

        tramadol: {
            name: 'Tramadol',
            brandNames: ['Ultram', 'ConZip'],
            drugClass: 'Opioid Analgesic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid tramadol. Select alternative analgesic.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Increased formation of active metabolite O-desmethyltramadol (M1); increased risk of toxicity.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use label-recommended dosing.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal tramadol metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use label-recommended dosing. If inadequate response, consider alternative analgesic.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced formation of active metabolite; possible reduced analgesia.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid tramadol. Select alternative analgesic.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Greatly reduced formation of active metabolite; likely inadequate pain relief.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Tramadol is metabolized to its active metabolite by CYP2D6. Patients who are ultra-rapid metabolizers may have increased exposure to O-desmethyltramadol.'
        },

        tamoxifen: {
            name: 'Tamoxifen',
            brandNames: ['Nolvadex', 'Soltamox'],
            drugClass: 'Selective Estrogen Receptor Modulator',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/cpic-guideline-for-tamoxifen-based-on-cyp2d6-genotype/',
            lastUpdated: '2018',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal to increased endoxifen formation.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal endoxifen formation.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose. Consider avoiding strong CYP2D6 inhibitors.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced endoxifen formation; may have reduced efficacy.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Consider alternative hormone therapy (e.g., aromatase inhibitor for postmenopausal women) or higher dose tamoxifen with therapeutic drug monitoring.',
                    classification: 'avoid',
                    strength: 'Moderate',
                    implications: 'Significantly reduced endoxifen formation; possibly reduced efficacy.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have lower endoxifen plasma concentrations.'
        },

        atorvastatin: {
            name: 'Atorvastatin',
            brandNames: ['Lipitor'],
            drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
            gene: 'SLCO1B1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/',
            lastUpdated: '2014',
            recommendations: {
                normal_function: {
                    recommendation: 'Prescribe desired starting dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Normal myopathy risk.',
                    icon: '✓'
                },
                intermediate_function: {
                    recommendation: 'Prescribe desired starting dose; consider routine CK surveillance.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Modest increase in atorvastatin exposure; somewhat increased myopathy risk.',
                    icon: '⚠'
                },
                poor_function: {
                    recommendation: 'Consider lower starting dose and/or routine CK surveillance. Alternative: pravastatin or rosuvastatin.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased atorvastatin exposure; increased myopathy risk (though less than simvastatin).',
                    icon: '⚠'
                }
            },
            fdaLabel: 'Predisposing factors for myopathy include the SLCO1B1 polymorphism.'
        },

        amitriptyline: {
            name: 'Amitriptyline',
            brandNames: ['Elavil'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid tricyclic due to potential lack of efficacy. Consider alternative drug not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Moderate',
                    implications: 'Increased metabolism to less active metabolites; possibly reduced efficacy.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% reduction of recommended starting dose.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced metabolism; increased plasma concentrations.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid tricyclic use. If tricyclic necessary, consider 50% reduction of starting dose.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Greatly reduced metabolism; substantially increased plasma concentrations and adverse effect risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher plasma concentrations of tricyclic antidepressants.'
        },

        // Additional CYP2C19 drugs
        pantoprazole: {
            name: 'Pantoprazole',
            brandNames: ['Protonix'],
            drugClass: 'Proton Pump Inhibitor',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-proton-pump-inhibitors-and-cyp2c19/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'For H. pylori eradication: increase dose by 50-100%. For GERD: standard dose; increase if inadequate response.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased metabolism may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism and expected efficacy.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal drug exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'For chronic therapy (>12 weeks): consider 50% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased drug exposure with long-term use.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'Poor CYP2C19 metabolizers have higher pantoprazole plasma concentrations.'
        },

        citalopram: {
            name: 'Citalopram',
            brandNames: ['Celexa'],
            drugClass: 'SSRI Antidepressant',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2015',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Select alternative SSRI not extensively metabolized by CYP2C19 (e.g., sertraline, fluoxetine). If citalopram used, insufficient data for dosing recommendation.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations; potential for decreased efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased plasma concentrations.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 50% reduction of recommended starting dose. Max dose 20 mg/day.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Substantially increased plasma concentrations; increased risk of QT prolongation.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 poor metabolizers have higher citalopram concentrations. Maximum recommended dose is 20 mg/day for poor metabolizers.'
        },

        escitalopram: {
            name: 'Escitalopram',
            brandNames: ['Lexapro'],
            drugClass: 'SSRI Antidepressant',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2015',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Select alternative SSRI. If escitalopram used, titrate to max dose if no response.',
                    classification: 'caution',
                    strength: 'Optional',
                    implications: 'Reduced plasma concentrations may result in decreased efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased plasma concentrations.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 50% reduction of recommended starting dose.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Substantially increased plasma concentrations.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 poor metabolizers have higher escitalopram plasma concentrations.'
        },

        sertraline: {
            name: 'Sertraline',
            brandNames: ['Zoloft'],
            drugClass: 'SSRI Antidepressant',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2015',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended starting dose. Titrate dose per clinical response.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations but clinically significant effect unclear.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal drug exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use recommended starting dose. Consider 50% reduction if side effects occur.',
                    classification: 'standard',
                    strength: 'Optional',
                    implications: 'Increased plasma concentrations but clinical significance unclear.',
                    icon: '✓'
                }
            },
            fdaLabel: 'Sertraline is metabolized by multiple CYP enzymes. No FDA dosing adjustments specified for CYP2C19 status.'
        },

        // Additional CYP2D6 drugs
        nortriptyline: {
            name: 'Nortriptyline',
            brandNames: ['Pamelor', 'Aventyl'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid tricyclic due to potential lack of efficacy. Consider alternative drug.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Increased metabolism to less active metabolites; reduced efficacy.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% reduction of recommended starting dose.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced metabolism; higher plasma concentrations.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid tricyclic use. If necessary, reduce starting dose by 50%.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially increased plasma concentrations; increased adverse effect risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher plasma concentrations of tricyclic antidepressants.'
        },

        paroxetine: {
            name: 'Paroxetine',
            brandNames: ['Paxil', 'Pexeva'],
            drugClass: 'SSRI Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2015',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Select alternative SSRI not metabolized by CYP2D6 (e.g., sertraline, citalopram).',
                    classification: 'caution',
                    strength: 'Optional',
                    implications: 'Lower plasma concentrations may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal to slightly increased concentrations.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Select alternative SSRI not metabolized by CYP2D6 or consider 50% reduction of starting dose.',
                    classification: 'caution',
                    strength: 'Optional',
                    implications: 'Increased plasma concentrations.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher paroxetine plasma concentrations.'
        },

        fluoxetine: {
            name: 'Fluoxetine',
            brandNames: ['Prozac', 'Sarafem'],
            drugClass: 'SSRI Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-selective-serotonin-reuptake-inhibitors-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2015',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Lower concentrations of active metabolite but clinical effect unclear.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal drug exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use recommended starting dose. Monitor for side effects.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Higher plasma concentrations but similar overall efficacy.',
                    icon: '✓'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher fluoxetine plasma concentrations.'
        },

        metoprolol: {
            name: 'Metoprolol',
            brandNames: ['Lopressor', 'Toprol-XL'],
            drugClass: 'Beta Blocker',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-atomoxetine-and-cyp2d6/',
            lastUpdated: '2020',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Titrate dose to clinical effect. May require higher doses.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations; may have decreased efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended starting dose. Monitor heart rate and blood pressure.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased plasma concentrations.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 50% dose reduction or select alternative beta-blocker (e.g., bisoprolol, carvedilol).',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Substantially increased plasma concentrations; increased bradycardia risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have increased metoprolol concentrations.'
        },

        ondansetron: {
            name: 'Ondansetron',
            brandNames: ['Zofran'],
            drugClass: 'Antiemetic (5-HT3 antagonist)',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-ondansetron-and-cyp2d6/',
            lastUpdated: '2017',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Select alternative antiemetic (e.g., granisetron). If ondansetron used, may have reduced efficacy.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations; may have insufficient antiemetic response.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal drug exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Higher plasma concentrations but no dose adjustment needed.',
                    icon: '✓'
                }
            },
            fdaLabel: 'Ondansetron is metabolized by CYP2D6. No specific FDA dosing recommendations for CYP2D6 variants.'
        },

        // CYP2C9 drugs
        phenytoin: {
            name: 'Phenytoin',
            brandNames: ['Dilantin', 'Phenytek'],
            drugClass: 'Anticonvulsant',
            gene: 'CYP2C9',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-phenytoin-and-cyp2c9-and-hla-b/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per label. Titrate to therapeutic drug level.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal phenytoin metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% reduction of starting dose. Use therapeutic drug monitoring.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced metabolism; higher risk of toxicity at standard doses.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Reduce dose by 50%. Mandatory therapeutic drug monitoring. Consider alternative anticonvulsant.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced clearance; high risk of dose-dependent toxicity.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Patients with CYP2C9 variants may require reduced phenytoin dosages to avoid toxicity.'
        },

        celecoxib: {
            name: 'Celecoxib',
            brandNames: ['Celebrex'],
            drugClass: 'NSAID (COX-2 Inhibitor)',
            gene: 'CYP2C9',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-nsaids-and-cyp2c9/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Start with 50% of lowest recommended dose. Use lowest effective dose for shortest duration.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced clearance; higher drug exposure.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Start with 25% of lowest recommended dose. Consider alternative NSAID (e.g., ibuprofen, aspirin).',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced clearance; significant GI and CV risk increase.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2C9 poor metabolizers have higher celecoxib AUC. Consider starting with half the lowest recommended dose.'
        },

        // Additional SLCO1B1 drugs
        rosuvastatin: {
            name: 'Rosuvastatin',
            brandNames: ['Crestor'],
            drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
            gene: 'SLCO1B1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/',
            lastUpdated: '2014',
            recommendations: {
                normal_function: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal statin uptake and myopathy risk.',
                    icon: '✓'
                },
                intermediate_function: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Minor effect on rosuvastatin pharmacokinetics.',
                    icon: '✓'
                },
                poor_function: {
                    recommendation: 'Use recommended starting dose. Rosuvastatin less affected by SLCO1B1 than simvastatin.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Modest increase in exposure; rosuvastatin remains a good alternative.',
                    icon: '✓'
                }
            },
            fdaLabel: 'SLCO1B1 polymorphisms may affect rosuvastatin exposure.'
        },

        pravastatin: {
            name: 'Pravastatin',
            brandNames: ['Pravachol'],
            drugClass: 'HMG-CoA Reductase Inhibitor (Statin)',
            gene: 'SLCO1B1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/',
            lastUpdated: '2014',
            recommendations: {
                normal_function: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal statin uptake.',
                    icon: '✓'
                },
                intermediate_function: {
                    recommendation: 'Use recommended starting dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Minimal effect on pravastatin pharmacokinetics.',
                    icon: '✓'
                },
                poor_function: {
                    recommendation: 'Use recommended starting dose. Pravastatin is a safe alternative for SLCO1B1 poor function.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Pravastatin least affected by SLCO1B1; low myopathy risk.',
                    icon: '✓'
                }
            },
            fdaLabel: 'SLCO1B1 polymorphisms have minimal effect on pravastatin exposure.'
        },

        // DPYD drugs
        fluorouracil: {
            name: 'Fluorouracil (5-FU)',
            brandNames: ['Adrucil', 'Efudex'],
            drugClass: 'Antimetabolite Chemotherapy',
            gene: 'DPYD',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/',
            lastUpdated: '2017',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per protocol.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal DPD activity and expected drug metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Reduce starting dose by 25-50%. Adjust subsequent doses based on toxicity.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced DPD activity increases toxicity risk.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'AVOID fluorouracil. If no alternative exists, start with greatly reduced dose with therapeutic drug monitoring.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Complete or near-complete DPD deficiency; life-threatening toxicity risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Patients with certain DPYD variants have increased risk of severe, life-threatening toxicity from fluorouracil. Testing is recommended.'
        },

        capecitabine: {
            name: 'Capecitabine',
            brandNames: ['Xeloda'],
            drugClass: 'Antimetabolite Chemotherapy (5-FU prodrug)',
            gene: 'DPYD',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/',
            lastUpdated: '2017',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per protocol.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal DPD activity.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Reduce starting dose by 25-50%. Monitor closely for toxicity.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced DPD activity; increased severe toxicity risk.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'AVOID capecitabine. If no alternative, use greatly reduced dose with monitoring.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'DPD deficiency causes life-threatening toxicity risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Patients with certain DPYD variants are at increased risk of acute, early-onset toxicity and severe, life-threatening, or fatal adverse reactions.'
        },

        // TPMT drugs
        azathioprine: {
            name: 'Azathioprine',
            brandNames: ['Imuran', 'Azasan'],
            drugClass: 'Immunosuppressant',
            gene: 'TPMT',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt/',
            lastUpdated: '2018',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per indication.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal TPMT activity and thiopurine metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Start with 30-70% of target dose. Adjust based on myelotoxicity and response.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced TPMT activity; increased risk of myelosuppression.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Consider alternative agent. If azathioprine necessary, reduce dose to 10% of standard and monitor closely.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Very low TPMT activity; high risk of severe, potentially fatal myelosuppression.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Consider genotyping or phenotyping for TPMT. Patients with low or absent TPMT activity are at increased risk for severe, life-threatening myelotoxicity.'
        },

        mercaptopurine: {
            name: 'Mercaptopurine',
            brandNames: ['Purinethol', 'Purixan'],
            drugClass: 'Antimetabolite (Thiopurine)',
            gene: 'TPMT',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt/',
            lastUpdated: '2018',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per protocol.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal TPMT activity.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Start with 30-70% of target dose. Monitor for myelosuppression.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced TPMT activity; increased myelotoxicity risk.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Reduce dose to 10% of standard dose. Reduce frequency to 3x/week instead of daily.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Very low TPMT activity; severe myelosuppression likely at standard doses.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Patients with inherited little or no TPMT activity are at increased risk for severe myelosuppression. Consider TPMT testing.'
        },

        // UGT1A1 drugs
        irinotecan: {
            name: 'Irinotecan',
            brandNames: ['Camptosar', 'Onivyde'],
            drugClass: 'Topoisomerase Inhibitor (Chemotherapy)',
            gene: 'UGT1A1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-irinotecan-and-ugt1a1/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose per protocol.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal UGT1A1 activity.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Reduce starting dose by one dose level. Monitor closely for neutropenia.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced UGT1A1 activity; increased toxicity risk.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Reduce starting dose by at least 30%. Intensive monitoring required.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Poor UGT1A1 activity; high risk of severe neutropenia and diarrhea.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Individuals who are homozygous for the UGT1A1*28 allele are at increased risk for neutropenia. A reduced initial dose should be considered.'
        },

        atazanavir: {
            name: 'Atazanavir',
            brandNames: ['Reyataz'],
            drugClass: 'HIV Protease Inhibitor',
            gene: 'UGT1A1',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-atazanavir-and-ugt1a1/',
            lastUpdated: '2016',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal bilirubin metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose. Inform patient of higher jaundice risk.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Moderate increase in unconjugated bilirubin.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider alternative if jaundice is a concern. Otherwise use standard dose with counseling.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'High risk of hyperbilirubinemia (jaundice). Cosmetic, not harmful.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'Patients with UGT1A1*28 allele have higher bilirubin levels.'
        },

        // CYP3A5 drugs
        tacrolimus: {
            name: 'Tacrolimus',
            brandNames: ['Prograf', 'Envarsus', 'Astagraf'],
            drugClass: 'Immunosuppressant (Calcineurin Inhibitor)',
            gene: 'CYP3A5',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tacrolimus-and-cyp3a5/',
            lastUpdated: '2015',
            recommendations: {
                extensive_metabolizer: {
                    recommendation: 'Increase starting dose by 1.5-2x. Titrate based on trough levels.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'CYP3A5 expressors have higher tacrolimus clearance; may need higher doses.',
                    icon: '⚠'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use standard starting dose. Titrate based on trough levels.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Intermediate tacrolimus metabolism.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use standard starting dose. Non-expressors typically achieve targets with standard dosing.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Lower tacrolimus clearance; standard doses usually sufficient.',
                    icon: '✓'
                }
            },
            fdaLabel: 'CYP3A5 expressors may require higher doses of tacrolimus to achieve target concentrations.'
        },

        // CYP2B6 drugs
        efavirenz: {
            name: 'Efavirenz',
            brandNames: ['Sustiva', 'Stocrin'],
            drugClass: 'NNRTI (HIV Antiretroviral)',
            gene: 'CYP2B6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-efavirenz-and-cyp2b6/',
            lastUpdated: '2019',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use 600 mg daily.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal efavirenz metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use 600 mg daily. Monitor for CNS side effects.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased efavirenz exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 400 mg daily or alternative antiretroviral. Monitor for CNS toxicity.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Significantly increased efavirenz exposure; higher CNS toxicity risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2B6 polymorphisms affect efavirenz plasma levels.'
        },

        // CYP1A2 drugs
        clozapine: {
            name: 'Clozapine',
            brandNames: ['Clozaril', 'FazaClo'],
            drugClass: 'Atypical Antipsychotic',
            gene: 'CYP1A2',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'May require higher doses. Titrate based on clinical response.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Faster clozapine metabolism; potentially subtherapeutic levels.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose. May need lower maintenance dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly decreased metabolism.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Reduce dose by 30-50%. Monitor for adverse effects.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Substantially decreased metabolism; increased toxicity risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP1A2 is a major enzyme for clozapine metabolism.'
        },

        // Additional CYP2D6 drugs
        risperidone: {
            name: 'Risperidone',
            brandNames: ['Risperdal'],
            drugClass: 'Atypical Antipsychotic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'May need higher dose. Monitor efficacy.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Lower active moiety concentrations.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased concentrations.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 30-50% dose reduction or alternative.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Higher active moiety concentrations; increased side effect risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher risperidone concentrations.'
        },

        aripiprazole: {
            name: 'Aripiprazole',
            brandNames: ['Abilify', 'Aristada'],
            drugClass: 'Atypical Antipsychotic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose. Efficacy may be reduced.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Lower aripiprazole exposure.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Reduce dose to 75% of normal (max 10 mg/day for oral).',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Substantially increased exposure.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'Reduce aripiprazole dose to 50% of usual dose in CYP2D6 poor metabolizers.'
        },

        haloperidol: {
            name: 'Haloperidol',
            brandNames: ['Haldol'],
            drugClass: 'Typical Antipsychotic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'May need higher dose for efficacy.',
                    classification: 'caution',
                    strength: 'Optional',
                    implications: 'Faster metabolism may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Normal to slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 50% dose reduction. Monitor for EPS and QT prolongation.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased haloperidol exposure; higher toxicity risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers may have increased haloperidol exposure.'
        },

        venlafaxine: {
            name: 'Venlafaxine',
            brandNames: ['Effexor', 'Effexor XR'],
            drugClass: 'SNRI Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2020',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Active metabolite compensates for faster parent metabolism.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal overall exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use recommended dose. Monitor for side effects.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Higher parent drug but similar total active moiety.',
                    icon: '✓'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher venlafaxine and lower O-desmethylvenlafaxine concentrations.'
        },

        atomoxetine: {
            name: 'Atomoxetine',
            brandNames: ['Strattera'],
            drugClass: 'ADHD Medication (NRI)',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-atomoxetine-and-cyp2d6/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose. May need higher dose for efficacy.',
                    classification: 'caution',
                    strength: 'Optional',
                    implications: 'Lower atomoxetine exposure.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Start at lowest dose. Increase slowly. Max dose may be lower.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Substantially increased exposure (5-10x); higher side effect risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have 5-fold higher atomoxetine AUC. Dosage adjustment may be necessary.'
        },

        hydrocodone: {
            name: 'Hydrocodone',
            brandNames: ['Vicodin', 'Norco', 'Lortab'],
            drugClass: 'Opioid Analgesic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/',
            lastUpdated: '2019',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use with caution. Consider alternative analgesic.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased conversion to hydromorphone; possible enhanced effects.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use label-recommended dosing.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use label-recommended dosing.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Slightly reduced conversion to active metabolite.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use with caution. May have reduced efficacy. Consider alternative.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced conversion to hydromorphone; may have reduced analgesia.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'Hydrocodone is metabolized by CYP2D6 to hydromorphone.'
        },

        oxycodone: {
            name: 'Oxycodone',
            brandNames: ['OxyContin', 'Percocet', 'Roxicodone'],
            drugClass: 'Opioid Analgesic',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use recommended dose with caution.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Possible increased active metabolite formation.',
                    icon: '✓'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal efficacy expected.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use recommended dose. Efficacy generally maintained.',
                    classification: 'standard',
                    strength: 'Moderate',
                    implications: 'Minor CYP2D6 pathway; minimal clinical impact.',
                    icon: '✓'
                }
            },
            fdaLabel: 'CYP2D6 converts oxycodone to oxymorphone. Clinical significance unclear.'
        },

        // Additional CYP2C19 drugs
        lansoprazole: {
            name: 'Lansoprazole',
            brandNames: ['Prevacid'],
            drugClass: 'Proton Pump Inhibitor',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-proton-pump-inhibitors-and-cyp2c19/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'For H. pylori: increase dose. For GERD: standard dose; increase if needed.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased metabolism may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'For chronic use (>12 weeks): consider 50% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased exposure with long-term use.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 poor metabolizers have higher lansoprazole exposure.'
        },

        voriconazole: {
            name: 'Voriconazole',
            brandNames: ['Vfend'],
            drugClass: 'Azole Antifungal',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-voriconazole-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use alternative antifungal if possible. If voriconazole necessary, use therapeutic drug monitoring.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced exposure; likely subtherapeutic levels.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal to slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'Use standard loading dose, then reduce maintenance dose by 50%.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Substantially increased exposure; higher toxicity risk.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 poor metabolizers have 4-fold higher voriconazole exposure. Consider dose reduction.'
        },

        // Additional CYP2C9 drugs
        flurbiprofen: {
            name: 'Flurbiprofen',
            brandNames: ['Ansaid', 'Ocufen'],
            drugClass: 'NSAID',
            gene: 'CYP2C9',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-nsaids-and-cyp2c9/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use lowest effective dose for shortest duration.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced clearance; higher exposure.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Use alternative NSAID (e.g., aspirin, ketorolac) or reduce dose significantly.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced clearance; high GI/CV risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2C9 metabolizes flurbiprofen.'
        },

        piroxicam: {
            name: 'Piroxicam',
            brandNames: ['Feldene'],
            drugClass: 'NSAID',
            gene: 'CYP2C9',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-nsaids-and-cyp2c9/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use lowest effective dose for shortest duration.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced clearance.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid piroxicam. Choose alternative NSAID.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced clearance; high toxicity risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2C9 is involved in piroxicam metabolism.'
        },

        meloxicam: {
            name: 'Meloxicam',
            brandNames: ['Mobic', 'Vivlodex'],
            drugClass: 'NSAID (COX-2 preferential)',
            gene: 'CYP2C9',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-nsaids-and-cyp2c9/',
            lastUpdated: '2020',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Start with lower dose. Use lowest effective dose.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Reduced clearance.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Start with 50% of lowest recommended dose. Consider alternative.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced clearance.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2C9 poor metabolizers have higher meloxicam exposure.'
        },

        // Additional TPMT/NUDT15 drugs
        thioguanine: {
            name: 'Thioguanine',
            brandNames: ['Tabloid'],
            drugClass: 'Thiopurine Antimetabolite',
            gene: 'TPMT',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt/',
            lastUpdated: '2018',
            recommendations: {
                normal_metabolizer: {
                    recommendation: 'Start with normal dose per protocol.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal risk of myelosuppression.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Reduce starting dose by 30-50%. Adjust based on myelosuppression.',
                    classification: 'caution',
                    strength: 'Strong',
                    implications: 'Moderate risk of myelosuppression.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Consider alternative agents. If thioguanine required, reduce dose by 90% and monitor closely.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'High risk of life-threatening myelosuppression.',
                    icon: '✗'
                }
            },
            fdaLabel: 'TPMT-deficient patients may be at increased risk of myelosuppression.'
        },

        // Additional CYP2D6 tricyclic antidepressants
        desipramine: {
            name: 'Desipramine',
            brandNames: ['Norpramin'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid desipramine. Consider alternative not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Increased metabolism to potentially cardiotoxic metabolite.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Moderately reduced metabolism.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid desipramine. Consider alternative not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced metabolism; high risk of side effects.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2D6 metabolizes desipramine.'
        },

        imipramine: {
            name: 'Imipramine',
            brandNames: ['Tofranil'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Avoid imipramine. Use alternative not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially increased metabolism; likely therapeutic failure.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Moderately reduced metabolism.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid imipramine. Use alternative not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced metabolism; high toxicity risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Imipramine is metabolized by CYP2D6.'
        },

        doxepin: {
            name: 'Doxepin',
            brandNames: ['Sinequan', 'Silenor'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Consider alternative drug not metabolized by CYP2D6.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations; possible reduced efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Moderately reduced metabolism.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Consider alternative drug. If doxepin used, reduce dose by 50%.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced metabolism; high side effect risk.',
                    icon: '✗'
                }
            },
            fdaLabel: 'CYP2D6 poor metabolizers have higher doxepin exposure.'
        },

        trimipramine: {
            name: 'Trimipramine',
            brandNames: ['Surmontil'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use alternative drug not metabolized by CYP2D6.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Reduced plasma concentrations.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Moderately reduced metabolism.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Consider 50% dose reduction and monitor closely.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced metabolism.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Trimipramine is metabolized by CYP2D6.'
        },

        clomipramine: {
            name: 'Clomipramine',
            brandNames: ['Anafranil'],
            drugClass: 'Tricyclic Antidepressant',
            gene: 'CYP2D6',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-tricyclic-antidepressants-and-cyp2d6-and-cyp2c19/',
            lastUpdated: '2016',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'Use alternative drug not metabolized by CYP2D6.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced plasma concentrations; therapeutic failure likely.',
                    icon: '✗'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Consider 25% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Moderately reduced metabolism.',
                    icon: '⚠'
                },
                poor_metabolizer: {
                    recommendation: 'Avoid clomipramine or reduce dose by 50% and monitor closely.',
                    classification: 'avoid',
                    strength: 'Strong',
                    implications: 'Substantially reduced metabolism.',
                    icon: '✗'
                }
            },
            fdaLabel: 'Clomipramine is metabolized by CYP2D6.'
        },

        // Additional PPIs
        esomeprazole: {
            name: 'Esomeprazole',
            brandNames: ['Nexium'],
            drugClass: 'Proton Pump Inhibitor',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-proton-pump-inhibitors-and-cyp2c19/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'For H. pylori: increase dose or use alternative. For GERD: increase if inadequate response.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased metabolism may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal to slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'For chronic use (>12 weeks): consider 50% dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Substantially increased exposure.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 poor metabolizers have higher esomeprazole exposure.'
        },

        dexlansoprazole: {
            name: 'Dexlansoprazole',
            brandNames: ['Dexilant'],
            drugClass: 'Proton Pump Inhibitor',
            gene: 'CYP2C19',
            guidelineUrl: 'https://cpicpgx.org/guidelines/guideline-for-proton-pump-inhibitors-and-cyp2c19/',
            lastUpdated: '2021',
            recommendations: {
                ultrarapid_metabolizer: {
                    recommendation: 'For H. pylori: consider higher dose or alternative.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased metabolism may reduce efficacy.',
                    icon: '⚠'
                },
                normal_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal metabolism.',
                    icon: '✓'
                },
                intermediate_metabolizer: {
                    recommendation: 'Use recommended dose.',
                    classification: 'standard',
                    strength: 'Strong',
                    implications: 'Normal to slightly increased exposure.',
                    icon: '✓'
                },
                poor_metabolizer: {
                    recommendation: 'For chronic use: consider dose reduction.',
                    classification: 'caution',
                    strength: 'Moderate',
                    implications: 'Increased drug exposure.',
                    icon: '⚠'
                }
            },
            fdaLabel: 'CYP2C19 metabolizes dexlansoprazole.'
        }
    };

    /**
     * Get list of all available drugs
     */
    function getDrugList() {
        return Object.keys(GUIDELINES).map(key => ({
            id: key,
            name: GUIDELINES[key].name,
            brandNames: GUIDELINES[key].brandNames,
            drugClass: GUIDELINES[key].drugClass,
            gene: GUIDELINES[key].gene || GUIDELINES[key].genes?.join(', ')
        }));
    }

    /**
     * Search drugs by name
     */
    function searchDrugs(query) {
        const q = query.toLowerCase().trim();
        if (!q) return [];

        return getDrugList().filter(drug => {
            const nameMatch = drug.name.toLowerCase().includes(q);
            const brandMatch = drug.brandNames.some(b => b.toLowerCase().includes(q));
            return nameMatch || brandMatch;
        });
    }

    /**
     * Get drug guideline
     */
    function getDrugGuideline(drugId) {
        return GUIDELINES[drugId.toLowerCase()] || null;
    }

    /**
     * Get recommendation for a drug based on patient's phenotype
     */
    function getRecommendation(drugId, geneProfile) {
        const guideline = getDrugGuideline(drugId);
        if (!guideline) return null;

        // Handle single-gene drugs
        if (guideline.gene) {
            const gene = guideline.gene;
            const profile = geneProfile[gene];

            if (!profile) {
                return {
                    drug: guideline,
                    status: 'no_data',
                    message: `No ${gene} data available`,
                    recommendation: null
                };
            }

            // Map phenotype to recommendation key
            let recKey = profile.phenotype;

            // Handle SLCO1B1 phenotype naming
            if (gene === 'SLCO1B1') {
                if (profile.phenotype === 'normal_metabolizer') recKey = 'normal_function';
                else if (profile.phenotype === 'intermediate_metabolizer') recKey = 'intermediate_function';
                else if (profile.phenotype === 'poor_metabolizer') recKey = 'poor_function';
            }

            const rec = guideline.recommendations[recKey];
            if (!rec) {
                // Try matching by description keywords
                for (const [key, val] of Object.entries(guideline.recommendations)) {
                    if (profile.description.toLowerCase().includes(key.replace('_', ' '))) {
                        return {
                            drug: guideline,
                            gene: gene,
                            diplotype: profile.diplotype,
                            phenotype: profile.description,
                            recommendation: val,
                            fdaLabel: guideline.fdaLabel
                        };
                    }
                }

                return {
                    drug: guideline,
                    gene: gene,
                    diplotype: profile.diplotype,
                    phenotype: profile.description,
                    recommendation: guideline.recommendations.normal_metabolizer || guideline.recommendations.standard,
                    fdaLabel: guideline.fdaLabel
                };
            }

            return {
                drug: guideline,
                gene: gene,
                diplotype: profile.diplotype,
                phenotype: profile.description,
                recommendation: rec,
                fdaLabel: guideline.fdaLabel
            };
        }

        // Handle multi-gene drugs (warfarin)
        if (guideline.genes) {
            const cyp2c9 = geneProfile['CYP2C9'];
            const vkorc1 = geneProfile['VKORC1'];

            // Determine warfarin recommendation based on combined genotypes
            let recKey = 'standard';
            let phenotypeDesc = [];

            if (cyp2c9) {
                phenotypeDesc.push(`CYP2C9: ${cyp2c9.diplotype} (${cyp2c9.description})`);
                if (cyp2c9.phenotype === 'poor_metabolizer') {
                    recKey = 'significantly_reduced';
                } else if (cyp2c9.phenotype === 'intermediate_metabolizer') {
                    recKey = 'reduced_dose';
                }
            }

            if (vkorc1) {
                phenotypeDesc.push(`VKORC1: ${vkorc1.diplotype} (${vkorc1.description})`);
                if (vkorc1.diplotype === 'AA') {
                    recKey = recKey === 'significantly_reduced' ? 'significantly_reduced' : 'reduced_dose';
                } else if (vkorc1.diplotype === 'GA' || vkorc1.diplotype === 'AG') {
                    if (recKey === 'standard') recKey = 'reduced_dose';
                }
            }

            // Combined poor metabolizer + high sensitivity
            if (cyp2c9?.phenotype === 'poor_metabolizer' && (vkorc1?.diplotype === 'AA')) {
                recKey = 'significantly_reduced';
            }

            return {
                drug: guideline,
                genes: guideline.genes,
                phenotype: phenotypeDesc.join(' | '),
                recommendation: guideline.recommendations[recKey],
                fdaLabel: guideline.fdaLabel
            };
        }

        return null;
    }

    // Public API
    return {
        GUIDELINES: GUIDELINES,
        getDrugList: getDrugList,
        searchDrugs: searchDrugs,
        getDrugGuideline: getDrugGuideline,
        getRecommendation: getRecommendation
    };
})();

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CPICLookup;
}
