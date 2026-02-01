import os
import pickle
import sqlite3
import subprocess
from flask import Flask, request, render_template_string
import hashlib
import random

app = Flask(__name__)

# Hard-coded secrets (Secret Detection)
AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
DATABASE_PASSWORD = "SuperSecret123!"
API_KEY = "sk-1234567890abcdefghijklmnopqrstuvwxyz"
PRIVATE_KEY = """-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA1234567890abcdef
-----END RSA PRIVATE KEY-----"""

# SQL Injection vulnerability (A03:2021 – Injection)
@app.route('/user')
def get_user():
    username = request.args.get('username')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # Vulnerable to SQL injection
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)
    result = cursor.fetchall()
    return str(result)

# Command Injection (A03:2021 – Injection)
@app.route('/ping')
def ping():
    host = request.args.get('host')
    # Dangerous use of shell=True with user input
    result = subprocess.run(f'ping -c 1 {host}', shell=True, capture_output=True)
    return result.stdout

# XSS vulnerability (A03:2021 – Injection)
@app.route('/search')
def search():
    query = request.args.get('q')
    # Template injection and XSS
    template = f'<h1>Search Results for: {query}</h1>'
    return render_template_string(template)

# Insecure Deserialization (A08:2021 – Software and Data Integrity Failures)
@app.route('/load')
def load_object():
    data = request.args.get('data')
    # Dangerous pickle deserialization
    obj = pickle.loads(data.encode())
    return str(obj)

# Path Traversal (A01:2021 – Broken Access Control)
@app.route('/file')
def read_file():
    filename = request.args.get('name')
    # No path validation
    with open(f'/var/www/files/{filename}', 'r') as f:
        return f.read()

# Weak Cryptography (A02:2021 – Cryptographic Failures)
def hash_password(password):
    # MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()

# Insecure Random (A02:2021 – Cryptographic Failures)
def generate_token():
    # Using insecure random for security-sensitive operation
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

# SSRF vulnerability (A10:2021 – Server-Side Request Forgery)
@app.route('/fetch')
def fetch_url():
    import urllib.request
    url = request.args.get('url')
    # No URL validation
    response = urllib.request.urlopen(url)
    return response.read()

# Information Disclosure
@app.route('/debug')
def debug():
    # Exposing sensitive debug information
    return str(os.environ)

# Missing authentication
@app.route('/admin/delete_user')
def delete_user():
    user_id = request.args.get('id')
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM users WHERE id = {user_id}")
    conn.commit()
    return "User deleted"

# Complex function (code smell)
def process_data(data, flag1, flag2, flag3, mode, option, setting, config, param):
    result = None
    if flag1:
        if flag2:
            if flag3:
                if mode == 'A':
                    if option == 1:
                        if setting:
                            if config == 'default':
                                if param > 10:
                                    result = data * 2
                                else:
                                    result = data * 3
                            else:
                                result = data * 4
                        else:
                            result = data * 5
                    else:
                        result = data * 6
                else:
                    result = data * 7
            else:
                result = data * 8
        else:
            result = data * 9
    else:
        result = data * 10
    return result

# Duplicate code block 1
def calculate_total_price(items):
    total = 0
    for item in items:
        price = item['price']
        quantity = item['quantity']
        discount = item.get('discount', 0)
        tax = price * 0.1
        item_total = (price * quantity) - discount + tax
        total += item_total
    return total

# Duplicate code block 2 (same logic)
def calculate_order_cost(products):
    total = 0
    for item in products:
        price = item['price']
        quantity = item['quantity']
        discount = item.get('discount', 0)
        tax = price * 0.1
        item_total = (price * quantity) - discount + tax
        total += item_total
    return total

# Dead code
def unused_function():
    print("This function is never called")
    return 42

def another_unused_function():
    x = 10
    y = 20
    z = x + y
    return z

# Missing docstrings
def connect_to_database(host, port, user, password):
    pass

def validate_input(data):
    pass

def transform_data(input_data):
    pass

if __name__ == '__main__':
    # Debug mode enabled in production (A05:2021 – Security Misconfiguration)
    app.run(debug=True, host='0.0.0.0', port=5000)
