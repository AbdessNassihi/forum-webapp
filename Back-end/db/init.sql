CREATE DATABASE IF NOT EXISTS forumdb;

USE forumdb;


CREATE TABLE IF NOT EXISTS users (
    iduser INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT  DEFAULT 0,
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
    follow_only TINYINT,
    PRIMARY KEY (idthread),
    UNIQUE INDEX title_UNIQUE (title ASC) VISIBLE,
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS posts (
    idpost INT NOT NULL AUTO_INCREMENT,
    idthread INT,
    iduser INT,
    content TEXT NOT NULL,
    score INT DEFAULT 0,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pinned TINYINT DEFAULT 0,
    PRIMARY KEY (idpost),
    FOREIGN KEY (idthread) REFERENCES threads(idthread) ON DELETE CASCADE,
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE
    
);

CREATE TABLE IF NOT EXISTS commentaries (
    idcom INT NOT NULL AUTO_INCREMENT,
    iduser INT,
    idpost INT,
    score INT,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idcom),
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE,
    FOREIGN KEY (idpost) REFERENCES posts(idpost) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sub_commentaries (
    idsubcom INT NOT NULL AUTO_INCREMENT,
    idcom INT,
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idsubcom),
    FOREIGN KEY (idcom) REFERENCES commentaries(idcom) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_follows (
    idfollower INT,
    idfollowing INT,
    PRIMARY KEY (idfollower, idfollowing),
    FOREIGN KEY (idfollower) REFERENCES users(iduser) ON DELETE CASCADE,
    FOREIGN KEY (idfollowing) REFERENCES users(iduser) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    iduser INT,
    idthread INT,
    PRIMARY KEY (iduser, idthread),
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE,
    FOREIGN KEY (idthread) REFERENCES threads(idthread) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(128) NOT NULL,
    expires INT(11) UNSIGNED NOT NULL,
    data TEXT,
    PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


