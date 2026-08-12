import os
import json
from app import create_app, db
from models import Delegate, Organizer, Score, Session, Admin

def seed_demo_data():
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        print("\n" + "="*70)
        print("    IGNITE MUN 2026 -- BACKEND DATABASE LIVE DEMO")
        print("="*70 + "\n")

        # 1. Seed Admin
        admin = Admin(username='superadmin', password_hash='$2b$12$eImiTXuWVxfM37uY4JANjO5E.5R2G.X7u5x.3Q6xG', role='super_admin', email='manas.malla13@gmail.com')
        db.session.add(admin)
        print("[+] Created Super Admin: superadmin (role: super_admin)")

        # 2. Seed Delegates (Free & Paid)
        delegates_data = [
            {"name": "Aarav Sharma", "college": "SVUCE Tirupati", "class_": "3rd Yr CSE", "email": "aarav.sharma@svuce.edu", "phone": "9876543210", "committee": "UNSC", "pos": ["United States", "United Kingdom"], "status": "free", "user_id": "DEL-2026-001", "delegation": "United States"},
            {"name": "Ananya Reddy", "college": "IIT Madras", "class_": "2nd Yr ECE", "email": "ananya.reddy@iitm.ac.in", "phone": "9876543211", "committee": "UNSC", "pos": ["China", "Russian Federation"], "status": "free", "user_id": "DEL-2026-002", "delegation": "China"},
            {"name": "Rohan Verma", "college": "BITS Pilani", "class_": "4th Yr Mech", "email": "rohan.verma@bits.ac.in", "phone": "9876543212", "committee": "LOK_SABHA", "pos": ["Prime Minister", "Home Minister"], "status": "free", "user_id": "DEL-2026-003", "delegation": "Prime Minister"},
            {"name": "Kavya Patel", "college": "NIT Warangal", "class_": "3rd Yr EEE", "email": "kavya.patel@nitw.ac.in", "phone": "9876543213", "committee": "LOK_SABHA", "pos": ["Education Minister", "Defence Minister"], "status": "pending_verification", "utr": "321456987012", "user_id": "DEL-2026-011", "delegation": "Education Minister"},
            {"name": "Vikram Malhotra", "college": "VIT Vellore", "class_": "2nd Yr IT", "email": "vikram.m@vit.ac.in", "phone": "9876543214", "committee": "UNSC", "pos": ["France", "Japan"], "status": "paid", "amount": 50.0, "utr": "998877665544", "user_id": "DEL-2026-012", "delegation": "France"},
        ]

        for d in delegates_data:
            del_obj = Delegate(
                name=d["name"],
                college=d["college"],
                class_=d["class_"],
                email=d["email"],
                phone=d["phone"],
                committee=d["committee"],
                position_1=d["pos"][0],
                position_2=d["pos"][1],
                payment_status=d["status"],
                payment_amount=d.get("amount", 0.0 if d["status"] == "free" else 50.0),
                razorpay_payment_id=d.get("utr"),
                user_id=d["user_id"],
                password_hash="hashed_password_demo",
                delegation_assigned=d.get("delegation"),
                credentials_sent=True
            )
            db.session.add(del_obj)
        db.session.commit()
        print(f"[+] Seeded {len(delegates_data)} Delegates (Free, Paid & Pending Verification)")

        # 3. Seed Organizers / EB Staff
        organizers_data = [
            {"name": "Priya Nair", "email": "priya.nair@svuce.edu", "phone": "9123456780", "designation": "Executive Board", "role": "eb", "department": "CSE", "committee": "UNSC", "ignite_role": "Co-Chairperson", "status": "approved", "user_id": "ORG-2026-001"},
            {"name": "Siddharth Rao", "email": "siddharth.rao@svuce.edu", "phone": "9123456781", "designation": "Organizing Committee", "role": "oc", "department": "ECE", "committee": "Logistics", "ignite_role": "Head of Logistics", "status": "approved", "user_id": "ORG-2026-002"},
            {"name": "Meera Joshi", "email": "meera.joshi@svuce.edu", "phone": "9123456782", "designation": "Executive Board", "role": "eb", "department": "EEE", "committee": "LOK_SABHA", "ignite_role": "Speaker", "status": "pending"},
        ]
        for o in organizers_data:
            org_obj = Organizer(
                name=o["name"],
                email=o["email"],
                phone=o["phone"],
                designation=o["designation"],
                role=o["role"],
                department=o["department"],
                committee=o["committee"],
                ignite_role=o["ignite_role"],
                status=o["status"],
                user_id=o.get("user_id")
            )
            db.session.add(org_obj)
        db.session.commit()
        print(f"[+] Seeded {len(organizers_data)} Organizers / EB Members")

        # 4. Seed Parliamentary Session & Scores
        sess = Session(committee="UNSC", session_type="moderated", topic="Middle East Crisis & Security Resolution", total_time=20, speaking_time=60, is_active=True)
        db.session.add(sess)
        db.session.commit()

        scores_data = [
            {"delegate_id": 1, "session_id": sess.id, "decorum": 9.0, "policy": 8.5, "resolution": 9.5, "oratory": 9.0, "total": 36.0, "remarks": "Exceptional articulation on Veto usage."},
            {"delegate_id": 2, "session_id": sess.id, "decorum": 8.5, "policy": 9.0, "resolution": 8.0, "oratory": 8.5, "total": 34.0, "remarks": "Strong diplomatic posture and POI defense."},
            {"delegate_id": 5, "session_id": sess.id, "decorum": 8.0, "policy": 8.0, "resolution": 8.5, "oratory": 8.0, "total": 32.5, "remarks": "Solid draft resolution co-sponsorship."},
        ]
        for s in scores_data:
            sc_obj = Score(**s)
            db.session.add(sc_obj)
        db.session.commit()
        print("[+] Seeded Active UNSC Moderated Caucus Session & Scores\n")

        # ── SHOW TABLE 1: DELEGATES DATABASE ──
        print("+" + "-"*78 + "+")
        print("| DELEGATES DATABASE TABLE (sqlite: ignite_mun_2026.db -> delegates)".ljust(79) + "|")
        print("+" + "-"*78 + "+")
        print(f"| {'ID':<4} | {'User ID':<12} | {'Delegate Name':<18} | {'Committee':<10} | {'Status':<12} | {'Assigned Delegation':<20} |")
        print("+" + "-"*78 + "+")
        for d in Delegate.query.all():
            print(f"| {d.id:<4} | {d.user_id:<12} | {d.name:<18} | {d.committee:<10} | {d.payment_status:<12} | {(d.delegation_assigned or 'Unassigned'):<20} |")
        print("+" + "-"*78 + "+\n")

        # ── SHOW TABLE 2: ORGANIZERS DATABASE ──
        print("+" + "-"*78 + "+")
        print("| ORGANIZERS / EB STAFF DATABASE TABLE (sqlite: organizers)".ljust(79) + "|")
        print("+" + "-"*78 + "+")
        print(f"| {'ID':<4} | {'Name':<16} | {'Role':<5} | {'Committee':<12} | {'Designation':<20} | {'Status':<8} |")
        print("+" + "-"*78 + "+")
        for o in Organizer.query.all():
            print(f"| {o.id:<4} | {o.name:<16} | {o.role.upper():<5} | {o.committee:<12} | {o.ignite_role:<20} | {o.status:<8} |")
        print("+" + "-"*78 + "+\n")

        # ── SHOW TABLE 3: LIVE EVALUATION SCORES ──
        print("+" + "-"*78 + "+")
        print("| EB LEADERBOARD & EVALUATION SCORES (sqlite: scores)".ljust(79) + "|")
        print("+" + "-"*78 + "+")
        print(f"| {'Rank':<5} | {'Delegate':<18} | {'Decorum':<8} | {'Policy':<8} | {'Oratory':<8} | {'Total':<6} |")
        print("+" + "-"*78 + "+")
        for rank, s in enumerate(Score.query.order_by(Score.total.desc()).all(), start=1):
            del_name = Delegate.query.get(s.delegate_id).name
            print(f"| #{rank:<4} | {del_name:<18} | {s.decorum:<8.1f} | {s.policy:<8.1f} | {s.oratory:<8.1f} | {s.total:<6.1f} |")
        print("+" + "-"*78 + "+\n")

if __name__ == '__main__':
    seed_demo_data()
