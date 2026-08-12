from flask import Blueprint, request, jsonify, session
from extensions import db
from models import Query, Delegate
from datetime import datetime
import pytz

IST = pytz.timezone('Asia/Kolkata')
queries_bp = Blueprint('queries', __name__)

@queries_bp.route('/queries/create', methods=['POST'])
def create_query():
    data = request.get_json() or {}
    delegate_id = data.get('delegate_id')
    question = data.get('question', '').strip()
    subject = data.get('subject', 'General Secretariat Inquiry').strip()

    if not delegate_id or not question:
        return jsonify({'success': False, 'message': 'Delegate ID and question are required'}), 400

    delegate = Delegate.query.get(delegate_id)
    if not delegate:
        return jsonify({'success': False, 'message': 'Delegate not found'}), 404

    query = Query(
        delegate_id=delegate.id,
        delegate_name=delegate.name,
        subject=subject,
        question=question,
        status='pending'
    )
    db.session.add(query)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Query submitted to the Secretariat. You will receive an answer shortly.',
        'query': query.to_dict()
    }), 201

@queries_bp.route('/queries/delegate/<int:delegate_id>', methods=['GET'])
def get_delegate_queries(delegate_id):
    queries = Query.query.filter_by(delegate_id=delegate_id).order_by(Query.created_at.desc()).all()
    return jsonify([q.to_dict() for q in queries])

@queries_bp.route('/queries/all', methods=['GET'])
def get_all_queries():
    queries = Query.query.order_by(Query.status.asc(), Query.created_at.desc()).all()
    return jsonify([q.to_dict() for q in queries])

@queries_bp.route('/queries/respond/<int:query_id>', methods=['POST'])
def respond_query(query_id):
    query = Query.query.get_or_404(query_id)
    data = request.get_json() or {}
    response_text = data.get('response', '').strip()

    if not response_text:
        return jsonify({'success': False, 'message': 'Response content cannot be empty'}), 400

    query.response = response_text
    query.status = 'answered'
    query.answered_at = datetime.now(IST)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Response sent to {query.delegate_name} successfully.',
        'query': query.to_dict()
    })
