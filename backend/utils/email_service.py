from flask_mail import Message
from extensions import mail
import os

ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'manas.malla13@gmail.com')

def send_organizer_approval_request(organizer):
    """Send email to admin for organizer approval."""
    approve_link = f"http://localhost:5000/api/organizer/approve/{organizer.id}"
    reject_link = f"http://localhost:5000/api/organizer/reject/{organizer.id}"
    msg = Message(
        subject=f"[IGNITE MUN 2026] New Staff Application — {organizer.name}",
        recipients=[ADMIN_EMAIL],
        html=f"""
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
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
                <div style="margin-top:24px; display:flex; gap:12px;">
                    <a href="{approve_link}" style="background:#006c49; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:600;">Approve</a>
                    <a href="{reject_link}" style="background:#ba1a1a; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:600; margin-left:12px;">Reject</a>
                </div>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_credentials_email(recipient_email, name, user_id, password, role='delegate'):
    """Send generated credentials to delegate/organizer."""
    msg = Message(
        subject="[IGNITE MUN 2026] Your Credentials — Welcome!",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7; font-size:14px;">Dialogue and Diplomacy</p>
            </div>
            <div style="background:#fff; padding:32px; border-radius:0 0 8px 8px; border:1px solid #e0e3e5;">
                <h2 style="color:#131b2e;">Welcome, {name}!</h2>
                <p style="color:#45464d;">Your application has been approved. Here are your login credentials for the IGNITE MUN 2026 portal:</p>
                <div style="background:#f2f4f6; border:1px solid #c6c6cd; border-radius:8px; padding:20px; margin:20px 0;">
                    <p style="margin:0 0 8px; color:#76777d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Your {role.upper()} ID</p>
                    <p style="margin:0 0 16px; color:#131b2e; font-size:22px; font-weight:700; font-family:monospace;">{user_id}</p>
                    <p style="margin:0 0 8px; color:#76777d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Access Code</p>
                    <p style="margin:0; color:#131b2e; font-size:22px; font-weight:700; font-family:monospace;">{password}</p>
                </div>
                <p style="color:#45464d;">Login at: <a href="http://localhost:5173/login" style="color:#006c49;">http://localhost:5173/login</a></p>
                <p style="color:#76777d; font-size:12px; margin-top:24px;">This is an automated email. Please do not reply directly.</p>
            </div>
            <p style="text-align:center; color:#76777d; font-size:11px; margin-top:16px;">Made for IGNITE MUN 2026</p>
        </div>
        """
    )
    mail.send(msg)

def send_delegation_email(recipient_email, name, committee, delegation, background_guide_url=None):
    """Send delegation/portfolio assignment to delegate."""
    msg = Message(
        subject=f"[IGNITE MUN 2026] Your Portfolio Allocation — {delegation}",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7;">Portfolio Assignment Notification</p>
            </div>
            <div style="background:#fff; padding:32px; border:1px solid #e0e3e5; border-radius:0 0 8px 8px;">
                <h2 style="color:#131b2e;">Dear {name},</h2>
                <p style="color:#45464d;">We are pleased to inform you that you have been allocated the following portfolio for IGNITE MUN 2026:</p>
                <div style="background:#131b2e; color:#fff; padding:20px; border-radius:8px; text-align:center; margin:20px 0;">
                    <p style="margin:0 0 4px; font-size:12px; opacity:0.6; text-transform:uppercase;">Committee</p>
                    <p style="margin:0 0 16px; font-size:20px; font-weight:700;">{committee}</p>
                    <p style="margin:0 0 4px; font-size:12px; opacity:0.6; text-transform:uppercase;">Portfolio</p>
                    <p style="margin:0; font-size:28px; font-weight:700;">{delegation}</p>
                </div>
                <p style="color:#45464d;">Please login to your delegate dashboard to access your background guide and submit your position paper.</p>
                <a href="http://localhost:5173/login" style="display:inline-block; background:#006c49; color:#fff; padding:12px 24px; border-radius:4px; text-decoration:none; font-weight:600; margin-top:16px;">Access Dashboard</a>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_payment_confirmation(recipient_email, name, user_id, amount):
    """Send payment confirmation email."""
    msg = Message(
        subject="[IGNITE MUN 2026] Payment Confirmed — Registration Complete",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7;">Payment Confirmation</p>
            </div>
            <div style="background:#fff; padding:32px; border:1px solid #e0e3e5; border-radius:0 0 8px 8px;">
                <h2 style="color:#131b2e; text-align:center;">Registration Confirmed!</h2>
                <p style="color:#45464d; text-align:center;">Dear {name}, your payment of Rs.{amount} has been processed.</p>
                <div style="background:#f2f4f6; border-radius:8px; padding:16px; margin:20px 0;">
                    <p style="margin:4px 0; color:#76777d; font-size:12px;">DELEGATE ID</p>
                    <p style="margin:0 0 12px; color:#131b2e; font-weight:700; font-family:monospace; font-size:18px;">{user_id}</p>
                    <p style="margin:4px 0; color:#76777d; font-size:12px;">AMOUNT PAID</p>
                    <p style="margin:0; color:#131b2e; font-weight:700; font-size:18px;">Rs.{amount}</p>
                </div>
            </div>
        </div>
        """
    )
    mail.send(msg)

def send_otp_email(recipient_email, otp_code):
    """Send Super Admin password reset verification code email."""
    msg = Message(
        subject="[IGNITE MUN 2026] Super Admin Password Reset Verification Code",
        recipients=[recipient_email],
        html=f"""
        <div style="font-family: 'Source Sans 3', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#f7f9fb; border-radius: 12px;">
            <div style="background:#131b2e; color:#fff; padding:24px; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:24px;">IGNITE MUN 2026</h1>
                <p style="margin:4px 0 0; opacity:0.7; font-size:14px;">Super Admin Security Verification</p>
            </div>
            <div style="background:#fff; padding:32px; border-radius:0 0 8px 8px; border:1px solid #e0e3e5;">
                <h2 style="color:#131b2e;">Super Admin Password Reset Request</h2>
                <p style="color:#45464d;">You have requested to change the Super Admin portal password. Use the verification code below to authorize this request:</p>
                <div style="background:#f2f4f6; border:2px dashed #006c49; border-radius:8px; padding:20px; text-align:center; margin:24px 0;">
                    <p style="margin:0 0 4px; color:#76777d; font-size:12px; text-transform:uppercase; letter-spacing:0.1em;">Your 6-Digit Verification Code</p>
                    <p style="margin:0; color:#006c49; font-size:36px; font-weight:800; font-family:monospace; letter-spacing:0.2em;">{otp_code}</p>
                </div>
                <p style="color:#ba1a1a; font-size:13px;">[WARNING] This verification code is valid for 15 minutes. Do not share this code with anyone.</p>
                <p style="color:#76777d; font-size:12px; margin-top:24px;">If you did not request a password change, please ignore this email.</p>
            </div>
        </div>
        """
    )
    mail.send(msg)
