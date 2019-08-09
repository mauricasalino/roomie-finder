DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR(50) NOT NULL,
    last VARCHAR(50) NOT NULL,
    email VARCHAR (50) UNIQUE,
    password TEXT NOT NULL,
    bio VARCHAR(500),
    imageurl TEXT,
    optional VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
    id SERIAL primary key,
    sender_id INT,
    receiver_id INT,
    accepted BOOLEAN DEFAULT false
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(1000),
    posted_date VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE private (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS wall;
CREATE TABLE wall(
id SERIAL PRIMARY KEY,
sender_id_wall INT REFERENCES users(id),
receiver_id_wall INT REFERENCES users(id),
wall VARCHAR(1000),
url VARCHAR(1000),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
