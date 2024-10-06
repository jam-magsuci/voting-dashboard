from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
from flask_login import LoginManager, login_required, login_user, logout_user, current_user, UserMixin
from functools import wraps

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.urandom(24)  # Generate a random secret key for sessions
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if user:
        return User(user['id'], user['username'])
    return None

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/audiobooks', methods=['GET'])
@login_required
def get_audiobooks():
    conn = get_db_connection()
    audiobooks = conn.execute('SELECT * FROM audiobooks').fetchall()
    conn.close()
    return jsonify([dict(ab) for ab in audiobooks])

@app.route('/api/audiobooks/<int:id>', methods=['GET'])
@login_required
def get_audiobook(id):
    conn = get_db_connection()
    audiobook = conn.execute('SELECT * FROM audiobooks WHERE id = ?', (id,)).fetchone()
    conn.close()
    if audiobook is None:
        return jsonify({"error": "Audiobook not found"}), 404
    return jsonify(dict(audiobook))

@app.route('/api/audiobooks/<int:id>/vote', methods=['POST'])
@login_required
def vote_audiobook(id):
    conn = get_db_connection()
    audiobook = conn.execute('SELECT * FROM audiobooks WHERE id = ?', (id,)).fetchone()
    if audiobook is None:
        conn.close()
        return jsonify({"error": "Audiobook not found"}), 404
    
    conn.execute('UPDATE audiobooks SET vote_count = vote_count + 1 WHERE id = ?', (id,))
    conn.commit()
    updated_audiobook = conn.execute('SELECT * FROM audiobooks WHERE id = ?', (id,)).fetchone()
    conn.close()
    return jsonify(dict(updated_audiobook))

@app.route('/api/signup', methods=['POST'])
def signup():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    
    if user:
        conn.close()
        return jsonify({"error": "Username already exists"}), 400
    
    hashed_password = generate_password_hash(password)
    conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    conn.close()
    
    if user and check_password_hash(user['password'], password):
        user_obj = User(user['id'], user['username'])
        login_user(user_obj)
        return jsonify({"message": "Logged in successfully", "user_id": user['id']}), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

# Update the error handler for unauthorized access
@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401

if __name__ == '__main__':
    app.run(debug=True)