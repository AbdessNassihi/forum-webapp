const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const database = require('../db/dbconnection');
const QUERY = require('../db/query');


passport.serializeUser((user, done) => { done(null, user[0].iduser) });

passport.deserializeUser(async (id, done) => {
    try {
        const [row] = await database.query(QUERY.SELECT_USER, id);
        if (!row) { return done(null, false); }
        done(null, row);
    } catch {
        done(null, false);
    }
});


passport.use(new LocalStrategy(async (username, password, done) => {

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

