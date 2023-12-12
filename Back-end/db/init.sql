CREATE DATABASE IF NOT EXISTS forumdb;

USE forumdb;


CREATE TABLE IF NOT EXISTS users (
    iduser INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT NOT NULL,
    img_url VARCHAR(800) NOT NULL,
    textuser VARCHAR(800) NOT NULL,
    salt VARCHAR(800) NOT NULL,
    PRIMARY KEY (iduser),
    UNIQUE INDEX iduser_UNIQUE (iduser ASC) VISIBLE,
    UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
    UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE
);


CREATE TABLE IF NOT EXISTS threads (
    idthread INT NOT NULL AUTO_INCREMENT,
    iduser INT,
    title VARCHAR(255) NOT NULL,
    img_url VARCHAR(800),
    PRIMARY KEY (idthread),
    FOREIGN KEY (iduser) REFERENCES users(iduser),
    UNIQUE INDEX title_UNIQUE (title ASC) VISIBLE
);


CREATE TABLE IF NOT EXISTS posts (
    idpost INT NOT NULL AUTO_INCREMENT,
    idthread INT,
    iduser INT,
    content TEXT NOT NULL,
    score INT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pinned TINYINT,
    PRIMARY KEY (idpost),
    FOREIGN KEY (idthread) REFERENCES threads(idthread),
    FOREIGN KEY (iduser) REFERENCES users(iduser)
);

CREATE TABLE IF NOT EXISTS commentaries (
    idcom INT NOT NULL AUTO_INCREMENT,
    iduser INT,
    idpost INT,
    score INT,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idcom_com INT,
    PRIMARY KEY (idcom),
    FOREIGN KEY (iduser) REFERENCES users(iduser),
    FOREIGN KEY (idpost) REFERENCES posts(idpost),
    FOREIGN KEY (idcom_com) REFERENCES commentaries(idcom)
);

CREATE TABLE IF NOT EXISTS user_user (
    follower_id INT,
    following_id INT,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(iduser),
    FOREIGN KEY (following_id) REFERENCES users(iduser)
);

CREATE TABLE IF NOT EXISTS user_threads (
    user_id INT,
    thread_id INT,
    PRIMARY KEY (user_id, thread_id),
    FOREIGN KEY (user_id) REFERENCES users(iduser),
    FOREIGN KEY (thread_id) REFERENCES threads(idthread)
);

