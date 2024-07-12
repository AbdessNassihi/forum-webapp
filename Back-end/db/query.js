const USER_QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY iduser ASC',
    SELECT_USER: 'SELECT * FROM users WHERE iduser = ?',
    NEW_USER: 'INSERT INTO users (username, email, password, is_admin, img_url, textuser, salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    UPDATE_USERNAME: 'UPDATE users SET username = ? WHERE iduser = ?',
    UPDATE_TEXTUSER: 'UPDATE users SET textuser = ? WHERE iduser = ?',
    UPDATE_PASSWORD: 'UPDATE users SET password = ?, salt = ? WHERE iduser = ?',
    UPDATE_IMAGE: 'UPDATE users SET img_url = ? WHERE iduser = ?',
    DELETE_USER: 'DELETE FROM users WHERE iduser = ?',
    FIND_ONE: 'SELECT * FROM users WHERE username = ?',
    FIND_ONE_MAIL: 'SELECT * FROM users WHERE email = ?',
    FIND_FOLLOWING: 'SELECT * FROM users INNER JOIN user_user ON users.iduser = user_user.following_id WHERE user_user.follower_id = ?',
    FIND_FOLLOWERS: 'SELECT * FROM users INNER JOIN user_user ON users.iduser = user_user.follower_id WHERE user_user.following_id = ?',
    NEW_FOLLOW: 'INSERT INTO user_user (follower_id, following_id) VALUES (?, ?)'

};

const THREAD_QUERY = {
    SELECT_THREAD: 'SELECT * FROM threads WHERE idthread = ?',
    SELECT_THREADS: 'SELECT * FROM threads WHERE follow_only = 0 ORDER BY idthread ASC',
    SELECT_THREADS_OF_USER: 'SELECT * FROM threads WHERE iduser = ? ORDER BY idthread ASC',
    SELECT_FOLLOWING_THREADS: 'SELECT * FROM threads INNER JOIN user_threads ON threads.idthread = user_threads.thread_id WHERE user_threads.user_id = ?',
    NEW_THREAD: 'INSERT INTO threads (iduser, title, img_url, follow_only) VALUES (?, ?, ?, ?)',
    DELETE_THREAD: 'DELETE FROM threads WHERE idthread = ?',
    UPDATE_THREAD: 'UPDATE threads SET title = ?, img_url = ?, follow_only = ? WHERE idthread = ?',
    FIND_ONE: 'SELECT * FROM threads WHERE title = ?',
    NEW_FOLLOW: 'INSERT INTO user_threads (user_id, thread_id) VALUES (?, ?)'


};

const POST_QUERY = {
    SELECT_POSTS: 'SELECT * FROM posts INNER JOIN threads ON posts.idthread = threads.idthread WHERE threads.follow_only = 0 ORDER BY posts.score DESC',
    SELECT_POSTS_AUTH: 'SELECT * FROM posts INNER JOIN user_threads ON posts.idthread = user_threads.thread_id WHERE user_threads.user_id = ?',
    SELECT_POSTS_OF_THREAD: 'SELECT * FROM posts WHERE idthread = ? ORDER BY pinned, score DESC',
    SELECT_POSTS_OF_USER: 'SELECT * FROM posts WHERE iduser = ? ORDER BY pinned, score DESC',
    NEW_POST: 'INSERT INTO posts (idthread, iduser, content, score, time, pinned) VALUES (?, ?, ?, ?, ?, ?)',
    DELETE_POST: 'DELETE FROM posts WHERE idpost = ?',
    UPDATE_POST: 'UPDATE posts SET content = ? WHERE idpost = ?'
};

const COM_QUERY = {
    SELECT_COM: 'SELECT * FROM commentaries WHERE idpost = ? ORDER BY score DESC',
    DELETE_COM: 'DELETE FROM commentaries WHERE idcom = ?'
}





module.exports = { USER_QUERY, THREAD_QUERY, POST_QUERY, COM_QUERY };