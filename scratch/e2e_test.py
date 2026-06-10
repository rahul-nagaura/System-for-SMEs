import urllib.request
import json
import sys
import codecs

# Force stdout to use UTF-8 to handle rupee symbol etc. on Windows
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

def send_request(url, data=None, headers=None, method="POST"):
    if headers is None:
        headers = {}
    
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    else:
        req_data = None
        
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.status
            body = json.loads(response.read().decode("utf-8"))
            return status, body
    except urllib.error.HTTPError as e:
        try:
            body = json.loads(e.read().decode("utf-8"))
        except Exception:
            body = e.reason
        return e.code, body
    except Exception as e:
        return 0, str(e)

def run_e2e_tests():
    base_url = "http://localhost:3000"
    content_feed_url = f"{base_url}/api/content-feed?nocache=true"
    bml_submit_url = f"{base_url}/api/bml-submit"
    booking_submit_url = f"{base_url}/api/booking-submit"
    
    print("====================================================")
    print("STARTING END-TO-END VERIFICATION CHECKLIST")
    print("====================================================\n")
    
    # 1. LANDING PAGE & VAULT DYNAMIC CONTENTS
    print("--- 1. Fetching Dynamic CMS Content (cache-busted) ---")
    status, content = send_request(content_feed_url, method="GET")
    print(f"Content Feed Status: {status}")
    if status != 200 or not content.get("success"):
        print("ERROR: Failed to fetch CMS content from Google Sheets.")
        print(f"Response: {content}")
        return
        
    settings = content.get("settings", {})
    faqs = content.get("faqs", [])
    reviews = content.get("reviews", [])
    vault = content.get("vault", [])
    
    print(f"✓ Connected to Google Sheet Apps Script web app successfully.")
    print(f"✓ Pricing value in GlobalSettings: ₹{settings.get('pricing', '2499')}")
    print(f"✓ Raghav photo URL in GlobalSettings: {settings.get('owner_photo_url', 'Not found')}")
    print(f"✓ FAQs count: {len(faqs)}")
    for i, faq in enumerate(faqs[:3]):
        print(f"  [{i+1}] Q: {faq.get('question')} | A: {faq.get('answer')[:60]}...")
    print(f"✓ Reviews count: {len(reviews)}")
    print(f"✓ Vault templates count: {len(vault)}")
    for i, item in enumerate(vault[:3]):
        print(f"  [{i+1}] Title: {item.get('title')} | Slug: {item.get('slug')} | Section: {item.get('section')}")
    
    print("\n--- 2. Submitting BML Calculator flow ---")
    # Simulate a full quiz lead form submission
    bml_payload = {
        "name": "E2E BML Tester",
        "email": "e2e-bml-test@systemsforsme.com",
        "phone": "9999999999",
        "score": 12,
        "level": "L4",
        "biggest_gap": "Operational Efficiency",
        "operations": 80,
        "finance": 60,
        "human": 90,
        "digital": 70,
        "revenue": "₹20L - ₹50L",
        "biggestProblem": "Staff Management"
    }
    status, res = send_request(bml_submit_url, bml_payload)
    print(f"BML Submission Status: {status}")
    print(f"BML Submission Response: {res}")
    assert status == 200, "BML submission should return 200 OK"
    assert res.get("success") is True, "BML submission success should be True"
    print("✓ BML Quiz submitted successfully and accepted.")
    
    print("\n--- 3. Submitting Booking flow ---")
    # Simulate booking onboarding submission
    booking_payload = {
        "fullName": "E2E Booking Tester",
        "phone": "+91 88888 88888",
        "businessName": "E2E Systems Ltd",
        "description": "Verifying sheet integration works end-to-end.",
        "teamSize": "6–15",
        "tracking": "software",
        "problems": ["staff", "owner_dependency"],
        "otherProblem": "Need automation",
        "fixedBefore": "yes",
        "authority": "owner"
    }
    status, res = send_request(booking_submit_url, booking_payload)
    print(f"Booking Submission Status: {status}")
    print(f"Booking Submission Response: {res}")
    assert status == 200, "Booking submission should return 200 OK"
    assert res.get("success") is True, "Booking submission success should be True"
    print("✓ Booking Onboarding form submitted successfully and accepted.")
    
    print("\n====================================================")
    print("ALL E2E API VERIFICATION CHECKS PASSED!")
    print("====================================================")

if __name__ == "__main__":
    run_e2e_tests()
