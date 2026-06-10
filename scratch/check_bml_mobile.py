with open("app/bml/bml-client.tsx", "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()

# Search for the CTAs, buttons, grids, and layouts in BML results screen (step 7)
print("Searching for Results screen components in bml-client.tsx:")
found_step_7 = False
for idx, line in enumerate(lines):
    if "step === 7" in line or "currentStep === 7" in line or "Step 7:" in line:
        found_step_7 = True
        print(f"\n--- Found Step 7 indicator at line {idx+1}: ---")
    
    if found_step_7:
        # Check buttons and grids in step 7 block (typically from line 900 onwards)
        if idx > 900:
            if "button" in line.lower() or "href=" in line.lower() or "grid-cols-" in line.lower():
                print(f"Line {idx+1}: {line.strip()}")
            if idx > 1300: # Limit the search scope so it doesn't print too much
                break
