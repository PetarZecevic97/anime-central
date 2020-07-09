const {db} = require('../global');
const queries = require('../queries/login_queries');

const userMiddleware = {

    //Update password. Used in update password and change password.
    insertUser(req, res, next) {
        if (req.usernameExists){
            res.userExists = true; //<<-- Dodato zarad lakse detekcije ovakve greske, autor: Nikola (to sam ja :DD)
            res.status(400).send("Username already exists");
        } else {
            const {username, password, email} = req.body;
			console.log(username);
            db.query(queries.insertUser, [username, password, email], (err, result) => {

                if (err) throw err;
                next();
            });
        }
    },

    //Update password. Used in update password and change password.
    updatePassword(req, res, next) {
        db.query(queries.updatePassword, [req.body.password, req.body.currentUsername, req.body.currentEmail], (err, result) => {
            if (err) throw err;
            next();
        });
    },

    //Update password. Used in update password and change password.
    updateUsername(req, res, next) {
        db.query(queries.updateUsername, [req.body.username, req.body.currentUsername, req.body.currentPassword], (err, result) => {
            if (err) throw err;
            next();
        });
    },

    //Update password. Used in update password and change password.
    updateEmail(req, res, next) {
        db.query(queries.updateEmail, [req.body.email, req.body.currentUsername, req.body.currentPassword], (err, result) => {
            if(err) throw err;
            next();
        });
    },
};

module.exports = userMiddleware;