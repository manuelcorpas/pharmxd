/**
 * app.js
 * Main PharmXD Application
 * Pharmacogenomic Dosing Advisor
 */

const PharmXD = (function() {
    'use strict';

    // Application state
    let state = {
        pgxSNPs: null,
        geneProfile: null,
        fileName: null,
        totalSNPs: 0,
        pgxCount: 0
    };

    // Demo data
    const DEMO_DATA = {
        sarah: {
            name: 'Sarah',
            description: '45-year-old with cardiac stent. CYP2C19 Intermediate Metabolizer.',
            data: `# PharmXD Demo Sample: Sarah
# rsid\tchromosome\tposition\tgenotype
rs4244285\tCYP2C19\t0\tAG
rs4986893\tCYP2C19\t0\tGG
rs12248560\tCYP2C19\t0\tCC
rs3892097\tCYP2D6\t0\tCC
rs16947\tCYP2D6\t0\tGG
rs1799853\tCYP2C9\t0\tCT
rs1057910\tCYP2C9\t0\tAA
rs9923231\tVKORC1\t0\tGA
rs4149056\tSLCO1B1\t0\tTT
rs3918290\tDPYD\t0\tCC
rs1800460\tTPMT\t0\tCC
rs1142345\tTPMT\t0\tTT`
        },
        john: {
            name: 'John',
            description: '62-year-old with chronic pain. CYP2D6 Poor Metabolizer.',
            data: `# PharmXD Demo Sample: John
# rsid\tchromosome\tposition\tgenotype
rs4244285\tCYP2C19\t0\tGG
rs4986893\tCYP2C19\t0\tGG
rs12248560\tCYP2C19\t0\tCC
rs3892097\tCYP2D6\t0\tTT
rs16947\tCYP2D6\t0\tAA
rs1799853\tCYP2C9\t0\tCC
rs1057910\tCYP2C9\t0\tAA
rs9923231\tVKORC1\t0\tGG
rs4149056\tSLCO1B1\t0\tCC
rs3918290\tDPYD\t0\tCC
rs1800460\tTPMT\t0\tCC
rs1142345\tTPMT\t0\tTT`
        }
    };

    // DOM Elements
    const elements = {};

    /**
     * Initialize the application
     */
    function init() {
        // Cache DOM elements
        cacheElements();

        // Set up event listeners
        setupEventListeners();

        // Initialize drug search
        initDrugSearch();

        console.log('PharmXD initialized');
    }

    /**
     * Cache frequently used DOM elements
     */
    function cacheElements() {
        elements.uploadZone = document.getElementById('upload-zone');
        elements.fileInput = document.getElementById('file-input');
        elements.stepUpload = document.getElementById('step-upload');
        elements.stepProfile = document.getElementById('step-profile');
        elements.stepDrugs = document.getElementById('step-drugs');
        elements.profileLoading = document.getElementById('profile-loading');
        elements.profileResults = document.getElementById('profile-results');
        elements.snpCount = document.getElementById('snp-count');
        elements.geneCards = document.getElementById('gene-cards');
        elements.drugSearchInput = document.getElementById('drug-search-input');
        elements.drugSuggestions = document.getElementById('drug-suggestions');
        elements.drugChips = document.getElementById('drug-chips');
        elements.drugResult = document.getElementById('drug-result');
        elements.modal = document.getElementById('result-modal');
        elements.modalBody = document.getElementById('modal-body');
        elements.modalClose = document.querySelector('.modal-close');
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // File upload - use direct event binding
        console.log('Setting up file input listener on:', elements.fileInput);

        elements.fileInput.addEventListener('change', function(e) {
            console.log('File input change event fired');
            handleFileSelect(e);
        });

        // Upload button click
        const uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function(e) {
                console.log('Upload button clicked');
                e.stopPropagation();
                elements.fileInput.click();
            });
        }

        // Drag and drop
        elements.uploadZone.addEventListener('dragover', handleDragOver);
        elements.uploadZone.addEventListener('dragleave', handleDragLeave);
        elements.uploadZone.addEventListener('drop', handleDrop);

        // Click anywhere in zone (except button) opens file dialog
        elements.uploadZone.addEventListener('click', function(e) {
            console.log('Upload zone clicked, target:', e.target.tagName, e.target.id);
            if (e.target.id === 'upload-btn' || e.target.id === 'file-input') {
                return;
            }
            console.log('Triggering file input from zone click');
            elements.fileInput.click();
        });

        // Demo buttons
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', () => loadDemo(btn.dataset.demo));
        });

        // Drug chips
        elements.drugChips.addEventListener('click', (e) => {
            if (e.target.classList.contains('drug-chip')) {
                lookupDrug(e.target.dataset.drug);
            }
        });

        // Modal close
        elements.modalClose.addEventListener('click', closeModal);
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });
    }

    /**
     * Handle file selection
     */
    function handleFileSelect(e) {
        console.log('handleFileSelect triggered', e.target.files);
        const file = e.target.files[0];
        if (file) {
            console.log('Processing file:', file.name, file.size, 'bytes');
            processFile(file);
        } else {
            console.log('No file selected');
        }
        // Reset input so the same file can be selected again
        e.target.value = '';
    }

    /**
     * Handle drag over
     */
    function handleDragOver(e) {
        e.preventDefault();
        elements.uploadZone.classList.add('dragover');
    }

    /**
     * Handle drag leave
     */
    function handleDragLeave(e) {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');
    }

    /**
     * Handle file drop
     */
    function handleDrop(e) {
        e.preventDefault();
        elements.uploadZone.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }

    /**
     * Process uploaded file
     */
    async function processFile(file) {
        console.log('processFile started for:', file.name);

        showStep('profile');
        elements.profileLoading.classList.remove('hidden');
        elements.profileResults.classList.add('hidden');

        try {
            console.log('Calling SNPParser.parseFile...');
            const result = await SNPParser.parseFile(file);
            console.log('SNPParser result:', result);

            state.pgxSNPs = result.pgxSNPs;
            state.fileName = result.fileName;
            state.totalSNPs = result.totalSNPs;
            state.pgxCount = result.pgxCount;

            console.log('Calling PhenotypeCaller.getFullProfile...');
            state.geneProfile = PhenotypeCaller.getFullProfile(result.pgxSNPs);
            console.log('Gene profile:', state.geneProfile);

            displayProfile();
            console.log('processFile completed successfully');
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file: ' + error.message);
            showStep('upload');
        }
    }

    /**
     * Load demo data
     */
    function loadDemo(demoId) {
        const demo = DEMO_DATA[demoId];
        if (!demo) return;

        showStep('profile');
        elements.profileLoading.classList.remove('hidden');
        elements.profileResults.classList.add('hidden');

        // Simulate loading delay
        setTimeout(() => {
            const result = SNPParser.parse(demo.data);
            state.pgxSNPs = result.pgxSNPs;
            state.fileName = `Demo: ${demo.name}`;
            state.totalSNPs = result.totalSNPs;
            state.pgxCount = result.pgxCount;

            // Get phenotype profile
            state.geneProfile = PhenotypeCaller.getFullProfile(result.pgxSNPs);

            displayProfile();
        }, 500);
    }

    /**
     * Display genetic profile
     */
    function displayProfile() {
        elements.profileLoading.classList.add('hidden');
        elements.profileResults.classList.remove('hidden');

        // Update SNP count
        elements.snpCount.textContent = state.pgxCount;

        // Generate gene cards
        elements.geneCards.innerHTML = '';

        const geneOrder = ['CYP2C19', 'CYP2D6', 'CYP2C9', 'VKORC1', 'SLCO1B1', 'DPYD', 'TPMT'];

        for (const gene of geneOrder) {
            const profile = state.geneProfile[gene];
            if (profile) {
                const card = createGeneCard(profile);
                elements.geneCards.appendChild(card);
            }
        }

        // Show drugs step
        showStep('drugs');
    }

    /**
     * Create gene card element
     */
    function createGeneCard(profile) {
        const card = document.createElement('div');
        const category = PhenotypeCaller.getPhenotypeCategory(profile.phenotype);
        card.className = `gene-card ${category}`;

        card.innerHTML = `
            <div class="gene-card-header">
                <span class="gene-name">${profile.gene}</span>
                <span class="gene-diplotype">${profile.diplotype || 'N/A'}</span>
            </div>
            <div class="gene-phenotype">
                <span class="phenotype-badge ${category}">${profile.description || 'Unknown'}</span>
            </div>
        `;

        return card;
    }

    /**
     * Initialize drug search
     */
    function initDrugSearch() {
        let debounceTimer;

        elements.drugSearchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    showDrugSuggestions(query);
                } else {
                    hideDrugSuggestions();
                }
            }, 200);
        });

        elements.drugSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    lookupDrug(query);
                    hideDrugSuggestions();
                }
            }
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.drugSearchInput.contains(e.target) &&
                !elements.drugSuggestions.contains(e.target)) {
                hideDrugSuggestions();
            }
        });
    }

    /**
     * Show drug suggestions
     */
    function showDrugSuggestions(query) {
        const matches = CPICLookup.searchDrugs(query);

        if (matches.length === 0) {
            hideDrugSuggestions();
            return;
        }

        elements.drugSuggestions.innerHTML = matches.map(drug => `
            <div class="suggestion-item" data-drug="${drug.id}">
                <strong>${drug.name}</strong>
                <span style="color: var(--gray-500); font-size: 0.8125rem;"> - ${drug.gene}</span>
            </div>
        `).join('');

        // Add click handlers
        elements.drugSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                lookupDrug(item.dataset.drug);
                hideDrugSuggestions();
                elements.drugSearchInput.value = '';
            });
        });

        elements.drugSuggestions.classList.remove('hidden');
    }

    /**
     * Hide drug suggestions
     */
    function hideDrugSuggestions() {
        elements.drugSuggestions.classList.add('hidden');
    }

    /**
     * Look up drug recommendation
     */
    function lookupDrug(drugId) {
        if (!state.geneProfile) {
            alert('Please upload your genetic data first.');
            return;
        }

        const result = CPICLookup.getRecommendation(drugId, state.geneProfile);

        if (!result) {
            elements.drugResult.innerHTML = `
                <div class="drug-result-body">
                    <p>Drug "${drugId}" not found in database.</p>
                </div>
            `;
            elements.drugResult.classList.remove('hidden');
            return;
        }

        displayDrugResult(result);
    }

    /**
     * Display drug recommendation result
     */
    function displayDrugResult(result) {
        const drug = result.drug;
        const rec = result.recommendation;

        let recClass = rec?.classification || 'standard';
        let icon = rec?.icon || '?';
        let title = 'Standard Dosing';

        if (recClass === 'caution') {
            title = 'Use with Caution';
        } else if (recClass === 'avoid') {
            title = 'Avoid or Use Alternative';
        }

        elements.drugResult.innerHTML = `
            <div class="drug-result-header">
                <h3>${drug.name}</h3>
                <span class="drug-class">${drug.drugClass}</span>
            </div>
            <div class="drug-result-body">
                <div class="result-section">
                    <h4>Your Genetic Profile</h4>
                    <p><strong>${result.gene || result.genes?.join(', ')}:</strong> ${result.phenotype}</p>
                    ${result.diplotype ? `<p style="font-family: monospace; color: var(--gray-500);">Diplotype: ${result.diplotype}</p>` : ''}
                </div>

                <div class="recommendation-box ${recClass}">
                    <h4>${icon} ${title}</h4>
                    <p>${rec?.recommendation || 'No specific recommendation available.'}</p>
                </div>

                ${rec?.implications ? `
                <div class="result-section">
                    <h4>Clinical Implications</h4>
                    <p>${rec.implications}</p>
                </div>
                ` : ''}

                ${result.fdaLabel ? `
                <div class="result-section">
                    <h4>FDA Label Information</h4>
                    <div class="fda-label">"${result.fdaLabel}"</div>
                </div>
                ` : ''}

                <a href="${drug.guidelineUrl}" target="_blank" class="source-link">
                    View full CPIC guideline →
                </a>
            </div>
        `;

        elements.drugResult.classList.remove('hidden');

        // Scroll to result
        elements.drugResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Show specific step
     */
    function showStep(stepId) {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        const targetStep = document.getElementById(`step-${stepId}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        // Also show previous steps
        if (stepId === 'profile' || stepId === 'drugs') {
            elements.stepUpload.classList.add('active');
        }
        if (stepId === 'drugs') {
            elements.stepProfile.classList.add('active');
        }
    }

    /**
     * Show modal
     */
    function showModal(content) {
        elements.modalBody.innerHTML = content;
        elements.modal.classList.remove('hidden');
    }

    /**
     * Close modal
     */
    function closeModal() {
        elements.modal.classList.add('hidden');
    }

    /**
     * Get current state (for debugging)
     */
    function getState() {
        return state;
    }

    // Public API
    return {
        init: init,
        getState: getState,
        lookupDrug: lookupDrug
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', PharmXD.init);
