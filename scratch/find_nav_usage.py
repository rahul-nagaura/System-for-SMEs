import glob

files = glob.glob("app/**/*.tsx", recursive=True)
files.extend(glob.glob("app/**/*.ts", recursive=True))

print("Searching for Nav imports:")
for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    if "components/Nav" in content or "components/SiteFooter" in content:
        print(f"File: {filepath}")
        for line in content.splitlines():
            if "Nav" in line or "SiteFooter" in line:
                print(f"  {line.strip()}")
