#!/usr/bin/env python3
"""Prepare the manual CLI 0.25.0 pilot without changing the repository's PR suite."""

import argparse
import base64
import hashlib
import json
from pathlib import Path
import shutil
import subprocess


RELEASE_INTEGRITY = "LIfbSM5uL0zakQIbmXE1II++Bjp2d3QFckms0cxbuytUrTMyl2B/hj6f1pz2bkTclC9esnd1zsQuYmSGLx+TGg=="


def verify_release(path):
    actual = base64.b64encode(hashlib.sha512(path.read_bytes()).digest()).decode()
    if actual != RELEASE_INTEGRITY:
        raise ValueError(f"{path} does not match the published npm CLI 0.25.0 tarball")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("destination", type=Path, help="New directory outside a Git checkout")
    parser.add_argument("--skill", type=Path, help="Skill directory; defaults to this checkout")
    parser.add_argument("--tarball", type=Path, help="Previously downloaded npm release tarball")
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    skill = (args.skill or root / "gauge-agents").resolve()
    if not (skill / "SKILL.md").is_file():
        parser.error(f"No SKILL.md in {skill}")
    destination = args.destination.resolve()
    if destination.exists():
        parser.error(f"Destination already exists: {destination}; choose a new directory")
    if args.tarball and not args.tarball.is_file():
        parser.error(f"Tarball does not exist: {args.tarball}")
    if args.tarball:
        verify_release(args.tarball)
    destination.mkdir(parents=True)
    shutil.copytree(skill, destination / "gauge-agents")
    shutil.copytree(root / "gauge-cases" / "cli-025", destination / "gauge-cases" / "cli-025")
    package_name = "withgauge-cli-0.25.0.tgz"
    if args.tarball:
        shutil.copyfile(args.tarball, destination / package_name)
    else:
        subprocess.run(
            ["npm", "pack", "@withgauge/cli@0.25.0", "--ignore-scripts",
             "--registry=https://registry.npmjs.org", "--pack-destination", str(destination)],
            check=True,
        )
    verify_release(destination / package_name)
    config = {
        "version": 2,
        "cases": ["gauge-cases/cli-025/*.md"],
        "inputs": {
            "gauge-agents": {"type": "skill", "path": "gauge-agents"},
            "cli-release": {"type": "npm-package", "path": package_name, "install": "environment"},
        },
    }
    (destination / "gauge.json").write_text(json.dumps(config, indent=2) + "\n")
    print(f"Prepared {destination}. No sessions launched.")
    print("In that directory: gauge run --verify --hosted -o json")
    print("Preview: gauge run --dry-run --hosted --org <your-org> -o json")
    print("Launch when authorized: gauge run --hosted --org <your-org> --yes -o json")


if __name__ == "__main__":
    main()
