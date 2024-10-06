import sqlite3
import os

# Use the same relative path as in app.py
DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')

connection = sqlite3.connect(DATABASE)

with open('schema.sql') as f:
    connection.executescript(f.read())

connection.commit()
connection.close()

print(f"Database initialized at {DATABASE}")