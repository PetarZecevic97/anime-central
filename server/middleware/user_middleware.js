const {db} = require('../global');
const queries = require('../queries/login_queries');
const passwordHash = require('password-hash');

const userMiddleware = {

    insertUser(req, res, next) {
        if (req.usernameExists){
            res.userExists = true; //<<-- Dodato zarad lakse detekcije ovakve greske, autor: Nikola (to sam ja :DD)
            res.status(400).send("Username already exists");
        } else {
            const {username, password, email} = req.body;
            console.log(username);

            const hashedPassword = passwordHash.generate(password);
            
            db.query(queries.insertUser, [username, hashedPassword, email], (err, result) => {

                if (err) throw err;
                next();
            });
        }
    },

    updatePassword(req, res, next) {
        const hashedPassword = passwordHash.generate(req.body.password);
        db.query(queries.updatePassword, [hashedPassword, req.body.currentUsername, req.body.currentEmail], (err, result) => {
            if (err) throw err;
            next();
        });
    },

    updateUsername(req, res, next) {
        const hashedPassword = passwordHash.generate(req.body.currentPassword);
        db.query(queries.updateUsername, [req.body.username, req.body.currentUsername, hashedPassword], (err, result) => {
            if (err) throw err;
            next();
        });
    },

    updateEmail(req, res, next) {
        const hashedPassword = passwordHash.generate(req.body.currentPassword);
        db.query(queries.updateEmail, [req.body.email, req.body.currentUsername, hashedPassword], (err, result) => {
            if(err) throw err;
            next();
        });
    },
};

module.exports = userMiddleware;