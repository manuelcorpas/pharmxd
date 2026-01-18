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
