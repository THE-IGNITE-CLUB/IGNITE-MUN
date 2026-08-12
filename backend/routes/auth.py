from flask import Blueprint, request, jsonify, session
from extensions import db
from models import Delegate, Admin, AdminOTP
from utils.credential_gen import check_password, hash_password
from utils.email_service import send_otp_email
import random
from datetime import datetime, timedelta
import pytz

IST = pytz.timezone('Asia/Kolkata')
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def delegate_login():
    data = request.get_json()
    user_id = data.get('user_id', '').strip()
    password = data.get('password', '')

    # Check delegate
    delegate = Delegate.query.filter_by(user_id=user_id).first()
    if delegate and check_password(password, delegate.password_hash):
        session['delegate_id'] = delegate.id
        session['role'] = 'delegate'
        return jsonify({'success': True, 'role': 'delegate', 'data': delegate.to_dict()})

    # Check approved staff / EB organizer
    from models import Organizer
    org = Organizer.query.filter_by(user_id=user_id, status='approved').first()
    if org and org.password_hash and check_password(password, org.password_hash):
        session['organizer_id'] = org.id
        session['role'] = org.role
        return jsonify({'success': True, 'role': org.role, 'data': org.to_dict()})

    # Check admin
    admin = Admin.query.filter_by(username=user_id).first()
    if admin and check_password(password, admin.password_hash):
        session['admin_id'] = admin.id
        session['role'] = admin.role
        return jsonify({'success': True, 'role': admin.role, 'data': {'username': admin.username, 'role': admin.role}})

    return jsonify({'success': False, 'message': 'Invalid credentials or account pending approval'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if 'delegate_id' in session:
        delegate = Delegate.query.get(session['delegate_id'])
        if delegate:
            return jsonify({'role': 'delegate', 'data': delegate.to_dict()})
    if 'admin_id' in session:
        admin = Admin.query.get(session['admin_id'])
        if admin:
            return jsonify({'role': admin.role, 'data': {'username': admin.username, 'role': admin.role}})
    return jsonify({'error': 'Not authenticated'}), 401

@auth_bp.route('/admin/request-otp', methods=['POST'])
def request_otp():
    """Request a 6-digit verification code sent to the Super Admin email ID."""
    data = request.get_json() or {}
    username = data.get('username', 'superadmin').strip()

    admin = Admin.query.filter_by(username=username).first()
    if not admin:
        return jsonify({'success': False, 'message': f'Admin user "{username}" not found'}), 404

    target_email = admin.email or 'manas.malla13@gmail.com'
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.now(IST) + timedelta(minutes=15)

    otp_record = AdminOTP(
        email=target_email,
        otp_code=otp_code,
        expires_at=expires_at,
        is_used=False
    )
    db.session.add(otp_record)
    db.session.commit()

    email_sent = True
    try:
        send_otp_email(target_email, otp_code)
    except Exception as e:
        print(f"SMTP error sending OTP email: {e}")
        email_sent = False

    return jsonify({
        'success': True,
        'message': f'Verification code sent to {target_email}. Code is valid for 15 minutes.',
        'email': target_email,
        'otp_code': otp_code,  # Provided for seamless demo/testing access
        'email_sent': email_sent
    })

@auth_bp.route('/admin/reset-password-otp', methods=['POST'])
def reset_password_otp():
    """Verify OTP and update Super Admin password."""
    data = request.get_json() or {}
    username = data.get('username', 'superadmin').strip()
    otp_code = data.get('otp_code', '').strip()
    new_password = data.get('new_password', '')

    if not otp_code or not new_password:
        return jsonify({'success': False, 'message': 'Verification code and new password are required'}), 400

    admin = Admin.query.filter_by(username=username).first()
    if not admin:
        return jsonify({'success': False, 'message': f'Admin user "{username}" not found'}), 404

    target_email = admin.email or 'manas.malla13@gmail.com'

    # Fetch latest valid OTP record for this email
    otp_record = AdminOTP.query.filter_by(
        email=target_email,
        otp_code=otp_code,
        is_used=False
    ).order_by(AdminOTP.id.desc()).first()

    if not otp_record:
        return jsonify({'success': False, 'message': 'Invalid verification code. Please check the 6-digit code.'}), 400

    # Check expiration
    now = datetime.now(IST)
    expires_at = otp_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = IST.localize(expires_at)

    if now > expires_at:
        return jsonify({'success': False, 'message': 'Verification code has expired. Please request a new code.'}), 400

    # Code is valid -> update admin password
    admin.password_hash = hash_password(new_password)
    otp_record.is_used = True
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Super Admin password successfully updated! You can now log in with your new password.'
    })
