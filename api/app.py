from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/audiobooks', methods=['GET'])
def get_audiobooks():
    conn = get_db_connection()
    audiobooks = conn.execute('SELECT * FROM audiobooks').fetchall()
    conn.close()
    return jsonify([dict(ab) for ab in audiobooks])

@app.route('/api/audiobooks/<int:id>', methods=['GET'])
def get_audiobook(id):
    conn = get_db_connection()
    audiobook = conn.execute('SELECT * FROM audiobooks WHERE id = ?', (id,)).fetchone()
    conn.close()
    if audiobook is None:
        return jsonify({"error": "Audiobook not found"}), 404
    return jsonify(dict(audiobook))

@app.route('/api/audiobooks/<int:id>/vote', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)