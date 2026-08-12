from flask import Blueprint, request, jsonify
from app import db
from models import Delegate, Score, Session, Organizer

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/stats', methods=['GET'])
def get_stats():
    total_delegates = Delegate.query.count()
    total_paid = Delegate.query.filter_by(payment_status='paid').count()
    total_free = Delegate.query.filter_by(payment_status='free').count()
    pending_verification = Delegate.query.filter_by(payment_status='pending_verification').count()
    active_sessions = Session.query.filter_by(is_active=True).count()
    pending_papers = Delegate.query.filter_by(delegation_sent=False, payment_status='free').count() + \
                     Delegate.query.filter_by(delegation_sent=False, payment_status='paid').count()
    return jsonify({
        'total_delegates': total_delegates,
        'paid': total_paid,
        'free': total_free,
        'pending_verification': pending_verification,
        'active_sessions': active_sessions,
        'pending_papers': pending_papers,
    })

@admin_bp.route('/admin/scores', methods=['POST'])
def save_scores():
    data = request.get_json()
    delegate_id = data.get('delegate_id')
    session_id = data.get('session_id')

    existing = Score.query.filter_by(delegate_id=delegate_id, session_id=session_id).first()
    if existing:
        score = existing
    else:
        score = Score(delegate_id=delegate_id, session_id=session_id)
        db.session.add(score)

    score.decorum = float(data.get('decorum', 0))
    score.policy = float(data.get('policy', 0))
    score.resolution = float(data.get('resolution', 0))
    score.oratory = float(data.get('oratory', 0))
    score.total = score.decorum + score.policy + score.resolution + score.oratory
    score.remarks = data.get('remarks', '')
    db.session.commit()
    return jsonify({'success': True, 'score': score.to_dict()})

@admin_bp.route('/admin/scores', methods=['GET'])
def get_all_scores():
    scores = Score.query.all()
    result = []
    for s in scores:
        d = s.to_dict()
        d['delegate_name'] = s.delegate.name if s.delegate else 'Unknown'
        d['committee'] = s.delegate.committee if s.delegate else ''
        result.append(d)
    return jsonify(result)

@admin_bp.route('/admin/session', methods=['POST'])
def create_session():
    data = request.get_json()
    # Deactivate all previous sessions for this committee
    Session.query.filter_by(committee=data.get('committee'), is_active=True).update({'is_active': False})
    db.session.commit()
    sess = Session(
        committee=data.get('committee', 'UNSC'),
        session_type=data.get('session_type', 'Moderated Caucus'),
        topic=data.get('topic', ''),
        total_time=int(data.get('total_time', 15)),
        speaking_time=int(data.get('speaking_time', 60)),
        is_active=True,
    )
    db.session.add(sess)
    db.session.commit()
    return jsonify({'success': True, 'session': sess.to_dict()})

@admin_bp.route('/admin/sessions', methods=['GET'])
def get_sessions():
    sessions = Session.query.order_by(Session.created_at.desc()).all()
    return jsonify([s.to_dict() for s in sessions])

@admin_bp.route('/admin/pending-payments', methods=['GET'])
def pending_payments():
    delegates = Delegate.query.filter_by(payment_status='pending_verification').all()
    result = []
    for d in delegates:
        result.append({
            'id': d.id,
            'name': d.name,
            'email': d.email,
            'college': d.college,
            'user_id': d.user_id,
            'utr': d.razorpay_payment_id,
            'created_at': d.created_at.isoformat() if d.created_at else None,
        })
    return jsonify(result)
