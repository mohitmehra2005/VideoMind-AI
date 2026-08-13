from pathlib import Path

site_packages = Path(".venv/Lib/site-packages")

for metadata_file in site_packages.glob("*.dist-info/METADATA"):
    try:
        metadata_file.read_text(encoding="utf-8")
    except Exception as e:
        print("BROKEN METADATA:")
        print(metadata_file)
        print("ERROR:", repr(e))