const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const database = require('../db/dbconnection');
const QUERY = require('../db/query');





passport.use(new LocalStrategy(async (username, password, done) => {
    console.log(username);

    try {
        const [row] = await database.query(QUERY.FIND_ONE, username)
        if (!row[0]) { return done(null, false); }
        else {
            const isPasswordCorrect = bcrypt.compareSync(password, row[0].password)
            if (!isPasswordCorrect) { return done(null, false); }
            return done(null, row);
        }

    } catch (error) {
        return done(null, false);
    }
}));

module.exports = passport;
