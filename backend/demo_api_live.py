import requests
import json

BASE_URL = 'http://localhost:5000/api'

def run_live_api_demo():
    print("\n" + "="*70)
    print("      LIVE FLASK REST API & DATABASE INTERACTION DEMO")
    print("="*70 + "\n")

    # 1. GET /api/stats
    print("[1] GET /api/stats (Live Conference Statistics)")
    res = requests.get(f"{BASE_URL}/stats")
    print("Status Code:", res.status_code)
    print("JSON Response:", json.dumps(res.json(), indent=2))
    print("-" * 50 + "\n")

    # 2. GET /api/delegates
    print("[2] GET /api/delegates (Fetch All Registered Delegates)")
    res = requests.get(f"{BASE_URL}/delegates")
    print("Status Code:", res.status_code)
    delegates = res.json()
    print(f"Retrieved {len(delegates)} delegates from database.")
    for d in delegates[:3]:
        print(f" - ID: {d['id']} | User ID: {d['user_id']} | Name: {d['name']} | Status: {d['payment_status']} | Delegation: {d['delegation_assigned']}")
    print("-" * 50 + "\n")

    # 3. POST /api/register (Live Delegate Registration)
    print("[3] POST /api/register (Registering New Delegate Live)")
    new_delegate = {
        "name": "Pooja Hegde",
        "college": "SVUCE Tirupati",
        "class_": "3rd Yr ECE",
        "email": "pooja.hegde.demo@svuce.edu",
        "phone": "9988776655",
        "committee": "UNSC",
        "position_1": "United Kingdom",
        "position_2": "France",
        "mun_experience": "Participated in 3 national MUNs"
    }
    res = requests.post(f"{BASE_URL}/register", json=new_delegate)
    print("Status Code:", res.status_code)
    print("JSON Response:", json.dumps(res.json(), indent=2))
    print("-" * 50 + "\n")

    # 4. GET /api/payment/info
    print("[4] GET /api/payment/info (UPI Gateway Details)")
    res = requests.get(f"{BASE_URL}/payment/info")
    print("Status Code:", res.status_code)
    print("JSON Response:", json.dumps(res.json(), indent=2))
    print("-" * 50 + "\n")

    # 5. POST /api/payment/validate-utr (Live UTR Verification)
    print("[5] POST /api/payment/validate-utr (Validating 12-digit UTR)")
    utr_test = {"utr_number": "998877665544"}
    res = requests.post(f"{BASE_URL}/payment/validate-utr", json=utr_test)
    print("Status Code:", res.status_code)
    print("JSON Response:", json.dumps(res.json(), indent=2))
    print("-" * 50 + "\n")

if __name__ == '__main__':
    run_live_api_demo()
