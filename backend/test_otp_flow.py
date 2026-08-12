import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_otp_reset():
    print("\n" + "="*70)
    print("      SUPER ADMIN EMAIL OTP PASSWORD RESET TEST")
    print("="*70 + "\n")

    # Step 1: Request OTP for superadmin
    print("[1] Requesting OTP code for superadmin (Email: manas.malla13@gmail.com)...")
    res = requests.post(f"{BASE_URL}/admin/request-otp", json={"username": "superadmin"})
    print("Status Code:", res.status_code)
    data = res.json()
    print("Response JSON:", json.dumps(data, indent=2))

    otp_code = data.get('otp_code')
    assert otp_code is not None, "OTP code was not returned"
    print(f"\n[+] Generated OTP Code: {otp_code}")

    # Step 2: Attempt reset with invalid OTP code (defense check)
    print("\n[2] Testing invalid OTP code defense check...")
    res_bad = requests.post(f"{BASE_URL}/admin/reset-password-otp", json={
        "username": "superadmin",
        "otp_code": "000000",
        "new_password": "newsuperadminpassword2026"
    })
    print("Status Code:", res_bad.status_code)
    print("Response JSON:", json.dumps(res_bad.json(), indent=2))
    assert res_bad.status_code == 400

    # Step 3: Perform valid password reset using correct OTP code
    print("\n[3] Testing valid OTP password reset...")
    res_valid = requests.post(f"{BASE_URL}/admin/reset-password-otp", json={
        "username": "superadmin",
        "otp_code": otp_code,
        "new_password": "newsuperadminpassword2026"
    })
    print("Status Code:", res_valid.status_code)
    print("Response JSON:", json.dumps(res_valid.json(), indent=2))
    assert res_valid.status_code == 200

    # Step 4: Login with new password
    print("\n[4] Testing login with NEW password...")
    login_res = requests.post(f"{BASE_URL}/login", json={
        "user_id": "superadmin",
        "password": "newsuperadminpassword2026"
    })
    print("Status Code:", login_res.status_code)
    print("Response JSON:", json.dumps(login_res.json(), indent=2))
    assert login_res.status_code == 200
    assert login_res.json()['role'] == 'super_admin'

    print("\n[SUCCESS] SUPER ADMIN EMAIL OTP PASSWORD RESET FLOW TESTED PERFECTLY!")

if __name__ == '__main__':
    test_otp_reset()
