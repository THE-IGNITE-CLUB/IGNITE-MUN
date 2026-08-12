import sys
import json
from app import create_app, db
from models import Delegate, Organizer, Admin, Score, Session

def run_tests():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        from app import _seed_admin
        _seed_admin()
    client = app.test_client()

    print("--- 1. Testing GET /api/stats ---")
    res = client.get('/api/stats')
    assert res.status_code == 200, f"Stats failed: {res.status_code}"
    data = res.get_json()
    print("Stats response:", data)
    assert data['total_delegates'] == 0
    assert data['remaining_free_slots'] == 10

    print("--- 2. Testing GET /api/payment/info ---")
    res = client.get('/api/payment/info')
    assert res.status_code == 200
    pinfo = res.get_json()
    print("Payment Info:", pinfo)
    assert 'upi_id' in pinfo

    print("--- 3. Testing POST /api/register (Free slot 1) ---")
    reg_payload = {
        "name": "Alex Mercer",
        "college": "SVU College of Engineering",
        "class_": "3rd Year B.Tech CSE",
        "email": "alex.mercer.test@example.com",
        "phone": "9876543210",
        "committee": "UNSC",
        "position_1": "United States",
        "position_2": "United Kingdom",
        "position_3": "France",
        "mun_experience": "First time MUN delegate"
    }
    res = client.post('/api/register', json=reg_payload)
    assert res.status_code == 201, f"Registration failed: {res.status_code} {res.text}"
    reg_data = res.get_json()
    print("Registration output:", reg_data)
    assert reg_data['is_free'] is True
    assert reg_data['user_id'].startswith("DEL-2026-")

    print("--- 4. Testing POST /api/login ---")
    # Fetch delegate to check generated password from DB hash check or admin login
    admin_login_res = client.post('/api/login', json={"user_id": "superadmin", "password": "admin2026"})
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
    print("Admin login output:", admin_login_res.get_json())

    print("--- 5. Testing POST /api/organizer/register ---")
    org_payload = {
        "name": "Sarah Connor",
        "email": "sarah.connor.test@example.com",
        "phone": "9123456789",
        "designation": "Student",
        "role": "eb",
        "department": "CSE",
        "committee": "UNSC",
        "ignite_role": "Executive Board",
        "experience": "Co-Chair at IGNITE MUN 2025"
    }
    res = client.post('/api/organizer/register', json=org_payload)
    assert res.status_code == 201, f"Organizer reg failed: {res.text}"
    print("Organizer reg output:", res.get_json())

    print("--- 6. Testing GET /api/delegates ---")
    res = client.get('/api/delegates')
    assert res.status_code == 200
    delegates_list = res.get_json()
    assert len(delegates_list) == 1
    print("Delegates count:", len(delegates_list))

    print("\n[SUCCESS] ALL BACKEND API SMOKE TESTS PASSED PERFECTLY!")

if __name__ == '__main__':
    run_tests()
