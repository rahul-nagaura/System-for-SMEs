import urllib.request
import json
import time

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

def run_tests():
    bml_url = "http://localhost:3000/api/bml-submit"
    booking_url = "http://localhost:3000/api/booking-submit"
    
    print("=== TESTING BML SUBMITROUTE ===")
    
    # Test 1: GET method rejection
    status, body = send_request(bml_url, method="GET")
    print(f"GET Request -> Status: {status}, Body: {body}")
    assert status == 405, "GET request should be rejected with 405"
    
    # Test 2: Invalid JSON body
    req = urllib.request.Request(bml_url, data=b"invalid-json", headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            status, body = response.status, response.read()
    except urllib.error.HTTPError as e:
        status = e.code
        body = e.read().decode("utf-8")
    print(f"Invalid JSON -> Status: {status}, Body: {body}")
    assert status == 400 or "Invalid JSON" in body, "Invalid JSON should return 400"
    
    # Test 3: Missing email (direct API call)
    payload_no_email = {
        "name": "Test BML",
        "phone": "9876543210",
        "score": 10,
        "level": "L3",
        "biggest_gap": "Human Capital"
    }
    status, body = send_request(bml_url, payload_no_email)
    print(f"Missing Email -> Status: {status}, Body: {body}")
    assert status == 422, "Missing email should return 422"
    assert body.get("field") == "email", "Error field should be email"
    
    # Test 4: Missing required level
    payload_invalid_level = {
        "name": "Test BML",
        "email": "test@example.com",
        "phone": "9876543210",
        "score": 10,
        "level": "INVALID",
        "biggest_gap": "Human Capital"
    }
    status, body = send_request(bml_url, payload_invalid_level)
    print(f"Invalid Level -> Status: {status}, Body: {body}")
    assert status == 422, "Invalid level should return 422"
    assert body.get("field") == "level", "Error field should be level"
    
    # Test 5: Valid request (passes validation, silent fallback for Google Sheet)
    payload_valid = {
        "name": "Test BML",
        "email": "test@example.com",
        "phone": "9876543210",
        "score": 10,
        "level": "L3",
        "biggest_gap": "Human Capital"
    }
    status, body = send_request(bml_url, payload_valid)
    print(f"Valid Request -> Status: {status}, Body: {body}")
    assert status == 200, "Valid request should return 200"
    assert body.get("success") is True, "Should succeed"

    print("\n=== TESTING BOOKING SUBMIT ROUTE ===")
    
    # Test 6: GET method rejection
    status, body = send_request(booking_url, method="GET")
    print(f"GET Request -> Status: {status}, Body: {body}")
    assert status == 405, "GET request should be rejected with 405"
    
    # Test 7: Missing email (direct API call with name)
    booking_no_email = {
        "name": "Direct User",
        "phone": "9876543210"
    }
    status, body = send_request(booking_url, booking_no_email)
    print(f"Missing Email (Direct) -> Status: {status}, Body: {body}")
    assert status == 422, "Direct call missing email should return 422"
    assert body.get("field") == "email", "Error field should be email"

    # Test 8: Valid frontend request (no email, but sends fullName)
    booking_frontend = {
        "fullName": "Frontend User",
        "phone": "9876543210",
        "businessName": "Frontend Corp",
        "description": "Needs strategy session",
        "teamSize": "2-5"
    }
    status, body = send_request(booking_url, booking_frontend)
    print(f"Frontend Request (No email) -> Status: {status}, Body: {body}")
    assert status == 200, "Frontend booking request without email should succeed by auto-assigning mock email"
    assert body.get("success") is True, "Should succeed"
    
    # Test 9: Invalid phone format
    booking_bad_phone = {
        "fullName": "Bad Phone User",
        "phone": "123", # too short
    }
    status, body = send_request(booking_url, booking_bad_phone)
    print(f"Invalid Phone -> Status: {status}, Body: {body}")
    assert status == 422, "Invalid phone should return 422"
    assert body.get("field") == "phone", "Error field should be phone"
    
    # Test 10: Rate Limit Protection (make 6 requests rapidly)
    # We will use booking_url, and since we already made 3 requests, let's make 5 more to trigger it
    print("Testing Rate Limiter (making rapid requests)...")
    for i in range(5):
        status, body = send_request(booking_url, booking_frontend)
        print(f"Request {i+1} -> Status: {status}")
        if status == 429:
            print("Successfully triggered rate limiter!")
            break
    else:
        print("Rate limiter did not trigger, let's try a few more")
        for i in range(5):
            status, body = send_request(booking_url, booking_frontend)
            print(f"Extra Request {i+1} -> Status: {status}")
            if status == 429:
                print("Successfully triggered rate limiter!")
                break
        assert status == 429, "Rate limit should be triggered and return 429"

    print("\nALL TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
