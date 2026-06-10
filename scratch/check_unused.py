import re

def search_occurrences(word, content):
    # Match word as a whole identifier
    pattern = rf'\b{word}\b'
    return len(re.findall(pattern, content))

def analyze_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"\n--- Analyzing {path} ---")
    
    # Check imports
    # Match things like: import { a, b } from '...'; import a from '...';
    import_blocks = re.findall(r'import\s+(?:{[\s\w,]+}|\w+)\s+from\s+[\'"].+[\'"]', content)
    for block in import_blocks:
        print(f"Import block: {block}")
    
    # Find defined react variables/states or other variables and count their occurrences
    # For example, look at all 'const [x, setX] = ...'
    states = re.findall(r'const\s+\[\s*(\w+)\s*,\s*(\w+)\s*\]\s*=\s*useState', content)
    for state, setter in states:
        count_state = search_occurrences(state, content)
        count_setter = search_occurrences(setter, content)
        print(f"State: {state} (used {count_state} times), Setter: {setter} (used {count_setter} times)")
        
    # Check refs
    refs = re.findall(r'const\s+(\w+)\s*=\s*useRef', content)
    for ref in refs:
        count_ref = search_occurrences(ref, content)
        print(f"Ref: {ref} (used {count_ref} times)")

analyze_file('c:/Users/asus/Desktop/sme_web/website/app/booking/page.tsx')
analyze_file('c:/Users/asus/Desktop/sme_web/website/app/bml/page.tsx')
analyze_file('c:/Users/asus/Desktop/sme_web/website/app/components/BookingNav.tsx')
