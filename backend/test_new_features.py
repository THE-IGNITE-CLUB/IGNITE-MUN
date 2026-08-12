import requests

BASE_URL = "http://localhost:5000"

def run_tests():
    print("=" * 60)
    print("      IGNITE MUN 2026 — FULL FEATURE TEST SUITE")
    print("=" * 60)

    # 1. Test Delegate Question Submission
    print("\n[1] Testing Delegate Question Submission...")
    res = requests.post(f"{BASE_URL}/api/queries/create", json={
        "delegate_id": 1,
        "subject": "Veto Rule Inquiry",
        "question": "Can permanent UNSC members abstain during substantive voting without vetoing?"
    })
    print(f"Status: {res.status_code}")
    data = res.json()
    print("Response:", data)
    assert res.status_code == 201, "Failed to create query"
    query_id = data['query']['id']

    # 2. Test Secretariat Fetch All Queries
    print("\n[2] Testing Secretariat Fetch Queries...")
    res = requests.get(f"{BASE_URL}/api/queries/all")
    print(f"Status: {res.status_code}")
    queries = res.json()
    print(f"Total Queries Found: {len(queries)}")

    # 3. Test Secretariat Individual Response
    print("\n[3] Testing Secretariat Individual Response...")
    res = requests.post(f"{BASE_URL}/api/queries/respond/{query_id}", json={
        "response": "Yes, under Article 27(3) of the UN Charter, an abstention by a permanent member is not counted as a negative vote/veto."
    })
    print(f"Status: {res.status_code}")
    print("Response:", res.json())
    assert res.status_code == 200, "Failed to respond to query"

    # 4. Test Delegate Fetch Own Queries
    print("\n[4] Testing Delegate Fetching Individual Response...")
    res = requests.get(f"{BASE_URL}/api/queries/delegate/1")
    print(f"Status: {res.status_code}")
    delegate_queries = res.json()
    print("Delegate Queries:", delegate_queries)
    assert len(delegate_queries) > 0 and delegate_queries[0]['status'] == 'answered', "Response not reflected"

    # 5. Test Live Session Broadcast
    print("\n[5] Testing Executive Board Live Caucus Broadcast...")
    res = requests.post(f"{BASE_URL}/api/admin/session", json={
        "committee": "UNSC",
        "session_type": "Moderated Caucus",
        "topic": "Evaluation of Middle East De-escalation Protocols",
        "total_time": 15,
        "speaking_time": 60,
        "broadcast_message": "Active Moderated Caucus on Middle East Protocols."
    })
    print(f"Status: {res.status_code}")
    print("Broadcast Session:", res.json())

    # 6. Test Active Session Retrieval for Delegate Dashboard
    res = requests.get(f"{BASE_URL}/api/admin/active-session?committee=UNSC")
    print("\n[6] Active Session for Delegate Dashboard:", res.json())

    print("\n[SUCCESS] ALL NEW FEATURES TESTED 100% CLEANLY!")

if __name__ == "__main__":
    run_tests()
