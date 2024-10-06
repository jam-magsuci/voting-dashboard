DROP TABLE IF EXISTS items;

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

INSERT INTO items (name) VALUES ('Sample Item 1');
INSERT INTO items (name) VALUES ('Sample Item 2');