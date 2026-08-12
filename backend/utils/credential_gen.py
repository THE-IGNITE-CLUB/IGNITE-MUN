import random
import string
import bcrypt

def generate_delegate_id(count):
    return f"DEL-2026-{count:03d}"

def generate_organizer_id(count):
    return f"ORG-2026-{count:03d}"

def generate_password(length=10):
    chars = string.ascii_letters + string.digits + "!@#$"
    return ''.join(random.choices(chars, k=length))

def hash_password(plain_text):
    return bcrypt.hashpw(plain_text.encode(), bcrypt.gensalt()).decode()

def check_password(plain_text, hashed):
    return bcrypt.checkpw(plain_text.encode(), hashed.encode())
