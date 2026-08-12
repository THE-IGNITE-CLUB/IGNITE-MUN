from flask import Blueprint, request, jsonify, session
from models import Delegate, Admin
from utils.credential_gen import check_password

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

    # Check admin/organizer
    admin = Admin.query.filter_by(username=user_id).first()
    if admin and check_password(password, admin.password_hash):
        session['admin_id'] = admin.id
        session['role'] = admin.role
        return jsonify({'success': True, 'role': admin.role, 'data': {'username': admin.username, 'role': admin.role}})

    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

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
