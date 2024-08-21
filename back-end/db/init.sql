CREATE DATABASE IF NOT EXISTS forumdb;

USE forumdb;

CREATE TABLE IF NOT EXISTS users (
    iduser INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT DEFAULT 0, 
    img_url VARCHAR(800) NOT NULL,
    textuser VARCHAR(800) NOT NULL,
    PRIMARY KEY (iduser),
    UNIQUE INDEX username_UNIQUE (username ASC),
    UNIQUE INDEX email_UNIQUE (email ASC)
);


CREATE TABLE IF NOT EXISTS threads (
    idthread INT NOT NULL AUTO_INCREMENT,
    iduser INT,
    title VARCHAR(255) NOT NULL,
    textthread VARCHAR(800) NOT NULL,
    PRIMARY KEY (idthread),
    UNIQUE INDEX title_UNIQUE (title ASC) VISIBLE,
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS posts (
    idpost INT NOT NULL AUTO_INCREMENT,
    idthread INT,
    iduser INT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
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
    content TEXT NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idcom),
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE,
    FOREIGN KEY (idpost) REFERENCES posts(idpost) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_likes (
    iduser INT,
    idpost INT,
    PRIMARY KEY (iduser, idpost),
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE,
    FOREIGN KEY (idpost) REFERENCES posts(idpost) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments_likes (
    iduser INT,
    idcom INT,
    PRIMARY KEY (iduser, idcom),
    FOREIGN KEY (iduser) REFERENCES users(iduser) ON DELETE CASCADE,
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


