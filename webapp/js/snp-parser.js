/**
 * snp-parser.js
 * Parse genetic data files from 23andMe, AncestryDNA, and similar services
 * Extract pharmacogenomic variants for PharmXD analysis
 */

const SNPParser = (function() {
    'use strict';

    // Pharmacogenomic SNPs of interest
    const PGX_SNPS = {
        // CYP2C19
        'rs4244285': { gene: 'CYP2C19', allele: '*2', effect: 'no_function', chr: '10', pos: '96541616' },
        'rs4986893': { gene: 'CYP2C19', allele: '*3', effect: 'no_function', chr: '10', pos: '96540410' },
        'rs12248560': { gene: 'CYP2C19', allele: '*17', effect: 'increased_function', chr: '10', pos: '96522463' },
        'rs28399504': { gene: 'CYP2C19', allele: '*4', effect: 'no_function', chr: '10', pos: '96521657' },

        // CYP2D6
        'rs3892097': { gene: 'CYP2D6', allele: '*4', effect: 'no_function', chr: '22', pos: '42524947' },
        'rs5030655': { gene: 'CYP2D6', allele: '*6', effect: 'no_function', chr: '22', pos: '42525772' },
        'rs16947': { gene: 'CYP2D6', allele: '*2', effect: 'normal_function', chr: '22', pos: '42523943' },
        'rs1065852': { gene: 'CYP2D6', allele: '*10', effect: 'decreased_function', chr: '22', pos: '42526694' },
        'rs28371725': { gene: 'CYP2D6', allele: '*41', effect: 'decreased_function', chr: '22', pos: '42524175' },

        // CYP2C9
        'rs1799853': { gene: 'CYP2C9', allele: '*2', effect: 'decreased_function', chr: '10', pos: '96702047' },
        'rs1057910': { gene: 'CYP2C9', allele: '*3', effect: 'decreased_function', chr: '10', pos: '96741053' },

        // VKORC1
        'rs9923231': { gene: 'VKORC1', allele: '-1639G>A', effect: 'decreased_expression', chr: '16', pos: '31107689' },

        // SLCO1B1
        'rs4149056': { gene: 'SLCO1B1', allele: '*5', effect: 'decreased_function', chr: '12', pos: '21331549' },

        // DPYD
        'rs3918290': { gene: 'DPYD', allele: '*2A', effect: 'no_function', chr: '1', pos: '97915614' },
        'rs55886062': { gene: 'DPYD', allele: '*13', effect: 'no_function', chr: '1', pos: '98165091' },
        'rs67376798': { gene: 'DPYD', allele: 'D949V', effect: 'decreased_function', chr: '1', pos: '97981395' },

        // TPMT
        'rs1800460': { gene: 'TPMT', allele: '*3B', effect: 'no_function', chr: '6', pos: '18130918' },
        'rs1142345': { gene: 'TPMT', allele: '*3C', effect: 'no_function', chr: '6', pos: '18139228' },
        'rs1800462': { gene: 'TPMT', allele: '*2', effect: 'no_function', chr: '6', pos: '18143955' },

        // UGT1A1
        'rs887829': { gene: 'UGT1A1', allele: '*80', effect: 'tag_for_28', chr: '2', pos: '234668879' }
    };

    /**
     * Detect file format from content
     */
    function detectFormat(content) {
        const lines = content.split('\n').slice(0, 20);

        for (const line of lines) {
            if (line.startsWith('# rsid')) {
                return '23andme';
            }
            if (line.includes('RSID') && line.includes('CHROMOSOME')) {
                return 'ancestrydna';
            }
            if (line.includes('rsid') && line.includes('chromosome')) {
                return 'generic';
            }
        }

        // Check data lines
        for (const line of lines) {
            if (line.startsWith('#')) continue;
            if (line.trim() === '') continue;

            const parts = line.split('\t');
            if (parts.length >= 4 && parts[0].startsWith('rs')) {
                return '23andme';
            }

            const commaParts = line.split(',');
            if (commaParts.length >= 4 && commaParts[0].startsWith('rs')) {
                return 'ancestrydna';
            }
        }

        return 'unknown';
    }

    /**
     * Parse 23andMe format
     * Format: rsid \t chromosome \t position \t genotype
     */
    function parse23andMe(content) {
        const snps = {};
        const lines = content.split('\n');

        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '') continue;

            const parts = line.split('\t');
            if (parts.length >= 4) {
                const rsid = parts[0].trim();
                const genotype = parts[3].trim();

                if (rsid && genotype && genotype !== '--' && genotype !== '00') {
                    snps[rsid] = {
                        rsid: rsid,
                        chromosome: parts[1].trim(),
                        position: parts[2].trim(),
                        genotype: genotype
                    };
                }
            }
        }

        return snps;
    }

    /**
     * Parse AncestryDNA format
     * Format: rsid, chromosome, position, allele1, allele2
     */
    function parseAncestryDNA(content) {
        const snps = {};
        const lines = content.split('\n');
        let headerPassed = false;

        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '') continue;

            // Skip header line
            if (line.includes('rsid') && line.includes('chromosome')) {
                headerPassed = true;
                continue;
            }

            const parts = line.split(/[\t,]/);
            if (parts.length >= 5) {
                const rsid = parts[0].trim();
                const allele1 = parts[3].trim();
                const allele2 = parts[4].trim();

                if (rsid && rsid.startsWith('rs') && allele1 !== '0' && allele2 !== '0') {
                    snps[rsid] = {
                        rsid: rsid,
                        chromosome: parts[1].trim(),
                        position: parts[2].trim(),
                        genotype: allele1 + allele2
                    };
                }
            }
        }

        return snps;
    }

    /**
     * Parse generic format (tab or comma delimited)
     */
    function parseGeneric(content) {
        const snps = {};
        const lines = content.split('\n');

        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '') continue;

            // Try tab first, then comma
            let parts = line.split('\t');
            if (parts.length < 4) {
                parts = line.split(',');
            }

            if (parts.length >= 4) {
                const rsid = parts[0].trim();
                if (rsid.startsWith('rs')) {
                    const genotype = parts[3].trim();
                    if (genotype && genotype !== '--' && genotype !== '00') {
                        snps[rsid] = {
                            rsid: rsid,
                            chromosome: parts[1].trim(),
                            position: parts[2].trim(),
                            genotype: genotype
                        };
                    }
                }
            }
        }

        return snps;
    }

    /**
     * Main parse function - auto-detect format and parse
     */
    function parse(content) {
        const format = detectFormat(content);

        let allSNPs = {};
        switch (format) {
            case '23andme':
                allSNPs = parse23andMe(content);
                break;
            case 'ancestrydna':
                allSNPs = parseAncestryDNA(content);
                break;
            case 'generic':
            default:
                allSNPs = parseGeneric(content);
        }

        // Extract only pharmacogenomic SNPs
        const pgxSNPs = {};
        let pgxCount = 0;

        for (const rsid in PGX_SNPS) {
            if (allSNPs[rsid]) {
                pgxSNPs[rsid] = {
                    ...allSNPs[rsid],
                    ...PGX_SNPS[rsid]
                };
                pgxCount++;
            }
        }

        return {
            format: format,
            totalSNPs: Object.keys(allSNPs).length,
            pgxSNPs: pgxSNPs,
            pgxCount: pgxCount
        };
    }

    /**
     * Read file and parse content
     */
    function parseFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    const result = parse(content);
                    result.fileName = file.name;
                    resolve(result);
                } catch (error) {
                    reject(new Error('Failed to parse file: ' + error.message));
                }
            };

            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Get list of all tracked PGx SNPs
     */
    function getPGxSNPList() {
        return Object.keys(PGX_SNPS).map(rsid => ({
            rsid: rsid,
            ...PGX_SNPS[rsid]
        }));
    }

    /**
     * Get SNP info by rsid
     */
    function getSNPInfo(rsid) {
        return PGX_SNPS[rsid] || null;
    }

    // Public API
    return {
        parse: parse,
        parseFile: parseFile,
        detectFormat: detectFormat,
        getPGxSNPList: getPGxSNPList,
        getSNPInfo: getSNPInfo,
        PGX_SNPS: PGX_SNPS
    };
})();

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SNPParser;
}
