from flask import Blueprint, request, jsonify
from extensions import db
from models import Delegate
from utils.email_service import send_credentials_email, send_payment_confirmation
from utils.credential_gen import generate_password, hash_password
import os
import re

payment_bp = Blueprint('payment', __name__)
FREE_SLOTS = int(os.getenv('FREE_SLOTS', 10))
UPI_ID = "9985966627@ybl"

# ──────────────────────────────────────────────
# UTR Validation Rules
# UPI/IMPS RRN  → exactly 12 digits
# NEFT          → 16 alphanumeric (letters + digits)
# RTGS          → 16 alphanumeric
# PhonePe ref   → 12–16 alphanumeric
# ──────────────────────────────────────────────
UTR_PATTERNS = [
    r'^\d{12}$',                  # UPI / IMPS  (12 digits)
    r'^[A-Za-z0-9]{16}$',         # NEFT / RTGS (16 alphanum)
    r'^[A-Za-z0-9]{12,20}$',      # PhonePe / generic (12-20 alphanum)
]

def is_valid_utr(utr: str) -> bool:
    utr = utr.strip().upper()
    return any(re.match(p, utr, re.IGNORECASE) for p in UTR_PATTERNS)


@payment_bp.route('/payment/info', methods=['GET'])
def payment_info():
    """Return UPI payment details."""
    return jsonify({
        'upi_id': UPI_ID,
        'name': 'Malla Manas — Ignite MUN 2026',
        'amount': 50,
        'currency': 'INR',
        'description': 'Ignite MUN 2026 Delegate Registration',
        'upi_link': f"upi://pay?pa={UPI_ID}&pn=IgniteMUN2026&am=50&cu=INR&tn=Delegate+Registration",
    })


# ─────────────────────────────────────────────────────────────
# NEW: Client-side UTR verification before submission
# ─────────────────────────────────────────────────────────────
@payment_bp.route('/payment/validate-utr', methods=['POST'])
def validate_utr():
    """
    Validates a UTR number BEFORE submission:
      1. Checks format (regex patterns for UPI / NEFT / RTGS / PhonePe)
      2. Checks for duplicate usage across all delegates
    Returns { valid: bool, message: str, error_code: str }
    """
    data = request.get_json()
    utr = (data.get('utr_number') or '').strip()

    if not utr:
        return jsonify({
            'valid': False,
            'message': 'Transaction reference cannot be empty.',
            'error_code': 'EMPTY'
        }), 400

    # ── Step 1: Format validation ──
    if not is_valid_utr(utr):
        return jsonify({
            'valid': False,
            'message': (
                'Invalid transaction reference format. '
                'UPI/IMPS references are 12 digits; '
                'NEFT/RTGS are 16 alphanumeric characters.'
            ),
            'error_code': 'INVALID_FORMAT'
        }), 422

    # ── Step 2: Duplicate check ──
    existing = Delegate.query.filter_by(razorpay_payment_id=utr.upper()).first()
    if existing:
        return jsonify({
            'valid': False,
            'message': (
                'This transaction reference has already been used. '
                'Please check the reference number or contact the secretariat.'
            ),
            'error_code': 'DUPLICATE'
        }), 409

    # ── All checks passed ──
    return jsonify({
        'valid': True,
        'message': '✓ Transaction reference looks valid. You can now submit.',
        'error_code': None
    })


@payment_bp.route('/payment/confirm', methods=['POST'])
def confirm_payment():
    """
    Delegate submits UTR after it has been validated client-side.
    Re-validates server-side before saving (defense in depth).
    """
    data = request.get_json()
    delegate_id = data.get('delegate_id')
    utr_number = (data.get('utr_number') or '').strip().upper()

    if not delegate_id or not utr_number:
        return jsonify({'success': False, 'message': 'Delegate ID and UTR number are required'}), 400

    # Server-side re-validation
    if not is_valid_utr(utr_number):
        return jsonify({'success': False, 'message': 'Invalid UTR format. Please verify your transaction reference.'}), 422

    duplicate = Delegate.query.filter_by(razorpay_payment_id=utr_number).first()
    if duplicate and duplicate.id != delegate_id:
        return jsonify({'success': False, 'message': 'This UTR has already been submitted by another delegate.'}), 409

    delegate = Delegate.query.get(delegate_id)
    if not delegate:
        return jsonify({'success': False, 'message': 'Delegate not found'}), 404

    if delegate.payment_status in ('paid', 'pending_verification'):
        return jsonify({'success': False, 'message': 'Payment already submitted for verification.'}), 400

    # Save UTR and mark as pending admin review
    delegate.razorpay_payment_id = utr_number
    delegate.payment_status = 'pending_verification'
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Payment reference submitted successfully. Admin will verify within 2–6 hours and send your credentials.',
        'delegate_id': delegate.id
    })


@payment_bp.route('/payment/verify/<int:delegate_id>', methods=['POST'])
def verify_payment(delegate_id):
    """Admin manually approves a UTR and activates the delegate account."""
    delegate = Delegate.query.get_or_404(delegate_id)
    if delegate.payment_status == 'paid':
        return jsonify({'success': False, 'message': 'Already verified'}), 400

    password = generate_password()
    password_hash = hash_password(password)
    delegate.password_hash = password_hash
    delegate.payment_status = 'paid'
    delegate.payment_amount = 50.0
    db.session.commit()

    try:
        send_credentials_email(delegate.email, delegate.name, delegate.user_id, password)
        send_payment_confirmation(delegate.email, delegate.name, delegate.user_id, 50)
        delegate.credentials_sent = True
        db.session.commit()
    except Exception as e:
        print(f"Email error: {e}")

    return jsonify({'success': True, 'message': f'Payment verified. Credentials sent to {delegate.email}'})


@payment_bp.route('/payment/status/<int:delegate_id>', methods=['GET'])
def payment_status(delegate_id):
    delegate = Delegate.query.get_or_404(delegate_id)
    return jsonify({
        'delegate_id': delegate_id,
        'status': delegate.payment_status,
        'amount': delegate.payment_amount,
        'utr': delegate.razorpay_payment_id
    })
