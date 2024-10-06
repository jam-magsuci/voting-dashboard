# Audiobook Voting Dashboard

A web application built with React, Tailwind CSS, Flask, and SQLite, allowing users to vote for their favorite audiobooks.

![Login/Signup Page](https://i.imgur.com/84aD1LF.png)
![Homepage](https://i.imgur.com/Aqc4JAQ.png)
![Detail Page](https://i.imgur.com/rknG9JZ.png)

## Features

- User authentication (login and signup)
- Fetch audiobook data from SQLite via Flask API
- Voting mechanism for audiobooks

## Live Demo

Visit the live application: [Audiobook Voting Dashboard](https://voting-dashboard-homepage.onrender.com/)

## Setup Instructions

### Backend (Flask API)

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   set FLASK_APP=app.py
   set FLASK_ENV=development
   set SECRET_KEY=<random string>
   ```

5. Initialize the database:
   ```bash
   python init_db.py
   ```

6. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend (React)

1. Install packages:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` in your browser to view the application.
