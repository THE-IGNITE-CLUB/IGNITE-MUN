# IGNITE MUN 2026 — Full Stack Web Application

Welcome to the official web application for **IGNITE MUN 2026**, hosted by Sri Venkateswara University College of Engineering (SVUCE), Tirupati.

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS v3, Framer Motion, Axios, React Hot Toast.
- **Backend**: Python Flask 3.0, Flask-SQLAlchemy, Flask-CORS, Flask-Mail, bcrypt, openpyxl, reportlab.
- **Database**: SQLite (built-in, configurable to PostgreSQL).

---

## 👥 Contributors & Core Development Team

- **Charan Deverakonda** ([@charandeverakonda10](https://github.com/charandeverakonda10)) — Lead Developer & Contributor
- **Manas Malla** ([@manasmalla1316](https://github.com/manasmalla1316)) — Lead Developer & Contributor
- **THE IGNITE CLUB** ([@THE-IGNITE-CLUB](https://github.com/THE-IGNITE-CLUB)) — Host Student Leadership Organisation at SVUCE Tirupati

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

---

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
The backend server will start at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server will start at `http://localhost:5173`.

---

## Features

- **Delegate Portal**: Registration (first 10 free, UPI payment validation with UTR check for subsequent), Login, Position Paper Upload, Allotted Delegation view.
- **Executive Board & Admin Panel**: Real-time GSL/Caucus Timer with alarms, delegate scoring, position paper reviews, delegation allotment, Excel & PDF delegate export.
- **Organizer Staff Portal**: Staff application with automated email notification & admin approval.
- **Secretariat Q&A Support**: Delegates submit inquiries, Secretariat dispatches individual answers.
- **Parliamentary Proceedings & International Press**: Dedicated committees for UNSC, Lok Sabha Parliamentary Proceedings, and International Press Corps.
- **Super Admin Panel**: Full command center for delegate & organizer credentials management, financial tracking, and Email OTP password resets.

---

## License
MIT License. Created for IGNITE MUN 2026.
