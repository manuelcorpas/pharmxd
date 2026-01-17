/**
 * phenotype.js
 * Determine metabolizer phenotypes from genetic variants
 * Based on CPIC star allele definitions
 */

const PhenotypeCaller = (function() {
    'use strict';

    /**
     * Gene definitions with variant-to-star-allele mappings
     * Simplified for common DTC-detectable variants
     */
    const GENE_DEFINITIONS = {
        CYP2C19: {
            name: 'Cytochrome P450 2C19',
            function: 'Drug metabolism',
            refAllele: '*1',
            variants: {
                'rs4244285': { allele: '*2', altBase: 'A', effect: 'no_function' },
                'rs4986893': { allele: '*3', altBase: 'A', effect: 'no_function' },
                'rs12248560': { allele: '*17', altBase: 'T', effect: 'increased_function' },
                'rs28399504': { allele: '*4', altBase: 'G', effect: 'no_function' }
            },
            phenotypeRules: {
                'ultrarapid_metabolizer': {
                    conditions: ['*17/*17', '*1/*17'],
                    description: 'Ultrarapid Metabolizer',
                    activity: 'increased'
                },
                'normal_metabolizer': {
                    conditions: ['*1/*1'],
                    description: 'Normal Metabolizer',
                    activity: 'normal'
                },
                'intermediate_metabolizer': {
                    conditions: ['*1/*2', '*1/*3', '*2/*17', '*1/*4'],
                    description: 'Intermediate Metabolizer',
                    activity: 'decreased'
                },
                'poor_metabolizer': {
                    conditions: ['*2/*2', '*2/*3', '*3/*3', '*2/*4', '*3/*4', '*4/*4'],
                    description: 'Poor Metabolizer',
                    activity: 'none'
                }
            }
        },

        CYP2D6: {
            name: 'Cytochrome P450 2D6',
            function: 'Drug metabolism (25% of all drugs)',
            refAllele: '*1',
            variants: {
                'rs3892097': { allele: '*4', altBase: 'T', effect: 'no_function' },
                'rs5030655': { allele: '*6', altBase: 'DEL', effect: 'no_function' },
                'rs16947': { allele: '*2', altBase: 'A', effect: 'normal_function' },
                'rs1065852': { allele: '*10', altBase: 'T', effect: 'decreased_function' },
                'rs28371725': { allele: '*41', altBase: 'T', effect: 'decreased_function' }
            },
            phenotypeRules: {
                'ultrarapid_metabolizer': {
                    conditions: ['*1/*1xN', '*2/*2xN'],
                    description: 'Ultrarapid Metabolizer',
                    activity: 'increased',
                    note: 'Requires gene duplication testing (not detectable from standard arrays)'
                },
                'normal_metabolizer': {
                    conditions: ['*1/*1', '*1/*2', '*2/*2'],
                    description: 'Normal Metabolizer',
                    activity: 'normal'
                },
                'intermediate_metabolizer': {
                    conditions: ['*1/*4', '*1/*10', '*1/*41', '*10/*10', '*4/*10', '*10/*41', '*41/*41'],
                    description: 'Intermediate Metabolizer',
                    activity: 'decreased'
                },
                'poor_metabolizer': {
                    conditions: ['*4/*4', '*4/*6', '*6/*6', '*4/*41'],
                    description: 'Poor Metabolizer',
                    activity: 'none'
                }
            }
        },

        CYP2C9: {
            name: 'Cytochrome P450 2C9',
            function: 'Warfarin and NSAID metabolism',
            refAllele: '*1',
            variants: {
                'rs1799853': { allele: '*2', altBase: 'T', effect: 'decreased_function' },
                'rs1057910': { allele: '*3', altBase: 'C', effect: 'decreased_function' }
            },
            phenotypeRules: {
                'normal_metabolizer': {
                    conditions: ['*1/*1'],
                    description: 'Normal Metabolizer',
                    activity: 'normal'
                },
                'intermediate_metabolizer': {
                    conditions: ['*1/*2', '*1/*3', '*2/*2'],
                    description: 'Intermediate Metabolizer',
                    activity: 'decreased'
                },
                'poor_metabolizer': {
                    conditions: ['*2/*3', '*3/*3'],
                    description: 'Poor Metabolizer',
                    activity: 'none'
                }
            }
        },

        VKORC1: {
            name: 'Vitamin K Epoxide Reductase',
            function: 'Warfarin target enzyme',
            refAllele: 'G',
            variants: {
                'rs9923231': { allele: 'A', altBase: 'A', effect: 'decreased_expression' }
            },
            phenotypeRules: {
                'normal_warfarin_sensitivity': {
                    conditions: ['GG'],
                    description: 'Normal Warfarin Sensitivity',
                    activity: 'normal'
                },
                'intermediate_warfarin_sensitivity': {
                    conditions: ['GA', 'AG'],
                    description: 'Intermediate Warfarin Sensitivity',
                    activity: 'decreased'
                },
                'high_warfarin_sensitivity': {
                    conditions: ['AA'],
                    description: 'High Warfarin Sensitivity',
                    activity: 'low'
                }
            }
        },

        SLCO1B1: {
            name: 'Solute Carrier Organic Anion Transporter 1B1',
            function: 'Hepatic statin uptake',
            refAllele: 'T',
            variants: {
                'rs4149056': { allele: '*5', altBase: 'C', effect: 'decreased_function' }
            },
            phenotypeRules: {
                'normal_function': {
                    conditions: ['TT'],
                    description: 'Normal Function',
                    activity: 'normal'
                },
                'intermediate_function': {
                    conditions: ['TC', 'CT'],
                    description: 'Intermediate Function',
                    activity: 'decreased'
                },
                'poor_function': {
                    conditions: ['CC'],
                    description: 'Poor Function',
                    activity: 'none'
                }
            }
        },

        DPYD: {
            name: 'Dihydropyrimidine Dehydrogenase',
            function: 'Fluoropyrimidine metabolism',
            refAllele: 'Normal',
            variants: {
                'rs3918290': { allele: '*2A', altBase: 'T', effect: 'no_function' },
                'rs55886062': { allele: '*13', altBase: 'C', effect: 'no_function' },
                'rs67376798': { allele: 'D949V', altBase: 'A', effect: 'decreased_function' }
            },
            phenotypeRules: {
                'normal_metabolizer': {
                    conditions: ['Normal/Normal'],
                    description: 'Normal Metabolizer',
                    activity: 'normal'
                },
                'intermediate_metabolizer': {
                    conditions: ['Normal/*2A', 'Normal/*13', 'Normal/D949V'],
                    description: 'Intermediate Metabolizer',
                    activity: 'decreased'
                },
                'poor_metabolizer': {
                    conditions: ['*2A/*2A', '*2A/*13', '*13/*13'],
                    description: 'Poor Metabolizer',
                    activity: 'none'
                }
            }
        },

        TPMT: {
            name: 'Thiopurine S-Methyltransferase',
            function: 'Thiopurine metabolism',
            refAllele: '*1',
            variants: {
                'rs1800460': { allele: '*3B', altBase: 'T', effect: 'no_function' },
                'rs1142345': { allele: '*3C', altBase: 'C', effect: 'no_function' },
                'rs1800462': { allele: '*2', altBase: 'G', effect: 'no_function' }
            },
            phenotypeRules: {
                'normal_metabolizer': {
                    conditions: ['*1/*1'],
                    description: 'Normal Metabolizer',
                    activity: 'normal'
                },
                'intermediate_metabolizer': {
                    conditions: ['*1/*2', '*1/*3A', '*1/*3B', '*1/*3C'],
                    description: 'Intermediate Metabolizer',
                    activity: 'decreased'
                },
                'poor_metabolizer': {
                    conditions: ['*2/*2', '*2/*3A', '*3A/*3A', '*3B/*3B', '*3C/*3C'],
                    description: 'Poor Metabolizer',
                    activity: 'none'
                }
            }
        }
    };

    /**
     * Determine star alleles from SNP genotypes for a gene
     */
    function callStarAlleles(gene, pgxSNPs) {
        const geneDef = GENE_DEFINITIONS[gene];
        if (!geneDef) return null;

        const alleles = [];
        const detectedVariants = [];

        // Check each variant
        for (const [rsid, variantDef] of Object.entries(geneDef.variants)) {
            const snp = pgxSNPs[rsid];
            if (snp) {
                const genotype = snp.genotype.toUpperCase();
                const altBase = variantDef.altBase.toUpperCase();

                // Count alt alleles
                const altCount = (genotype.match(new RegExp(altBase, 'g')) || []).length;

                if (altCount > 0) {
                    detectedVariants.push({
                        rsid: rsid,
                        genotype: genotype,
                        allele: variantDef.allele,
                        copies: altCount
                    });
                }
            }
        }

        // Construct diplotype based on detected variants
        let diplotype;
        if (gene === 'VKORC1' || gene === 'SLCO1B1') {
            // Simple genotype-based genes
            const snp = pgxSNPs['rs9923231'] || pgxSNPs['rs4149056'];
            diplotype = snp ? snp.genotype.toUpperCase() : null;
        } else {
            // Star allele genes
            diplotype = constructDiplotype(gene, detectedVariants, geneDef);
        }

        return {
            gene: gene,
            geneName: geneDef.name,
            function: geneDef.function,
            diplotype: diplotype,
            detectedVariants: detectedVariants
        };
    }

    /**
     * Construct diplotype string from detected variants
     */
    function constructDiplotype(gene, detectedVariants, geneDef) {
        if (detectedVariants.length === 0) {
            return geneDef.refAllele + '/' + geneDef.refAllele;
        }

        // For DPYD and TPMT, use different logic
        if (gene === 'DPYD') {
            const hasVariant = detectedVariants.length > 0;
            const homozygous = detectedVariants.some(v => v.copies === 2);
            if (!hasVariant) return 'Normal/Normal';
            if (homozygous) return detectedVariants[0].allele + '/' + detectedVariants[0].allele;
            return 'Normal/' + detectedVariants[0].allele;
        }

        // Sort by functional impact (no_function first)
        const sorted = detectedVariants.sort((a, b) => {
            const effectA = geneDef.variants[a.rsid]?.effect || '';
            const effectB = geneDef.variants[b.rsid]?.effect || '';
            if (effectA === 'no_function' && effectB !== 'no_function') return -1;
            if (effectB === 'no_function' && effectA !== 'no_function') return 1;
            return 0;
        });

        // Build allele calls
        const allele1Parts = [];
        const allele2Parts = [];

        for (const v of sorted) {
            if (v.copies === 2) {
                // Homozygous for variant
                allele1Parts.push(v.allele);
                allele2Parts.push(v.allele);
            } else if (v.copies === 1) {
                // Heterozygous
                if (allele1Parts.length === 0) {
                    allele1Parts.push(v.allele);
                } else if (allele2Parts.length === 0) {
                    allele2Parts.push(v.allele);
                }
            }
        }

        // Fill with reference allele if needed
        const allele1 = allele1Parts.length > 0 ? allele1Parts[0] : geneDef.refAllele;
        const allele2 = allele2Parts.length > 0 ? allele2Parts[0] : geneDef.refAllele;

        // Sort alleles for consistent representation
        const alleles = [allele1, allele2].sort();
        return alleles.join('/');
    }

    /**
     * Determine phenotype from diplotype
     */
    function callPhenotype(gene, diplotype) {
        const geneDef = GENE_DEFINITIONS[gene];
        if (!geneDef || !diplotype) return null;

        // Normalize diplotype for matching
        const normalizedDiplotype = diplotype.toUpperCase();

        for (const [phenotypeKey, phenotypeDef] of Object.entries(geneDef.phenotypeRules)) {
            for (const condition of phenotypeDef.conditions) {
                const normalizedCondition = condition.toUpperCase();

                // Check both orderings
                if (normalizedDiplotype === normalizedCondition) {
                    return {
                        phenotype: phenotypeKey,
                        description: phenotypeDef.description,
                        activity: phenotypeDef.activity,
                        note: phenotypeDef.note
                    };
                }

                // Try reversed order
                const parts = normalizedCondition.split('/');
                if (parts.length === 2) {
                    const reversed = parts[1] + '/' + parts[0];
                    if (normalizedDiplotype === reversed) {
                        return {
                            phenotype: phenotypeKey,
                            description: phenotypeDef.description,
                            activity: phenotypeDef.activity,
                            note: phenotypeDef.note
                        };
                    }
                }
            }
        }

        // Default to normal if no match found
        return {
            phenotype: 'normal_metabolizer',
            description: 'Normal (inferred)',
            activity: 'normal',
            note: 'No variant alleles detected'
        };
    }

    /**
     * Get full profile for all genes
     */
    function getFullProfile(pgxSNPs) {
        const profile = {};

        for (const gene of Object.keys(GENE_DEFINITIONS)) {
            const starAlleleResult = callStarAlleles(gene, pgxSNPs);
            if (starAlleleResult && starAlleleResult.diplotype) {
                const phenotypeResult = callPhenotype(gene, starAlleleResult.diplotype);
                profile[gene] = {
                    ...starAlleleResult,
                    ...phenotypeResult
                };
            }
        }

        return profile;
    }

    /**
     * Get phenotype category for UI styling
     */
    function getPhenotypeCategory(phenotype) {
        if (!phenotype) return 'unknown';

        const phenotypeLower = phenotype.toLowerCase();

        if (phenotypeLower.includes('poor') || phenotypeLower.includes('ultrarapid')) {
            return 'poor';
        }
        if (phenotypeLower.includes('intermediate') || phenotypeLower.includes('decreased')) {
            return 'intermediate';
        }
        if (phenotypeLower.includes('normal') || phenotypeLower.includes('high')) {
            return 'normal';
        }

        return 'unknown';
    }

    /**
     * Get activity score for a phenotype
     */
    function getActivityScore(activity) {
        const scores = {
            'increased': 2,
            'normal': 1,
            'decreased': 0.5,
            'low': 0.25,
            'none': 0
        };
        return scores[activity] || 1;
    }

    // Public API
    return {
        GENE_DEFINITIONS: GENE_DEFINITIONS,
        callStarAlleles: callStarAlleles,
        callPhenotype: callPhenotype,
        getFullProfile: getFullProfile,
        getPhenotypeCategory: getPhenotypeCategory,
        getActivityScore: getActivityScore
    };
})();

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhenotypeCaller;
}
