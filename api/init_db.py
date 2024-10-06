import sqlite3
import os

DATABASE = '/tmp/database.db'

connection = sqlite3.connect(DATABASE)

with open('schema.sql') as f:
    connection.executescript(f.read())

connection.commit()
connection.close()

print(f"Database initialized at {DATABASE}")