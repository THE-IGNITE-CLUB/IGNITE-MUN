from extensions import db
import pytz
from datetime import datetime

IST = pytz.timezone('Asia/Kolkata')

class Delegate(db.Model):
    __tablename__ = 'delegates'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    class_ = db.Column(db.String(100))
    college = db.Column(db.String(300), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    phone = db.Column(db.String(20))
    committee = db.Column(db.String(50))  # 'UNSC' or 'LOK_SABHA'
    position_1 = db.Column(db.String(200))
    position_2 = db.Column(db.String(200))
    position_3 = db.Column(db.String(200))
    position_4 = db.Column(db.String(200))
    position_5 = db.Column(db.String(200))
    mun_experience = db.Column(db.Text)
    user_id = db.Column(db.String(50), unique=True)
    password_hash = db.Column(db.String(200))
    payment_status = db.Column(db.String(20), default='pending')  # pending, free, paid, pending_verification
    payment_amount = db.Column(db.Float, default=0.0)
    razorpay_payment_id = db.Column(db.String(200))
    delegation_assigned = db.Column(db.String(200))
    delegation_sent = db.Column(db.Boolean, default=False)
    credentials_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))
    scores = db.relationship('Score', backref='delegate', lazy=True)
    queries = db.relationship('Query', backref='delegate', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'class_': self.class_,
            'college': self.college,
            'institution': self.college,  # alias for frontend compatibility
            'email': self.email,
            'phone': self.phone,
            'committee': self.committee,
            'positions': [self.position_1, self.position_2, self.position_3, self.position_4, self.position_5],
            'mun_experience': self.mun_experience,
            'user_id': self.user_id,
            'payment_status': self.payment_status,
            'delegation_assigned': self.delegation_assigned,
            'delegation_sent': self.delegation_sent,
            'credentials_sent': self.credentials_sent,
            'utr_number': self.razorpay_payment_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class Organizer(db.Model):
    __tablename__ = 'organizers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    phone = db.Column(db.String(20))
    designation = db.Column(db.String(200))
    role = db.Column(db.String(50))  # 'oc' or 'eb'
    department = db.Column(db.String(200))
    committee = db.Column(db.String(100))
    ignite_role = db.Column(db.String(50))
    ignite_batch = db.Column(db.String(10))
    experience = db.Column(db.Text)
    statement = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    user_id = db.Column(db.String(50))
    password_hash = db.Column(db.String(200))
    credentials_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'designation': self.designation,
            'role': self.role,
            'department': self.department,
            'committee': self.committee,
            'status': self.status,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class Score(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key=True)
    delegate_id = db.Column(db.Integer, db.ForeignKey('delegates.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))
    decorum = db.Column(db.Float, default=0)
    policy = db.Column(db.Float, default=0)
    resolution = db.Column(db.Float, default=0)
    oratory = db.Column(db.Float, default=0)
    total = db.Column(db.Float, default=0)
    remarks = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))

    def to_dict(self):
        return {
            'id': self.id,
            'delegate_id': self.delegate_id,
            'decorum': self.decorum,
            'policy': self.policy,
            'resolution': self.resolution,
            'oratory': self.oratory,
            'total': self.total,
            'remarks': self.remarks,
        }

class Session(db.Model):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    committee = db.Column(db.String(100))
    session_type = db.Column(db.String(50))  # moderated, unmoderated, gsl, voting
    topic = db.Column(db.Text)
    total_time = db.Column(db.Integer, default=15)  # minutes
    speaking_time = db.Column(db.Integer, default=60)  # seconds
    is_active = db.Column(db.Boolean, default=True)
    broadcast_message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))
    scores = db.relationship('Score', backref='session', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'committee': self.committee,
            'session_type': self.session_type,
            'topic': self.topic,
            'total_time': self.total_time,
            'speaking_time': self.speaking_time,
            'is_active': self.is_active,
            'broadcast_message': self.broadcast_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class Admin(db.Model):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(200))
    role = db.Column(db.String(50), default='admin')  # admin, super_admin, eb
    email = db.Column(db.String(200), default='manas.malla13@gmail.com')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))

class AdminOTP(db.Model):
    __tablename__ = 'admin_otps'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False)
    otp_code = db.Column(db.String(10), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))

class Query(db.Model):
    __tablename__ = 'queries'
    id = db.Column(db.Integer, primary_key=True)
    delegate_id = db.Column(db.Integer, db.ForeignKey('delegates.id'), nullable=False)
    delegate_name = db.Column(db.String(200))
    subject = db.Column(db.String(200))
    question = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, answered
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(IST))
    answered_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'delegate_id': self.delegate_id,
            'delegate_name': self.delegate_name,
            'subject': self.subject,
            'question': self.question,
            'response': self.response,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'answered_at': self.answered_at.isoformat() if self.answered_at else None,
        }
