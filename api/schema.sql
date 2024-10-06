DROP TABLE IF EXISTS audiobooks;

CREATE TABLE audiobooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    author TEXT NOT NULL,
    cover_image TEXT,
    vote_count INTEGER DEFAULT 0
);

INSERT INTO audiobooks (title, description, author, cover_image) VALUES 
('The Great Gatsby', 'A classic novel about the American Dream', 'F. Scott Fitzgerald', 'https://i.imgur.com/jcoNT4k.png'),
('To Kill a Mockingbird', 'A powerful story of racial injustice', 'Harper Lee', 'https://i.imgur.com/EMFWAuR.png'),
('1984', 'A dystopian novel about totalitarian control', 'George Orwell', 'https://i.imgur.com/nkbaCWJ.png');

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE user_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    audiobook_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (audiobook_id) REFERENCES audiobooks (id),
    UNIQUE (user_id, audiobook_id)
);