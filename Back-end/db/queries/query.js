const USER_QUERY = {
    SELECT_USERS: 'SELECT * FROM users ORDER BY iduser ASC LIMIT 50',
    SELECT_USER: 'SELECT * FROM users WHERE id = ?',
    NEW_USER: 'INSERT INTO users (username, email, password, isadmin, img_url) VALUES (?, ?, ?, ?, ?)',
    UPDATE_USER: ''
};