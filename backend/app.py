from flask import Flask, jsonify, render_template_string
from flask_cors import CORS
from dotenv import load_dotenv
import os
from extensions import db, mail

load_dotenv()

HTML_DASHBOARD_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IGNITE MUN 2026 — Backend Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Source Sans 3', sans-serif; background: #0f0d13; color: #e6e1e5; margin: 0; padding: 30px; }
    .container { max-width: 1000px; margin: 0 auto; }
    .card { background: #1d1b20; border: 1px solid #49454f; border-radius: 12px; padding: 24px; margin-bottom: 24px; shadow: 0 4px 20px rgba(0,0,0,0.4); }
    h1 { color: #d0bcff; font-size: 28px; margin-top: 0; }
    h2 { color: #f2b8b5; font-size: 20px; border-bottom: 1px solid #49454f; padding-bottom: 8px; }
    .badge { display: inline-block; padding: 4px 12px; background: #21005d; color: #e8def8; border-radius: 16px; font-size: 14px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .stat-box { background: #2b2930; padding: 16px; border-radius: 8px; border-left: 4px solid #d0bcff; text-align: center; }
    .stat-val { font-size: 32px; font-weight: 700; color: #fff; }
    .stat-lbl { font-size: 13px; color: #cac4d0; text-transform: uppercase; letter-spacing: 0.5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { text-align: left; padding: 10px 14px; border-bottom: 1px solid #36343b; font-size: 14px; }
    th { background: #25232a; color: #d0bcff; font-weight: 600; }
    .btn { display: inline-block; padding: 8px 16px; background: #6750a4; color: #fff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; transition: background 0.2s; }
    .btn:hover { background: #7d5260; }
    .tag-free { background: #1b5e20; color: #a5d6a7; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
    .tag-paid { background: #0d47a1; color: #90caf9; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
    .tag-pending { background: #e65100; color: #ffcc80; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1>IGNITE MUN 2026 Backend Portal</h1>
          <p style="color:#cac4d0; margin:0;">Python Flask 3.0 API & SQLite Database Service</p>
        </div>
        <span class="badge">🟢 Server Status: Active</span>
      </div>

      <div class="grid">
        <div class="stat-box">
          <div class="stat-val">{{ stats.total_delegates }}</div>
          <div class="stat-lbl">Total Delegates</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#a5d6a7;">{{ stats.remaining_free_slots }}</div>
          <div class="stat-lbl">Free Slots Remaining</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#90caf9;">{{ stats.paid }}</div>
          <div class="stat-lbl">Paid Registrations</div>
        </div>
        <div class="stat-box">
          <div class="stat-val" style="color:#ffcc80;">{{ organizers_count }}</div>
          <div class="stat-lbl">Organizers / EB</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>🔌 Quick API Endpoints & Exports</h2>
      <div style="margin-top: 12px;">
        <a href="/api/stats" class="btn" target="_blank">📊 GET /api/stats</a>
        <a href="/api/delegates" class="btn" target="_blank">👥 GET /api/delegates</a>
        <a href="/api/payment/info" class="btn" target="_blank">💳 GET /api/payment/info</a>
        <a href="/api/export/delegates.xlsx" class="btn" target="_blank">📥 Export Delegates (.xlsx)</a>
        <a href="/api/export/delegates.pdf" class="btn" target="_blank">📄 Export Delegates (.pdf)</a>
      </div>
    </div>

    <div class="card">
      <h2>🗃️ Database Table: Registered Delegates</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Name</th>
            <th>College</th>
            <th>Committee</th>
            <th>Status</th>
            <th>Assigned Delegation</th>
          </tr>
        </thead>
        <tbody>
          {% for d in delegates %}
          <tr>
            <td>{{ d.id }}</td>
            <td><strong>{{ d.user_id }}</strong></td>
            <td>{{ d.name }}</td>
            <td>{{ d.college }}</td>
            <td>{{ d.committee }}</td>
            <td>
              {% if d.payment_status == 'free' %}<span class="tag-free">FREE</span>
              {% elif d.payment_status == 'paid' %}<span class="tag-paid">PAID</span>
              {% else %}<span class="tag-pending">{{ d.payment_status|upper }}</span>{% endif %}
            </td>
            <td>{{ d.delegation_assigned or 'Unassigned' }}</td>
          </tr>
          {% else %}
          <tr><td colspan="7" style="text-align:center; color:#888;">No delegates registered yet.</td></tr>
          {% endfor %}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
"""

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
    CORS(app,
         resources={r"/api/*": {"origins": [
             "https://the-ignite-club.github.io",
             "https://i-mun.onrender.com",
             "http://localhost:5173",
             "http://localhost:3000",
             "http://127.0.0.1:5173",
         ]}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Register blueprints
    from routes.auth import auth_bp
    from routes.delegates import delegates_bp
    from routes.organizers import organizers_bp
    from routes.admin import admin_bp
    from routes.payment import payment_bp
    from routes.export import export_bp
    from routes.queries import queries_bp

    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(delegates_bp, url_prefix='/api')
    app.register_blueprint(organizers_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(payment_bp, url_prefix='/api')
    app.register_blueprint(export_bp, url_prefix='/api')
    app.register_blueprint(queries_bp, url_prefix='/api')

    @app.route('/')
    def backend_dashboard():
        from models import Delegate, Organizer
        FREE_SLOTS = int(os.getenv('FREE_SLOTS', 10))
        total = Delegate.query.count()
        paid = Delegate.query.filter_by(payment_status='paid').count()
        free = Delegate.query.filter_by(payment_status='free').count()
        pending = Delegate.query.filter_by(payment_status='pending').count()
        org_count = Organizer.query.count()
        stats = {
            'total_delegates': total,
            'paid': paid,
            'free': free,
            'pending_payment': pending,
            'remaining_free_slots': max(0, FREE_SLOTS - free)
        }
        delegates = Delegate.query.order_by(Delegate.id.desc()).all()
        return render_template_string(HTML_DASHBOARD_TEMPLATE, stats=stats, delegates=delegates, organizers_count=org_count)

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
    app.run(debug=True, host='0.0.0.0', port=5000)
