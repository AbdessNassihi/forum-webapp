const USER_QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY iduser ASC',
    SELECT_USER: 'SELECT * FROM users WHERE iduser = ?',
    NEW_USER: 'INSERT INTO users (username, email, password, is_admin, img_url, textuser, salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE users SET username = ?, email = ?, password = ?, img_url = ?, textuser = ?, salt = ? WHERE iduser = ?',
    DELETE_USER: 'DELETE FROM users WHERE iduser = ?',
    FIND_ONE: 'SELECT * FROM users WHERE username = ?',
    FIND_ONE_MAIL: 'SELECT * FROM users WHERE email = ?',

};

const THREAD_QUERY = {




}



module.exports = USER_QUERY;