/**
 * i18n.js
 * Internationalization support for PharmXD
 * English and Spanish translations
 */

const I18n = (function() {
    'use strict';

    // Current language
    let currentLang = localStorage.getItem('pharmxd-lang') ||
                      (navigator.language.startsWith('es') ? 'es' : 'en');

    // Translations
    const translations = {
        en: {
            // Header
            tagline: 'Get personalized medication dosing based on your DNA',
            taglineSub: 'Upload your 23andMe or AncestryDNA file to check if your genes affect how you respond to common medications',

            // Step 1: Upload
            step1Title: 'Upload Your Genetic Data',
            step1Desc: 'Upload your raw genetic data file from 23andMe, AncestryDNA, or similar services.',
            dataPrivacy: 'Your data stays on your device',
            dataPrivacyFull: ' - nothing is uploaded to any server.',
            dragDrop: 'Drag & drop your file here',
            or: 'or',
            chooseFile: 'Choose File',
            fileHint: 'Accepts .txt or .csv files from 23andMe, AncestryDNA',
            noData: 'No genetic data? Try a demo:',
            demoSarah: 'Sarah',
            demoSarahDesc: 'CYP2C19 Intermediate',
            demoJohn: 'John',
            demoJohnDesc: 'CYP2D6 Poor Metabolizer',

            // Step 2: Profile
            step2Title: 'Your Pharmacogenetic Profile',
            analyzing: 'Analyzing genetic variants...',
            variantsAnalyzed: 'pharmacogenomic variants analyzed',
            uploadNew: 'Upload New Genetic File',

            // Step 3: Summary
            step3Title: 'Your Drug Response Summary',
            summaryIntro: "Based on your genetic profile, here's how you may respond to",
            medicationsInDb: 'medications in our database:',
            standardDosing: 'Standard dosing',
            useWithCaution: 'Use with caution',
            avoidOrAlt: 'Avoid or use alternative',
            medsAttention: 'Medications requiring attention:',
            getWalletCard: 'Get Your Wallet Card',

            // Step 4: Drug Lookup
            step4Title: 'Check Your Medications',
            searchPlaceholder: 'Search for a medication...',
            commonMeds: 'Common medications:',

            // Drug Result
            yourGeneticProfile: 'Your Genetic Profile',
            diplotype: 'Diplotype',
            clinicalImplications: 'Clinical Implications',
            fdaLabel: 'FDA Label Information',
            viewGuideline: 'View full CPIC guideline →',
            drugNotFound: 'Drug not found in database.',
            standardTitle: 'Standard Dosing',
            cautionTitle: 'Use with Caution',
            avoidTitle: 'Avoid or Use Alternative',

            // Wallet Card
            walletTitle: 'Pharmacogenetic Alert Card',
            walletProfile: 'My Genetic Profile',
            walletMedsAttention: 'Medications Requiring Attention',
            walletDisclaimer: 'Show this card to your doctor or pharmacist',
            printCard: 'Print Card',
            saveImage: 'Save as Image',
            noneIdentified: 'None identified',

            // Footer
            disclaimer: 'Disclaimer:',
            disclaimerText: 'PharmXD is for educational purposes only. It is not a substitute for professional medical advice. Always consult your physician or pharmacist before making medication decisions.',
            dataSources: 'Data sources:',
            privacyNote: 'Your genetic data never leaves your device',

            // Alerts
            uploadFirst: 'Please upload your genetic data first.',
            newVersion: 'New version available! Reload to update?',

            // Phenotypes
            poor_metabolizer: 'Poor Metabolizer',
            intermediate_metabolizer: 'Intermediate Metabolizer',
            normal_metabolizer: 'Normal Metabolizer',
            ultrarapid_metabolizer: 'Ultrarapid Metabolizer',
            unknown: 'Unknown',

            // Labels
            caution: 'Caution',
            avoid: 'Avoid'
        },

        es: {
            // Header
            tagline: 'Obtén dosificación personalizada de medicamentos según tu ADN',
            taglineSub: 'Sube tu archivo de 23andMe o AncestryDNA para verificar si tus genes afectan cómo respondes a los medicamentos comunes',

            // Step 1: Upload
            step1Title: 'Sube Tus Datos Genéticos',
            step1Desc: 'Sube tu archivo de datos genéticos sin procesar de 23andMe, AncestryDNA o servicios similares.',
            dataPrivacy: 'Tus datos permanecen en tu dispositivo',
            dataPrivacyFull: ' - nada se sube a ningún servidor.',
            dragDrop: 'Arrastra y suelta tu archivo aquí',
            or: 'o',
            chooseFile: 'Seleccionar Archivo',
            fileHint: 'Acepta archivos .txt o .csv de 23andMe, AncestryDNA',
            noData: '¿No tienes datos genéticos? Prueba una demo:',
            demoSarah: 'Sara',
            demoSarahDesc: 'CYP2C19 Intermedio',
            demoJohn: 'Juan',
            demoJohnDesc: 'CYP2D6 Metabolizador Lento',

            // Step 2: Profile
            step2Title: 'Tu Perfil Farmacogenético',
            analyzing: 'Analizando variantes genéticas...',
            variantsAnalyzed: 'variantes farmacogenómicas analizadas',
            uploadNew: 'Subir Nuevo Archivo Genético',

            // Step 3: Summary
            step3Title: 'Resumen de Tu Respuesta a Medicamentos',
            summaryIntro: 'Según tu perfil genético, así podrías responder a',
            medicationsInDb: 'medicamentos en nuestra base de datos:',
            standardDosing: 'Dosis estándar',
            useWithCaution: 'Usar con precaución',
            avoidOrAlt: 'Evitar o usar alternativa',
            medsAttention: 'Medicamentos que requieren atención:',
            getWalletCard: 'Obtener Tarjeta de Bolsillo',

            // Step 4: Drug Lookup
            step4Title: 'Consulta Tus Medicamentos',
            searchPlaceholder: 'Buscar un medicamento...',
            commonMeds: 'Medicamentos comunes:',

            // Drug Result
            yourGeneticProfile: 'Tu Perfil Genético',
            diplotype: 'Diplotipo',
            clinicalImplications: 'Implicaciones Clínicas',
            fdaLabel: 'Información de la Etiqueta FDA',
            viewGuideline: 'Ver guía CPIC completa →',
            drugNotFound: 'Medicamento no encontrado en la base de datos.',
            standardTitle: 'Dosis Estándar',
            cautionTitle: 'Usar con Precaución',
            avoidTitle: 'Evitar o Usar Alternativa',

            // Wallet Card
            walletTitle: 'Tarjeta de Alerta Farmacogenética',
            walletProfile: 'Mi Perfil Genético',
            walletMedsAttention: 'Medicamentos que Requieren Atención',
            walletDisclaimer: 'Muestra esta tarjeta a tu médico o farmacéutico',
            printCard: 'Imprimir Tarjeta',
            saveImage: 'Guardar como Imagen',
            noneIdentified: 'Ninguno identificado',

            // Footer
            disclaimer: 'Aviso:',
            disclaimerText: 'PharmXD es solo para fines educativos. No sustituye el consejo médico profesional. Siempre consulta a tu médico o farmacéutico antes de tomar decisiones sobre medicamentos.',
            dataSources: 'Fuentes de datos:',
            privacyNote: 'Tus datos genéticos nunca salen de tu dispositivo',

            // Alerts
            uploadFirst: 'Por favor, sube tus datos genéticos primero.',
            newVersion: '¡Nueva versión disponible! ¿Recargar para actualizar?',

            // Phenotypes
            poor_metabolizer: 'Metabolizador Lento',
            intermediate_metabolizer: 'Metabolizador Intermedio',
            normal_metabolizer: 'Metabolizador Normal',
            ultrarapid_metabolizer: 'Metabolizador Ultrarrápido',
            unknown: 'Desconocido',

            // Labels
            caution: 'Precaución',
            avoid: 'Evitar'
        }
    };

    /**
     * Get translation for a key
     */
    function t(key) {
        return translations[currentLang][key] || translations['en'][key] || key;
    }

    /**
     * Get current language
     */
    function getLang() {
        return currentLang;
    }

    /**
     * Set language
     */
    function setLang(lang) {
        if (translations[lang]) {
            currentLang = lang;
            localStorage.setItem('pharmxd-lang', lang);
            return true;
        }
        return false;
    }

    /**
     * Toggle between languages
     */
    function toggleLang() {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLang(newLang);
        return newLang;
    }

    /**
     * Get all available languages
     */
    function getLanguages() {
        return Object.keys(translations);
    }

    // Public API
    return {
        t: t,
        getLang: getLang,
        setLang: setLang,
        toggleLang: toggleLang,
        getLanguages: getLanguages
    };
})();

// Export for Node.js environments (testing)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
