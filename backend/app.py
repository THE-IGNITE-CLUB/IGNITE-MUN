from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()
mail = Mail()

def create_app():
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'fallback_secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ignite_mun_2026.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Mail Config
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.getenv('GMAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('GMAIL_APP_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('GMAIL_USERNAME')

    # Init extensions
    db.init_app(app)
    mail.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Register blueprints
    from routes.auth import auth_bp
    from routes.delegates import delegates_bp
    from routes.organizers import organizers_bp
    from routes.admin import admin_bp
    from routes.payment import payment_bp
    from routes.export import export_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(delegates_bp, url_prefix='/api')
    app.register_blueprint(organizers_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(payment_bp, url_prefix='/api')
    app.register_blueprint(export_bp, url_prefix='/api')

    with app.app_context():
        db.create_all()
        _seed_admin()

    return app

def _seed_admin():
    from models import Admin
    import bcrypt
    if not Admin.query.filter_by(username='superadmin').first():
        hashed = bcrypt.hashpw('admin2026'.encode(), bcrypt.gensalt())
        admin = Admin(username='superadmin', password_hash=hashed.decode(), role='super_admin')
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
