#!/usr/bin/env python3
"""
01-download-opensnp.py

Download and process the GenomePrep-curated openSNP genotype bundle.
Creates sample test genotypes for PharmXD development.

Data Source:
- GenomePrep: https://supfam.mrc-lmb.cam.ac.uk/GenomePrep/downloads.html
- Direct download: https://supfam.mrc-lmb.cam.ac.uk/GenomePrep/resource/opensnp.zip
- Paper: Lu et al., Comp Struct Biotech J (2021) doi:10.1016/j.csbj.2021.06.040

Contains ~5000 quality-controlled genomes from openSNP (CC0 public domain)
Original sources: 23andMe (~78%), AncestryDNA (~14%), FTDNA, MyHeritage (~8%)

Author: Corpas-Core
Date: 2026-01-17
"""

import json
import os
import zipfile
import logging
import random
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List
import urllib.request
import ssl

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / "DATA" / "OPENSNP"
SAMPLE_DIR = BASE_DIR / "DATA" / "SAMPLE_GENOTYPES"
LOGS_DIR = BASE_DIR / "LOGS"

# Create directories
DATA_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOGS_DIR / f"opensnp_{datetime.now():%Y%m%d_%H%M%S}.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Download URL (note: SSL cert may be expired, we handle this)
OPENSNP_URL = "https://supfam.mrc-lmb.cam.ac.uk/GenomePrep/resource/opensnp.zip"
OPENSNP_ALT_URL = "http://supfam.mrc-lmb.cam.ac.uk/GenomePrep/resource/opensnp.zip"

# Pharmacogenomic SNPs to extract (key variants from our pharmacogenes.json)
PGX_SNPS = {
    # CYP2C19
    "rs4244285": {"gene": "CYP2C19", "allele": "*2", "effect": "no_function"},
    "rs4986893": {"gene": "CYP2C19", "allele": "*3", "effect": "no_function"},
    "rs12248560": {"gene": "CYP2C19", "allele": "*17", "effect": "increased_function"},
    "rs28399504": {"gene": "CYP2C19", "allele": "*4", "effect": "no_function"},

    # CYP2D6
    "rs3892097": {"gene": "CYP2D6", "allele": "*4", "effect": "no_function"},
    "rs5030655": {"gene": "CYP2D6", "allele": "*6", "effect": "no_function"},
    "rs16947": {"gene": "CYP2D6", "allele": "*2", "effect": "normal_function"},
    "rs1065852": {"gene": "CYP2D6", "allele": "*10/*4", "effect": "decreased_function"},
    "rs28371725": {"gene": "CYP2D6", "allele": "*41", "effect": "decreased_function"},

    # CYP2C9
    "rs1799853": {"gene": "CYP2C9", "allele": "*2", "effect": "decreased_function"},
    "rs1057910": {"gene": "CYP2C9", "allele": "*3", "effect": "decreased_function"},

    # VKORC1
    "rs9923231": {"gene": "VKORC1", "allele": "-1639G>A", "effect": "decreased_expression"},

    # SLCO1B1
    "rs4149056": {"gene": "SLCO1B1", "allele": "*5", "effect": "decreased_function"},

    # DPYD
    "rs3918290": {"gene": "DPYD", "allele": "*2A", "effect": "no_function"},
    "rs55886062": {"gene": "DPYD", "allele": "*13", "effect": "no_function"},
    "rs67376798": {"gene": "DPYD", "allele": "D949V", "effect": "decreased_function"},

    # TPMT
    "rs1800460": {"gene": "TPMT", "allele": "*3B", "effect": "no_function"},
    "rs1142345": {"gene": "TPMT", "allele": "*3C", "effect": "no_function"},
    "rs1800462": {"gene": "TPMT", "allele": "*2", "effect": "no_function"},

    # UGT1A1 (Note: rs8175347 is the TA repeat, hard to genotype from arrays)
    "rs887829": {"gene": "UGT1A1", "allele": "*80", "effect": "tag_for_UGT1A1*28"},
}


def download_with_progress(url: str, dest_path: Path, allow_insecure: bool = True) -> bool:
    """
    Download a file with progress reporting.

    Args:
        url: URL to download from
        dest_path: Destination file path
        allow_insecure: Allow HTTPS without certificate verification

    Returns:
        True if successful, False otherwise
    """
    logger.info(f"Downloading from: {url}")
    logger.info(f"Destination: {dest_path}")

    try:
        # Create SSL context that doesn't verify certs (GenomePrep cert may be expired)
        if allow_insecure:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
        else:
            ctx = None

        # Open URL
        with urllib.request.urlopen(url, context=ctx) as response:
            total_size = int(response.headers.get('Content-Length', 0))
            logger.info(f"File size: {total_size / (1024*1024):.1f} MB")

            # Download with progress
            downloaded = 0
            chunk_size = 1024 * 1024  # 1 MB chunks

            with open(dest_path, 'wb') as f:
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        pct = (downloaded / total_size) * 100
                        logger.info(f"  Downloaded: {downloaded / (1024*1024):.1f} MB ({pct:.1f}%)")

        logger.info(f"Download complete: {dest_path}")
        return True

    except Exception as e:
        logger.error(f"Download failed: {e}")
        return False


def extract_pgx_snps_from_file(genotype_file: Path) -> Dict[str, str]:
    """
    Extract pharmacogenomic SNPs from a genotype file.

    Args:
        genotype_file: Path to a genotype file (23andMe format or similar)

    Returns:
        Dictionary of rsID -> genotype
    """
    pgx_genotypes = {}

    try:
        with open(genotype_file, 'r', errors='ignore') as f:
            for line in f:
                # Skip comments
                if line.startswith('#'):
                    continue

                # Parse tab-delimited: rsid, chromosome, position, genotype
                parts = line.strip().split('\t')
                if len(parts) >= 4:
                    rsid = parts[0]
                    genotype = parts[3] if len(parts) > 3 else parts[-1]

                    # Check if this is a PGx SNP
                    if rsid in PGX_SNPS:
                        pgx_genotypes[rsid] = genotype

                # Alternative: comma-delimited
                elif ',' in line:
                    parts = line.strip().split(',')
                    if len(parts) >= 4:
                        rsid = parts[0]
                        genotype = parts[3] if len(parts) > 3 else parts[-1]
                        if rsid in PGX_SNPS:
                            pgx_genotypes[rsid] = genotype

    except Exception as e:
        logger.warning(f"Error reading {genotype_file}: {e}")

    return pgx_genotypes


def process_opensnp_bundle(zip_path: Path, max_samples: int = 100) -> List[Dict]:
    """
    Process the openSNP zip bundle and extract PGx SNPs from samples.

    Args:
        zip_path: Path to the opensnp.zip file
        max_samples: Maximum number of samples to process

    Returns:
        List of sample dictionaries with PGx genotypes
    """
    samples = []

    logger.info(f"Processing openSNP bundle: {zip_path}")

    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            # List all files
            all_files = zf.namelist()
            genotype_files = [f for f in all_files if f.endswith('.txt') or f.endswith('.csv')]

            logger.info(f"Found {len(genotype_files)} genotype files")

            # Randomly sample files
            sample_files = random.sample(genotype_files, min(max_samples, len(genotype_files)))

            for i, filename in enumerate(sample_files, 1):
                logger.info(f"Processing [{i}/{len(sample_files)}]: {filename}")

                # Extract to temp location
                zf.extract(filename, DATA_DIR)
                extracted_path = DATA_DIR / filename

                # Extract PGx SNPs
                pgx_data = extract_pgx_snps_from_file(extracted_path)

                if pgx_data:
                    sample = {
                        "sample_id": Path(filename).stem,
                        "source_file": filename,
                        "pgx_snps": pgx_data,
                        "snp_count": len(pgx_data)
                    }
                    samples.append(sample)
                    logger.info(f"  Found {len(pgx_data)} PGx SNPs")

                # Clean up extracted file
                if extracted_path.exists():
                    extracted_path.unlink()

    except Exception as e:
        logger.error(f"Error processing bundle: {e}")

    return samples


def create_sample_genotypes(samples: List[Dict], num_samples: int = 10) -> None:
    """
    Create sample genotype files for webapp testing.

    Args:
        samples: List of processed sample data
        num_samples: Number of sample files to create
    """
    logger.info(f"Creating {num_samples} sample genotype files for testing")

    # Select samples with good PGx coverage
    good_samples = [s for s in samples if s["snp_count"] >= 10]

    if len(good_samples) < num_samples:
        logger.warning(f"Only {len(good_samples)} samples with good PGx coverage")
        good_samples = samples[:num_samples]

    selected = random.sample(good_samples, min(num_samples, len(good_samples)))

    for i, sample in enumerate(selected, 1):
        # Create 23andMe-style format
        output_file = SAMPLE_DIR / f"sample_{i:02d}.txt"

        with open(output_file, 'w') as f:
            f.write("# PharmXD Test Sample\n")
            f.write(f"# Source: openSNP via GenomePrep (CC0 public domain)\n")
            f.write(f"# Original file: {sample['source_file']}\n")
            f.write(f"# Generated: {datetime.now().isoformat()}\n")
            f.write("# rsid\tchromosome\tposition\tgenotype\n")

            for rsid, genotype in sample["pgx_snps"].items():
                info = PGX_SNPS[rsid]
                # Note: Position is placeholder - real positions would come from dbSNP
                f.write(f"{rsid}\t{info['gene']}\t0\t{genotype}\n")

        logger.info(f"Created: {output_file} ({len(sample['pgx_snps'])} SNPs)")

    # Also create summary JSON
    summary = {
        "meta": {
            "created": datetime.now().isoformat(),
            "source": "openSNP via GenomePrep",
            "license": "CC0 (Public Domain)",
            "num_samples": len(selected)
        },
        "samples": [
            {
                "file": f"sample_{i:02d}.txt",
                "original_id": s["sample_id"],
                "pgx_snp_count": s["snp_count"]
            }
            for i, s in enumerate(selected, 1)
        ]
    }

    with open(SAMPLE_DIR / "samples_index.json", 'w') as f:
        json.dump(summary, f, indent=2)

    logger.info(f"Sample index saved to: {SAMPLE_DIR / 'samples_index.json'}")


def create_demo_sample():
    """
    Create a hardcoded demo sample with interesting pharmacogenomic profile.
    This is useful when the openSNP download is not available.
    """
    logger.info("Creating demo sample with known pharmacogenomic profile")

    # Sarah's profile: CYP2C19 Intermediate Metabolizer
    demo_sample = {
        "sample_id": "demo_sarah",
        "description": "Demo patient: Sarah, 45yo, cardiac stent patient",
        "pgx_profile": {
            # CYP2C19: *1/*2 (Intermediate Metabolizer)
            "rs4244285": "AG",  # *2 heterozygous
            "rs4986893": "GG",  # *3 wildtype
            "rs12248560": "CC", # *17 wildtype

            # CYP2D6: Normal Metabolizer (*1/*1)
            "rs3892097": "CC",  # *4 wildtype
            "rs16947": "GG",    # *2 wildtype

            # CYP2C9: *1/*2 (Intermediate)
            "rs1799853": "CT",  # *2 heterozygous
            "rs1057910": "AA",  # *3 wildtype

            # VKORC1: Intermediate sensitivity
            "rs9923231": "GA",  # Heterozygous

            # SLCO1B1: Normal function
            "rs4149056": "TT",  # Wildtype

            # DPYD: Normal
            "rs3918290": "CC",  # Wildtype

            # TPMT: Normal
            "rs1800460": "CC",  # Wildtype
            "rs1142345": "TT",  # Wildtype
        }
    }

    # Write demo file
    demo_file = SAMPLE_DIR / "demo_sarah.txt"
    with open(demo_file, 'w') as f:
        f.write("# PharmXD Demo Sample: Sarah\n")
        f.write("# 45-year-old patient with recent cardiac stent\n")
        f.write("# CYP2C19: *1/*2 (Intermediate Metabolizer) - Important for clopidogrel\n")
        f.write("# rsid\tchromosome\tposition\tgenotype\n")

        for rsid, genotype in demo_sample["pgx_profile"].items():
            info = PGX_SNPS.get(rsid, {"gene": "Unknown"})
            f.write(f"{rsid}\t{info['gene']}\t0\t{genotype}\n")

    logger.info(f"Demo sample created: {demo_file}")

    # Create JSON version
    with open(SAMPLE_DIR / "demo_sarah.json", 'w') as f:
        json.dump(demo_sample, f, indent=2)

    return demo_sample


def main():
    """Main execution function."""
    logger.info("=" * 60)
    logger.info("PharmXD openSNP Genotype Downloader")
    logger.info("=" * 60)

    # First, always create the demo sample
    create_demo_sample()

    # Check if opensnp.zip already exists
    zip_path = DATA_DIR / "opensnp.zip"

    if not zip_path.exists():
        logger.info("\nopensnp.zip not found. Attempting download...")
        logger.info("Note: This file is ~500MB and may take several minutes.")
        logger.info("If download fails, you can manually download from:")
        logger.info(f"  {OPENSNP_URL}")
        logger.info(f"  and place it in: {DATA_DIR}")

        # Try HTTPS first, then HTTP
        success = download_with_progress(OPENSNP_URL, zip_path)
        if not success:
            logger.info("HTTPS failed, trying HTTP...")
            success = download_with_progress(OPENSNP_ALT_URL, zip_path)

        if not success:
            logger.error("Download failed. Please download manually.")
            logger.info("\nUsing demo sample only for now.")
            return

    # Process the bundle
    logger.info("\nProcessing openSNP bundle...")
    samples = process_opensnp_bundle(zip_path, max_samples=50)

    if samples:
        logger.info(f"\nSuccessfully processed {len(samples)} samples")
        create_sample_genotypes(samples, num_samples=10)
    else:
        logger.warning("No samples processed from bundle")

    logger.info("\n" + "=" * 60)
    logger.info("SUMMARY")
    logger.info("=" * 60)
    logger.info(f"Sample genotypes directory: {SAMPLE_DIR}")
    logger.info(f"Demo sample: demo_sarah.txt")
    if samples:
        logger.info(f"Additional samples: sample_01.txt through sample_10.txt")


if __name__ == "__main__":
    main()
