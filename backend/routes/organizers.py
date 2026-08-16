from flask import Blueprint, request, jsonify, make_response
from extensions import db
from models import Organizer
from utils.credential_gen import generate_organizer_id, generate_password, hash_password
from utils.email_service import send_organizer_approval_request, send_credentials_email

organizers_bp = Blueprint('organizers', __name__)

@organizers_bp.route('/organizer/register', methods=['POST'])
def register_organizer():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Invalid request body'}), 400

        if not data.get('name') or not data.get('email'):
            return jsonify({'success': False, 'message': 'Name and email are required'}), 400

        if Organizer.query.filter_by(email=data.get('email', '')).first():
            return jsonify({'success': False, 'message': 'Email already registered'}), 409

        organizer = Organizer(
            name=data.get('name', ''),
            email=data.get('email', ''),
            phone=data.get('phone', ''),
            designation=data.get('designation', ''),
            role=data.get('role', 'oc'),
            department=data.get('department', ''),
            committee=data.get('committee', ''),
            ignite_role=data.get('ignite_role', ''),
            ignite_batch=data.get('ignite_batch', ''),
            experience=data.get('experience', ''),
            statement=data.get('statement', ''),
            status='pending',
        )
        db.session.add(organizer)
        db.session.commit()

        # Send approval request email to admin (non-blocking)
        try:
            send_organizer_approval_request(organizer)
        except Exception as e:
            print(f"[EMAIL WARNING] Could not send approval request email: {e}")

        return jsonify({'success': True, 'message': 'Application submitted. You will receive credentials once approved by the secretariat.'}), 201

    except Exception as e:
        db.session.rollback()
        print(f"[ORGANIZER REGISTRATION ERROR] {e}")
        return jsonify({'success': False, 'message': 'Submission failed due to a server error. Please try again.'}), 500

@organizers_bp.route('/organizer/approve/<int:org_id>', methods=['GET', 'POST'])
def approve_organizer(org_id):
    organizer = Organizer.query.get_or_404(org_id)
    if organizer.status == 'approved':
        return make_response("<h2 style='font-family:sans-serif;color:#006c49;'>Already approved.</h2>", 200)

    count = Organizer.query.count()
    user_id = generate_organizer_id(count)
    password = generate_password()
    password_hash = hash_password(password)

    organizer.status = 'approved'
    organizer.user_id = user_id
    organizer.password_hash = password_hash
    db.session.commit()

    try:
        send_credentials_email(organizer.email, organizer.name, user_id, password, role=organizer.role)
        organizer.credentials_sent = True
        db.session.commit()
    except Exception as e:
        print(f"Email error: {e}")

    return make_response(f"""
        <html><body style='font-family:sans-serif; text-align:center; padding:48px; background:#f7f9fb;'>
        <div style='background:#131b2e; color:#fff; padding:24px; border-radius:8px; max-width:400px; margin:0 auto;'>
            <h2>✓ {organizer.name} Approved</h2>
            <p style='opacity:0.7;'>Credentials sent to {organizer.email}</p>
            <p><strong>ID:</strong> {user_id}</p>
        </div></body></html>
    """, 200)

@organizers_bp.route('/organizer/reject/<int:org_id>', methods=['GET', 'POST'])
def reject_organizer(org_id):
    organizer = Organizer.query.get_or_404(org_id)
    organizer.status = 'rejected'
    db.session.commit()
    return make_response(f"""
        <html><body style='font-family:sans-serif; text-align:center; padding:48px; background:#f7f9fb;'>
        <div style='background:#ba1a1a; color:#fff; padding:24px; border-radius:8px; max-width:400px; margin:0 auto;'>
            <h2>✗ {organizer.name} Rejected</h2>
        </div></body></html>
    """, 200)

@organizers_bp.route('/organizers', methods=['GET'])
def get_organizers():
    organizers = Organizer.query.order_by(Organizer.created_at.desc()).all()
    return jsonify([o.to_dict() for o in organizers])
