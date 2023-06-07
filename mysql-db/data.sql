CREATE DATABASE cesieats;
USE cesieats;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO users (username, password, email) VALUES ('admin', 'admin', 'test@test.com');
