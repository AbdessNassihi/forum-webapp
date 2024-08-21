const USER_QUERY = {
    SELECT_USER: 'SELECT * FROM users WHERE iduser = ?',
    FIND_USER_AUTH: 'SELECT * FROM users where username = ?',
    FIND_USER: 'SELECT users.iduser, users.username, users.email, users.textuser, users.is_admin, (SELECT COUNT(*) FROM user_follows WHERE user_follows.idfollowing = users.iduser) AS num_followers, (SELECT COUNT(*) FROM user_follows WHERE user_follows.idfollower = users.iduser) AS num_followings, EXISTS (SELECT 1 FROM user_follows WHERE user_follows.idfollower = ? AND user_follows.idfollowing = users.iduser) AS is_following FROM users WHERE users.username = ?',
    NEW_USER: 'INSERT INTO users (email, username, password, is_admin, img_url, textuser) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE_USERNAME: 'UPDATE users SET username = ? WHERE iduser = ?',
    UPDATE_TEXTUSER: 'UPDATE users SET textuser = ? WHERE iduser = ?',
    UPDATE_PASSWORD: 'UPDATE users SET password = ? WHERE iduser = ?',
    UPDATE_IMAGE: 'UPDATE users SET img_url = ? WHERE iduser = ?',
    UPDATE_STATUS: 'UPDATE users SET is_admin = 1 WHERE iduser = ?',
    DELETE_USER: 'DELETE FROM users WHERE iduser = ?',
    FOLLOW_USER: 'INSERT INTO user_follows (idfollower, idfollowing) VALUES (?, ?)',
    UNFOLLOW_USER: 'DELETE FROM user_follows where idfollower = ? AND idfollowing = ?',
    SELECT_FOLLOWERS: 'SELECT * FROM users INNER JOIN user_follows ON users.iduser = user_follows.idfollower WHERE user_follows.idfollowing = ?',
    SELECT_FOLLOWING: 'SELECT * FROM users INNER JOIN user_follows ON users.iduser = user_follows.idfollowing WHERE user_follows.idfollower = ?',
    COUNT_FOLLOWERS: 'SELECT COUNT(*) AS count FROM user_follows WHERE idfollowing = ?',
    COUNT_FOLLOWINGS: 'SELECT COUNT(*) AS count FROM user_follows WHERE idfollower = ?',
    COUNT_USERS: 'SELECT COUNT(*) AS userCount FROM users'
};

const THREAD_QUERY = {
    SELECT_THREADS: 'SELECT threads.*, (SELECT COUNT(*) FROM posts WHERE posts.idthread = threads.idthread) AS num_posts, users.username AS thread_username, JSON_ARRAYAGG(subscribed_users.username) AS subscribed_usernames FROM threads JOIN users ON threads.iduser = users.iduser LEFT JOIN subscriptions ON threads.idthread = subscriptions.idthread LEFT JOIN users AS subscribed_users ON subscriptions.iduser = subscribed_users.iduser GROUP BY threads.idthread ORDER BY num_posts DESC',
    SELECT_THREAD: 'SELECT * FROM threads WHERE idthread = ?',
    SELECT_THREADS_OF_USER: 'SELECT * FROM threads WHERE iduser = ? ORDER BY idthread ASC',
    SELECT_FOLLOWED_THREADS: 'SELECT * FROM threads INNER JOIN subscriptions ON threads.idthread = subscriptions.idthread WHERE subscriptions.iduser = ?',
    SELECT_POSTS: 'SELECT posts.*, threads.title AS thread_title, thread_creator.username AS thread_username, users.username AS post_username, COUNT(DISTINCT post_likes.iduser) AS num_likes, COUNT(DISTINCT commentaries.idcom) AS num_commentaries FROM posts LEFT JOIN post_likes ON posts.idpost = post_likes.idpost LEFT JOIN commentaries ON posts.idpost = commentaries.idpost JOIN threads ON posts.idthread = threads.idthread JOIN users ON posts.iduser = users.iduser JOIN users AS thread_creator ON threads.iduser = thread_creator.iduser WHERE posts.idthread = ? GROUP BY posts.idpost ORDER BY posts.pinned DESC, num_likes DESC',
    NEW_THREAD: 'INSERT INTO threads (iduser, title, textthread) VALUES (?, ?, ?)',
    NEW_POST: 'INSERT INTO posts (idthread, iduser, content, title) VALUES (?, ?, ?, ?)',
    DELETE_THREAD: 'DELETE FROM threads WHERE idthread = ?',
    UPDATE_TITLE: 'UPDATE threads SET title = ? WHERE idthread = ?',
    SUBSCRIBE_TO_THREAD: 'INSERT INTO subscriptions (iduser, idthread) VALUES (?, ?)',
    UNSUBSCRIBE_TO_THREAD: 'DELETE FROM subscriptions WHERE iduser = ? AND idthread = ?'
};

const POST_QUERY = {
    SELECT_POST: 'SELECT posts.*, users.username AS post_username, threads.title AS thread_title, thread_creators.username AS thread_username, COUNT(DISTINCT post_likes.iduser) AS num_likes, COUNT(DISTINCT commentaries.idcom) AS num_commentaries FROM posts JOIN users ON posts.iduser = users.iduser JOIN threads ON posts.idthread = threads.idthread JOIN users AS thread_creators ON threads.iduser = thread_creators.iduser LEFT JOIN post_likes ON posts.idpost = post_likes.idpost LEFT JOIN commentaries ON posts.idpost = commentaries.idpost WHERE posts.idpost = ? GROUP BY posts.idpost, users.username, threads.title, thread_creators.username',
    SELECT_POSTS_OF_USER: 'SELECT posts.*, threads.title AS thread_title, (SELECT COUNT(*) FROM commentaries WHERE commentaries.idpost = posts.idpost) AS num_commentaries, (SELECT COUNT(*) FROM post_likes WHERE post_likes.idpost = posts.idpost) AS num_likes FROM posts JOIN threads ON posts.idthread = threads.idthread WHERE posts.iduser = ? ORDER BY posts.idpost DESC;',
    SELECT_POSTS_FOR_USER: 'SELECT posts.*, threads.title AS thread_title, users.username AS post_username, (SELECT COUNT(*) FROM commentaries WHERE commentaries.idpost = posts.idpost) AS num_commentaries, (SELECT COUNT(DISTINCT post_likes.iduser) FROM post_likes WHERE post_likes.idpost = posts.idpost) AS num_likes FROM posts JOIN threads ON posts.idthread = threads.idthread JOIN users ON posts.iduser = users.iduser JOIN subscriptions ON subscriptions.idthread = threads.idthread WHERE subscriptions.iduser = ? ORDER BY posts.idpost DESC',
    SELECT_POSTS_OF_USER_THREADS: 'SELECT posts.*, threads.title AS thread_title, users.username AS post_username, (SELECT COUNT(*) FROM commentaries WHERE commentaries.idpost = posts.idpost) AS num_commentaries, (SELECT COUNT(DISTINCT post_likes.iduser) FROM post_likes WHERE post_likes.idpost = posts.idpost) AS num_likes FROM posts JOIN threads ON posts.idthread = threads.idthread JOIN users ON posts.iduser = users.iduser WHERE threads.iduser = ? ORDER BY posts.idpost DESC',
    SELECT_POSTS_OF_FOLLOWINGS: 'SELECT posts.*, threads.title AS thread_title, users.username AS post_username, (SELECT COUNT(*) FROM commentaries WHERE commentaries.idpost = posts.idpost) AS num_commentaries, (SELECT COUNT(DISTINCT post_likes.iduser) FROM post_likes WHERE post_likes.idpost = posts.idpost) AS num_likes FROM posts JOIN threads ON posts.idthread = threads.idthread JOIN users ON posts.iduser = users.iduser JOIN user_follows ON user_follows.idfollowing = posts.iduser WHERE user_follows.idfollower = ? ORDER BY posts.idpost DESC',
    UPDATE_POST: 'UPDATE posts SET content = ? WHERE idpost = ?',
    UPDATE_PINNED: 'UPDATE posts SET pinned = ? WHERE idpost = ?',
    DELETE_POST: 'DELETE from POSTS WHERE idpost = ?',
    SELECT_COMMENTS: 'SELECT commentaries.*, users.username AS comment_username, COUNT(DISTINCT comments_likes.iduser) AS num_likes FROM commentaries JOIN users ON commentaries.iduser = users.iduser LEFT JOIN comments_likes ON commentaries.idcom = comments_likes.idcom WHERE commentaries.idpost = ? GROUP BY commentaries.idcom, users.username ORDER BY num_likes DESC',
    NEW_COMMENT: 'INSERT INTO commentaries (idpost, iduser, content) VALUES (?, ?, ?)',
    ADD_LIKE_POST: 'INSERT INTO post_likes (idpost, iduser) VALUES (?, ?)'
};

const COMMENT_QUERY = {

    SELECT_COMMENT: 'SELECT * FROM commentaries WHERE idcom = ?',
    DELETE_COMMENT: 'DELETE FROM commentaries WHERE idcom = ?',
    ADD_LIKE_COMMENT: 'INSERT INTO comments_likes (idcom, iduser) VALUES (?, ?)',
    UPDATE_PINNED: 'UPDATE commentaries SET pinned = ? WHERE idcom = ?',
}





module.exports = { USER_QUERY, THREAD_QUERY, POST_QUERY, COMMENT_QUERY };