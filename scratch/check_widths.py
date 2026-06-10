import re
import glob

files = glob.glob("app/**/*.tsx", recursive=True)
width_pattern = re.compile(r'w-\[(\d+)px\]')

print("Analyzing tsx files for hardcoded pixel widths...")
for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    matches = width_pattern.findall(content)
    if matches:
        print(f"\nFile: {filepath}")
        lines = content.splitlines()
        for idx, line in enumerate(lines):
            line_matches = width_pattern.findall(line)
            if line_matches:
                # Highlight if it doesn't have a responsive prefix like md: or lg:
                has_prefix = any(prefix in line for prefix in ["md:", "lg:", "sm:", "xl:"])
                prefix_str = " (Responsive)" if has_prefix else " (No responsive prefix! Check mobile overflow)"
                print(f"  Line {idx+1}: {line.strip()}{prefix_str}")
