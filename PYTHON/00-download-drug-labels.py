#!/usr/bin/env python3
"""
00-download-drug-labels.py

Download pharmaceutical drug labels from OpenFDA API and DailyMed.
Creates a searchable local database for PharmXD testing.

Data Sources:
- OpenFDA Drug Label API: https://open.fda.gov/apis/drug/label/
- DailyMed Web Services: https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm

Author: Corpas-Core
Date: 2026-01-17
"""

import json
import os
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "DATA" / "DRUG_LABELS"
LOGS_DIR = BASE_DIR / "LOGS"

# Create directories
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOGS_DIR / f"drug_labels_{datetime.now():%Y%m%d_%H%M%S}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# API endpoints
OPENFDA_API = "https://api.fda.gov/drug/label.json"
DAILYMED_API = "https://dailymed.nlm.nih.gov/dailymed/services/v2"

# Drugs to download for MVP (pharmacogenomically relevant)
MVP_DRUGS = [
    # CYP2C19 substrates
    "clopidogrel",
    "omeprazole",
    "pantoprazole",
    "citalopram",
    "escitalopram",
    "voriconazole",

    # CYP2D6 substrates
    "codeine",
    "tramadol",
    "tamoxifen",
    "ondansetron",
    "amitriptyline",
    "nortriptyline",
    "paroxetine",
    "fluoxetine",
    "metoprolol",

    # CYP2C9/VKORC1 substrates
    "warfarin",
    "phenytoin",
    "celecoxib",

    # SLCO1B1 substrates
    "simvastatin",
    "atorvastatin",
    "rosuvastatin",
    "pravastatin",

    # DPYD substrates
    "fluorouracil",
    "capecitabine",

    # TPMT substrates
    "azathioprine",
    "mercaptopurine",

    # UGT1A1 substrates
    "irinotecan",
    "atazanavir",

    # Other common drugs for demo
    "metformin",
    "lisinopril",
    "amlodipine",
    "losartan",
    "gabapentin",
    "sertraline"
]


def fetch_openfda_label(drug_name: str, limit: int = 5) -> Optional[dict]:
    """
    Fetch drug label data from OpenFDA API.

    Args:
        drug_name: Generic drug name to search
        limit: Maximum number of results to return

    Returns:
        dict with drug label data or None if not found
    """
    params = {
        "search": f'openfda.generic_name:"{drug_name}"',
        "limit": limit
    }

    try:
        logger.info(f"Fetching OpenFDA label for: {drug_name}")
        response = requests.get(OPENFDA_API, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()

        if "results" in data and len(data["results"]) > 0:
            logger.info(f"  Found {len(data['results'])} results for {drug_name}")
            return data
        else:
            logger.warning(f"  No results found for {drug_name}")
            return None

    except requests.exceptions.RequestException as e:
        logger.error(f"  Error fetching {drug_name}: {e}")
        return None


def fetch_dailymed_label(drug_name: str) -> Optional[dict]:
    """
    Fetch drug label metadata from DailyMed API.

    Args:
        drug_name: Generic drug name to search

    Returns:
        dict with DailyMed SPL data or None if not found
    """
    url = f"{DAILYMED_API}/spls.json"
    params = {
        "drug_name": drug_name,
        "pagesize": 10
    }

    try:
        logger.info(f"Fetching DailyMed info for: {drug_name}")
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()

        if "data" in data and len(data["data"]) > 0:
            logger.info(f"  Found {len(data['data'])} DailyMed entries for {drug_name}")
            return data
        else:
            logger.warning(f"  No DailyMed results for {drug_name}")
            return None

    except requests.exceptions.RequestException as e:
        logger.error(f"  Error fetching DailyMed {drug_name}: {e}")
        return None


def extract_pharmacogenomics_info(label_data: dict) -> dict:
    """
    Extract pharmacogenomics-relevant information from a drug label.

    Args:
        label_data: Raw OpenFDA label data

    Returns:
        dict with extracted PGx information
    """
    pgx_info = {
        "has_pharmacogenomics": False,
        "pgx_sections": [],
        "mentioned_genes": [],
        "mentioned_metabolizers": []
    }

    # Keywords to search for
    pgx_keywords = [
        "CYP2D6", "CYP2C19", "CYP2C9", "CYP3A4", "CYP3A5",
        "VKORC1", "SLCO1B1", "DPYD", "TPMT", "UGT1A1",
        "poor metabolizer", "intermediate metabolizer", "extensive metabolizer",
        "ultrarapid metabolizer", "pharmacogenomic", "pharmacogenetic",
        "genetic polymorphism", "genotype", "phenotype"
    ]

    # Sections likely to contain PGx info
    pgx_sections = [
        "clinical_pharmacology",
        "drug_interactions",
        "warnings_and_cautions",
        "warnings",
        "precautions",
        "dosage_and_administration",
        "use_in_specific_populations"
    ]

    if "results" not in label_data:
        return pgx_info

    for result in label_data["results"]:
        for section in pgx_sections:
            if section in result:
                text = " ".join(result[section]) if isinstance(result[section], list) else str(result[section])
                text_lower = text.lower()

                for keyword in pgx_keywords:
                    if keyword.lower() in text_lower:
                        pgx_info["has_pharmacogenomics"] = True
                        if section not in pgx_info["pgx_sections"]:
                            pgx_info["pgx_sections"].append(section)

                        # Track specific genes mentioned
                        if keyword.startswith("CYP") or keyword in ["VKORC1", "SLCO1B1", "DPYD", "TPMT", "UGT1A1"]:
                            if keyword not in pgx_info["mentioned_genes"]:
                                pgx_info["mentioned_genes"].append(keyword)

                        # Track metabolizer phenotypes
                        if "metabolizer" in keyword.lower():
                            if keyword not in pgx_info["mentioned_metabolizers"]:
                                pgx_info["mentioned_metabolizers"].append(keyword)

    return pgx_info


def create_drug_index(all_labels: dict) -> dict:
    """
    Create a searchable index of all downloaded drug labels.

    Args:
        all_labels: Dictionary of drug name -> label data

    Returns:
        Search index dictionary
    """
    index = {
        "meta": {
            "created": datetime.now().isoformat(),
            "total_drugs": len(all_labels),
            "source": "OpenFDA + DailyMed"
        },
        "drugs": {},
        "by_gene": {},
        "pgx_relevant": []
    }

    for drug_name, data in all_labels.items():
        if data is None:
            continue

        pgx_info = extract_pharmacogenomics_info(data.get("openfda", {}))

        drug_entry = {
            "name": drug_name,
            "has_openfda": data.get("openfda") is not None,
            "has_dailymed": data.get("dailymed") is not None,
            "pgx_info": pgx_info
        }

        # Extract brand names if available
        if data.get("openfda") and "results" in data["openfda"]:
            for result in data["openfda"]["results"]:
                if "openfda" in result:
                    drug_entry["brand_names"] = result["openfda"].get("brand_name", [])
                    drug_entry["manufacturer"] = result["openfda"].get("manufacturer_name", [])
                    break

        index["drugs"][drug_name] = drug_entry

        # Index by gene
        for gene in pgx_info["mentioned_genes"]:
            if gene not in index["by_gene"]:
                index["by_gene"][gene] = []
            index["by_gene"][gene].append(drug_name)

        # Track PGx-relevant drugs
        if pgx_info["has_pharmacogenomics"]:
            index["pgx_relevant"].append(drug_name)

    return index


def download_all_mvp_drugs():
    """
    Download labels for all MVP drugs and create searchable database.
    """
    logger.info("=" * 60)
    logger.info("PharmXD Drug Label Downloader")
    logger.info("=" * 60)
    logger.info(f"Downloading labels for {len(MVP_DRUGS)} drugs")

    all_labels = {}

    for i, drug in enumerate(MVP_DRUGS, 1):
        logger.info(f"\n[{i}/{len(MVP_DRUGS)}] Processing: {drug}")

        # Fetch from both sources
        openfda_data = fetch_openfda_label(drug)
        time.sleep(0.2)  # Rate limiting

        dailymed_data = fetch_dailymed_label(drug)
        time.sleep(0.2)  # Rate limiting

        all_labels[drug] = {
            "openfda": openfda_data,
            "dailymed": dailymed_data,
            "downloaded_at": datetime.now().isoformat()
        }

        # Save individual drug file
        drug_file = DATA_DIR / f"{drug.lower()}.json"
        with open(drug_file, 'w') as f:
            json.dump(all_labels[drug], f, indent=2)
        logger.info(f"  Saved to: {drug_file}")

    # Create and save the search index
    logger.info("\nCreating search index...")
    index = create_drug_index(all_labels)

    index_file = DATA_DIR / "drug_index.json"
    with open(index_file, 'w') as f:
        json.dump(index, f, indent=2)
    logger.info(f"Search index saved to: {index_file}")

    # Summary statistics
    logger.info("\n" + "=" * 60)
    logger.info("DOWNLOAD SUMMARY")
    logger.info("=" * 60)
    logger.info(f"Total drugs processed: {len(MVP_DRUGS)}")
    logger.info(f"Drugs with OpenFDA data: {sum(1 for d in all_labels.values() if d.get('openfda'))}")
    logger.info(f"Drugs with DailyMed data: {sum(1 for d in all_labels.values() if d.get('dailymed'))}")
    logger.info(f"PGx-relevant drugs found: {len(index['pgx_relevant'])}")

    logger.info("\nGenes mentioned in labels:")
    for gene, drugs in sorted(index["by_gene"].items()):
        logger.info(f"  {gene}: {len(drugs)} drugs ({', '.join(drugs[:3])}{'...' if len(drugs) > 3 else ''})")

    return all_labels, index


def search_drug(drug_name: str) -> Optional[dict]:
    """
    Search for a drug in the local database.

    Args:
        drug_name: Drug name to search for

    Returns:
        Drug label data or None
    """
    drug_file = DATA_DIR / f"{drug_name.lower()}.json"

    if drug_file.exists():
        with open(drug_file) as f:
            return json.load(f)

    return None


if __name__ == "__main__":
    all_labels, index = download_all_mvp_drugs()

    print("\n" + "=" * 60)
    print("EXAMPLE: Searching for clopidogrel")
    print("=" * 60)

    clop = search_drug("clopidogrel")
    if clop and clop.get("openfda"):
        pgx = extract_pharmacogenomics_info(clop["openfda"])
        print(f"Has PGx info: {pgx['has_pharmacogenomics']}")
        print(f"Genes mentioned: {pgx['mentioned_genes']}")
        print(f"Metabolizer types: {pgx['mentioned_metabolizers']}")
