from flask import Blueprint, request, jsonify
from extensions import db
from models import Delegate
from utils.credential_gen import generate_delegate_id, generate_password, hash_password
from utils.email_service import send_credentials_email, send_payment_confirmation
import os

delegates_bp = Blueprint('delegates', __name__)
FREE_SLOTS = int(os.getenv('FREE_SLOTS', 10))

@delegates_bp.route('/register', methods=['POST'])
def register_delegate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'Invalid request body'}), 400

        required = ['name', 'college', 'email', 'committee']
        for field in required:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400

        if Delegate.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'Email already registered'}), 409

        # Count existing delegates to determine slot
        count = Delegate.query.count() + 1
        is_free = count <= FREE_SLOTS

        user_id = generate_delegate_id(count)
        password = generate_password()
        password_hash = hash_password(password)

        delegate = Delegate(
            name=data['name'],
            class_=data.get('class_', ''),
            college=data['college'],
            email=data['email'],
            phone=data.get('phone', ''),
            committee=data['committee'],
            position_1=data.get('position_1', ''),
            position_2=data.get('position_2', ''),
            position_3=data.get('position_3', ''),
            position_4=data.get('position_4', ''),
            position_5=data.get('position_5', ''),
            mun_experience=data.get('mun_experience', ''),
            user_id=user_id,
            password_hash=password_hash,
            payment_status='free' if is_free else 'pending',
            payment_amount=0 if is_free else 50.0,
        )
        db.session.add(delegate)
        db.session.commit()

        # If free slot, attempt to send credentials (non-blocking — email failure won't fail registration)
        if is_free:
            try:
                send_credentials_email(delegate.email, delegate.name, user_id, password)
                delegate.credentials_sent = True
                db.session.commit()
            except Exception as e:
                print(f"[EMAIL WARNING] Could not send credentials email: {e}")
                # Registration still succeeds even if email fails

        return jsonify({
            'success': True,
            'is_free': is_free,
            'delegate_id': delegate.id,
            'user_id': user_id if is_free else None,
            'payment_required': not is_free,
            'amount': 0 if is_free else 50,
            'message': 'Registration successful! Credentials will be sent to your email.' if is_free else 'Registration received. Please complete payment.'
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"[REGISTRATION ERROR] {e}")
        return jsonify({'success': False, 'message': 'Registration failed due to a server error. Please try again.'}), 500

@delegates_bp.route('/delegates', methods=['GET'])
def get_delegates():
    delegates = Delegate.query.order_by(Delegate.created_at.desc()).all()
    return jsonify([d.to_dict() for d in delegates])

@delegates_bp.route('/delegates/<int:delegate_id>', methods=['GET'])
def get_delegate(delegate_id):
    delegate = Delegate.query.get_or_404(delegate_id)
    return jsonify(delegate.to_dict())

@delegates_bp.route('/delegates/<int:delegate_id>/assign-delegation', methods=['POST'])
def assign_delegation(delegate_id):
    delegate = Delegate.query.get_or_404(delegate_id)
    data = request.get_json()
    delegation = data.get('delegation', '')
    delegate.delegation_assigned = delegation
    db.session.commit()

    # Send delegation email
    from utils.email_service import send_delegation_email
    try:
        send_delegation_email(delegate.email, delegate.name, delegate.committee, delegation)
        delegate.delegation_sent = True
        db.session.commit()
    except Exception as e:
        print(f"Email error: {e}")

    return jsonify({'success': True, 'message': f'Delegation {delegation} assigned and email sent.'})

@delegates_bp.route('/stats', methods=['GET'])
def get_stats():
    total = Delegate.query.count()
    paid = Delegate.query.filter_by(payment_status='paid').count()
    free = Delegate.query.filter_by(payment_status='free').count()
    pending_payment = Delegate.query.filter_by(payment_status='pending').count()
    remaining_free = max(0, FREE_SLOTS - free)
    return jsonify({
        'total_delegates': total,
        'paid': paid,
        'free': free,
        'pending_payment': pending_payment,
        'remaining_free_slots': remaining_free,
        'free_slots_exhausted': remaining_free == 0
    })
