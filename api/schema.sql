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
('The Great Gatsby', 'A classic novel about the American Dream', 'F. Scott Fitzgerald', 'https://picsum.photos/200/300'),
('To Kill a Mockingbird', 'A powerful story of racial injustice', 'Harper Lee', 'https://picsum.photos/200/300'),
('1984', 'A dystopian novel about totalitarian control', 'George Orwell', 'https://picsum.photos/200/300');

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);