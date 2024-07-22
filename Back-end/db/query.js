const USER_QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY iduser ASC',
    SELECT_USER: 'SELECT * FROM users WHERE iduser = ?',
    NEW_USER: 'INSERT INTO users (username, email, password, is_admin, img_url, textuser, salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    UPDATE_USERNAME: 'UPDATE users SET username = ? WHERE iduser = ?',
    UPDATE_TEXTUSER: 'UPDATE users SET textuser = ? WHERE iduser = ?',
    UPDATE_PASSWORD: 'UPDATE users SET password = ?, salt = ? WHERE iduser = ?',
    UPDATE_IMAGE: 'UPDATE users SET img_url = ? WHERE iduser = ?',
    DELETE_USER: 'DELETE FROM users WHERE iduser = ?',
    FOLLOW_USER: 'INSERT INTO user_follows (idfollower, idfollowing) VALUES (?, ?)',
    UNFOLLOW_USER: 'DELETE FROM user_follows where idfollower = ? AND idfollowing = ?',
    SELECT_FOLLOWERS: 'SELECT * FROM users INNER JOIN user_follows ON users.iduser = user_follows.idfollower WHERE user_follows.idfollowing = ?',
    SELECT_FOLLOWING: 'SELECT * FROM users INNER JOIN user_follows ON users.iduser = user_follows.idfollowing WHERE user_follows.idfollower = ?'
};

const THREAD_QUERY = {
    SELECT_ALL_THREADS: 'SELECT * FROM threads ORDER BY idthread ASC',
    SELECT_THREADS: 'SELECT * FROM threads WHERE follow_only = 0 ORDER BY idthread ASC',
    SELECT_THREAD: 'SELECT * FROM threads WHERE idthread = ?',
    SELECT_THREADS_OF_USER: 'SELECT * FROM threads WHERE iduser = ? ORDER BY idthread ASC',
    SELECT_POSTS: 'SELECT * FROM posts WHERE idthread = ? ORDER BY pinned DESC, score DESC',
    NEW_THREAD: 'INSERT INTO threads (iduser, title, img_url, follow_only) VALUES (?, ?, ?, ?)',
    NEW_POST: 'INSERT INTO posts (idthread, iduser, content) VALUES (?, ?, ?)',
    DELETE_THREAD: 'DELETE FROM threads WHERE idthread = ?',
    UPDATE_TITLE: 'UPDATE threads SET title = ? WHERE idthread = ?',
    UPDATE_FOLLOWONLY: 'UPDATE threads SET follow_only = ? WHERE idthread = ?',
    UPDATE_IMAGE: 'UPDATE threads SET img_url = ? WHERE idthread = ?',
    SUBSCRIBE_TO_THREAD: 'INSERT INTO subscriptions (iduser, idthread) VALUES (?, ?)',
    UNSUBSCRIBE_TO_THREAD: 'DELETE FROM subscriptions WHERE iduser = ? AND idthread = ?'
};

const POST_QUERY = {
    SELECT_POST: 'SELECT * FROM posts WHERE idpost = ?',
    UPDATE_POST: 'UPDATE posts SET content = ? WHERE idpost = ?',
    UPDATE_SCORE: 'UPDATE posts SET score = ? WHERE idpost = ?',
    UPDATE_PINNED: 'UPDATE posts SET pinned = ? WHERE idpost = ?',
    DELETE_POST: 'DELETE from POSTS WHERE idpost = ?',
    SELECT_COMMENTS: 'SELECT * FROM commentaries WHERE idpost = ? ORDER BY idcom DESC',
    NEW_COMMENT: 'INSERT INTO commentaries (idpost, iduser, content) VALUES (?, ?, ?)'
};

const COMMENT_QUERY = {
    SELECT_COMMENT: 'SELECT * FROM commentaries WHERE idcom = ?',
    DELETE_COMMENT: 'DELETE FROM commentaries WHERE idcom = ?',
    SELECT_SUBCOMMENTS: 'SELECT * FROM sub_commentaries WHERE idcom = ?',
    SELECT_SUBCOMMENT: 'SELECT * FROM sub_commentaries WHERE idsubcom = ?'
}





module.exports = { USER_QUERY, THREAD_QUERY, POST_QUERY, COMMENT_QUERY };