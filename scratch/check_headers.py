import re

def check_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    headers = re.findall(r'<header\b', content)
    print(f"File: {path}")
    print(f"Found {len(headers)} <header> tags.")
    
    # Let's print lines around them if any exist
    if headers:
        lines = content.splitlines()
        for idx, line in enumerate(lines):
            if '<header' in line:
                print(f"Line {idx+1}: {line.strip()}")

check_file('c:/Users/asus/Desktop/sme_web/website/app/bml/page.tsx')
check_file('c:/Users/asus/Desktop/sme_web/website/app/booking/page.tsx')
