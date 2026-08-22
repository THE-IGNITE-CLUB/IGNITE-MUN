from flask_mail import Message
from extensions import mail
import os

ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'manas.malla13@gmail.com')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'https://the-ignite-club.github.io/IGNITE-MUN')
BACKEND_URL = os.getenv('BACKEND_URL', 'https://ignite-mun-backend.onrender.com')

def send_organizer_approval_request(organizer):
    """Send email to admin for organizer approval."""
    approve_link = f"{BACKEND_URL}/api/organizer/approve/{organizer.id}"
    reject_link = f"{BACKEND_URL}/api/organizer/reject/{organizer.id}"
    msg = Message(
        subject=f"[IGNITE MUN 2026] New Staff Application — {organizer.name}",
        recipients=[ADMIN_EMAIL],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7; font-size:14px;">Staff Registration Review Required</p>
            </div>
            <div style="background:#fff; padding:24px; border-radius:0 0 8px 8px; border:1px solid #e0e3e5;">
                <h2 style="color:#131b2e;">New Application: {organizer.name}</h2>
                <table style="width:100%; border-collapse:collapse;">
                    <tr><td style="padding:8px; color:#76777d; font-size:12px; text-transform:uppercase;">Role</td><td style="padding:8px; color:#191c1e;">{organizer.role.upper()}</td></tr>
                    <tr><td style="padding:8px; color:#76777d; font-size:12px; text-transform:uppercase;">Email</td><td style="padding:8px; color:#191c1e;">{organizer.email}</td></tr>
                    <tr><td style="padding:8px; color:#76777d; font-size:12px; text-transform:uppercase;">Phone</td><td style="padding:8px; color:#191c1e;">{organizer.phone}</td></tr>
                    <tr><td style="padding:8px; color:#76777d; font-size:12px; text-transform:uppercase;">Designation</td><td style="padding:8px; color:#191c1e;">{organizer.designation}</td></tr>
                </table>
                <p style="color:#45464d;"><strong>Statement:</strong> {organizer.statement or 'N/A'}</p>
                <div style="margin-top:24px;">
                    <a href="{approve_link}" style="background:#006c49; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:600;">Approve</a>
                    <a href="{reject_link}" style="background:#ba1a1a; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:600; margin-left:12px;">Reject</a>
                </div>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_credentials_email(recipient_email, name, user_id, password, role='delegate'):
    """Send auto-generated credentials to delegate/organizer."""
    login_url = f"{FRONTEND_URL}/#/login" if FRONTEND_URL.endswith('IGNITE-MUN') else f"{FRONTEND_URL}/login"
    msg = Message(
        subject="[IGNITE MUN 2026] Your Login Credentials — Welcome!",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7; font-size:14px;">Fueling Global Dialogue · Sri Venkateswara University</p>
            </div>
            <div style="background:#fff; padding:32px; border-radius:0 0 8px 8px; border:1px solid #e0e3e5;">
                <h2 style="color:#131b2e;">Welcome, {name}!</h2>
                <p style="color:#45464d;">Your registration for <strong>IGNITE MUN 2026</strong> has been confirmed. Below are your auto-generated login credentials. Please save them securely.</p>
                <div style="background:#f2f4f6; border:2px solid #006c49; border-radius:8px; padding:24px; margin:24px 0; text-align:center;">
                    <p style="margin:0 0 4px; color:#76777d; font-size:11px; text-transform:uppercase; letter-spacing:0.15em;">Your {role.replace('_',' ').upper()} ID</p>
                    <p style="margin:0 0 20px; color:#131b2e; font-size:26px; font-weight:800; font-family:monospace; letter-spacing:0.05em;">{user_id}</p>
                    <p style="margin:0 0 4px; color:#76777d; font-size:11px; text-transform:uppercase; letter-spacing:0.15em;">Auto-Generated Password</p>
                    <p style="margin:0; color:#006c49; font-size:26px; font-weight:800; font-family:monospace; letter-spacing:0.1em;">{password}</p>
                </div>
                <div style="text-align:center; margin-top:24px;">
                    <a href="{FRONTEND_URL}/login" style="display:inline-block; background:#006c49; color:#fff; padding:14px 32px; border-radius:6px; text-decoration:none; font-weight:700; font-size:16px;">Login to Your Portal →</a>
                </div>
                <p style="color:#ba1a1a; font-size:12px; margin-top:24px; padding:12px; background:#fff2f2; border-radius:6px; border-left:3px solid #ba1a1a;">
                    ⚠️ Keep your credentials private. Do not share your password with anyone. IGNITE MUN staff will never ask for your password.
                </p>
                <p style="color:#76777d; font-size:11px; margin-top:16px; text-align:center;">This is an automated email from IGNITE MUN 2026 · Sri Venkateswara University, Tirupati</p>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_delegation_email(recipient_email, name, committee, delegation, background_guide_url=None):
    """Send delegation/portfolio assignment to delegate."""
    msg = Message(
        subject=f"[IGNITE MUN 2026] Your Portfolio — {delegation}",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7;">Portfolio Assignment Notification</p>
            </div>
            <div style="background:#fff; padding:32px; border:1px solid #e0e3e5; border-radius:0 0 8px 8px;">
                <h2 style="color:#131b2e;">Dear {name},</h2>
                <p style="color:#45464d;">We are pleased to inform you that you have been allocated the following portfolio for IGNITE MUN 2026:</p>
                <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px; text-align:center; margin:20px 0;">
                    <p style="margin:0 0 4px; font-size:12px; opacity:0.6; text-transform:uppercase;">Committee</p>
                    <p style="margin:0 0 16px; font-size:20px; font-weight:700;">{committee}</p>
                    <p style="margin:0 0 4px; font-size:12px; opacity:0.6; text-transform:uppercase;">Portfolio / Delegation</p>
                    <p style="margin:0; font-size:28px; font-weight:800;">{delegation}</p>
                </div>
                <p style="color:#45464d;">Please login to your delegate dashboard to access your background guide and submit your position paper.</p>
                <div style="text-align:center; margin-top:24px;">
                    <a href="{FRONTEND_URL}/login" style="display:inline-block; background:#006c49; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:700;">Access Dashboard →</a>
                </div>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_payment_confirmation(recipient_email, name, user_id, amount):
    """Send payment confirmation and credentials email."""
    msg = Message(
        subject="[IGNITE MUN 2026] Payment Confirmed — Registration Complete",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7;">Payment Confirmation</p>
            </div>
            <div style="background:#fff; padding:32px; border:1px solid #e0e3e5; border-radius:0 0 8px 8px;">
                <div style="text-align:center; margin-bottom:24px;">
                    <div style="width:60px; height:60px; background:#e8f5e9; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px;">
                        <span style="font-size:28px;">✅</span>
                    </div>
                    <h2 style="color:#131b2e; margin:0;">Registration Confirmed!</h2>
                    <p style="color:#45464d; margin:8px 0 0;">Dear {name}, your payment has been successfully processed.</p>
                </div>
                <div style="background:#f2f4f6; border-radius:8px; padding:20px; margin:20px 0;">
                    <p style="margin:4px 0; color:#76777d; font-size:11px; text-transform:uppercase;">Delegate ID</p>
                    <p style="margin:0 0 12px; color:#131b2e; font-weight:800; font-family:monospace; font-size:20px;">{user_id}</p>
                    <p style="margin:4px 0; color:#76777d; font-size:11px; text-transform:uppercase;">Amount Paid</p>
                    <p style="margin:0; color:#006c49; font-weight:800; font-size:20px;">₹{amount}</p>
                </div>
                <div style="text-align:center;">
                    <a href="{FRONTEND_URL}/login" style="display:inline-block; background:#006c49; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:700;">Login to Portal →</a>
                </div>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_otp_email(recipient_email, otp_code):
    """Send Super Admin password reset verification code."""
    msg = Message(
        subject="[IGNITE MUN 2026] Admin Verification Code",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7; font-size:14px;">Admin Security Verification</p>
            </div>
            <div style="background:#fff; padding:32px; border-radius:0 0 8px 8px; border:1px solid #e0e3e5;">
                <h2 style="color:#131b2e;">Password Reset Request</h2>
                <p style="color:#45464d;">Use the verification code below to authorize this request:</p>
                <div style="background:#f2f4f6; border:2px dashed #006c49; border-radius:8px; padding:24px; text-align:center; margin:24px 0;">
                    <p style="margin:0 0 8px; color:#76777d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">6-Digit Verification Code</p>
                    <p style="margin:0; color:#006c49; font-size:40px; font-weight:800; font-family:monospace; letter-spacing:0.3em;">{otp_code}</p>
                </div>
                <p style="color:#ba1a1a; font-size:13px; padding:12px; background:#fff2f2; border-radius:6px;">⚠️ Valid for 15 minutes. Do not share this code with anyone.</p>
                <p style="color:#76777d; font-size:12px; margin-top:16px;">If you did not request this, please ignore this email.</p>
            </div>
        </div>
        """
    )
    mail.send(msg)
