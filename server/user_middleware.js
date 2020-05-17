const {client,  db, hashCode} = require('./global');
const queries = require('./queries');


const userMiddleware = {

    //TODO: Check if email is in correct format

    //Checking if username or password is empty. Used for both log in and sign up.
    isUserPassEmpty(req, res, next){
        if (!(req.body.username && req.body.password)){
            res.status(400).send("Username or password field is empty.");
        } else {
            next();
        }
    },

    //Checking if username exists. Used for both log in and sign up.
    checkUsername(req, res, next){

        let query = db.query(queries.selectUserWithUsername, [req.body.username], (err, results, fields) => {

            if (err) throw err;
            
            if (results.length == 0){
                req.usernameExists = false;
            } else {
                req.usernameExists = true;
            }
            next();
        });
    },

    //Checking if email exists in database. Used for sign up.
    checkEmail(req, res, next){

        if (req.body.email){

            let query = db.query(queries.selectUserWithEmail, [req.body.email], (err, results, fields) => {

                if (err) throw err;
                
                if (results.length == 0){
                    req.emailExists = false;
                } else {
                    req.emailExists = true;
                }
                next();
            });
        } else {
            
            res.status(400).send("Username or password field is empty.");
        }
        
    },

    //Checking if password is correct for given username. Used for log in.
    checkPassword(req, res, next){

        if(req.usernameExists) {
            let query = db.query(queries.selectUserWithUsernameAndPassword, [req.body.username, req.body.password], (err, results, fields) => {
                if (err) throw err;
        
                if (results.length == 0){
                    res.status(400).send(`Password for username ${req.body.username} is not correct.`);
                } else {
                    next();
                }
            });
        } else {
            res.status(400).send(`Username ${req.body.username} does not exist.`);
        }
    },

    // Creating user session. Used for both log in and sign up.
    saveSession(req, res, next) {
        const {username, password, email} = req.body;
        const loginInfo = username + ' ' + email + ' ' + password;
        const hashedUser = hashCode(loginInfo + Date.now()).toString();
        client.set(hashedUser, loginInfo, (err, reply) => {});
        client.expireat(hashedUser, parseInt((+new Date)/1000) + 86400);
        res.cookie('loggedInUser', hashedUser);
        res.redirect('/homepage');
    },

    //Checking if user is logged in
    isUserLoggedIn(req, res, next){
        const hashedCode = req.cookies.loggedInUser;
        if (hashedCode){
            client.get(hashedCode, function (error, result) {

                if (error) throw error;

                if(result === null) {
                    res.redirect('/login');
                } else {
                    const userInfo = result.split(' ');
                    req.user = {'username': userInfo[0], 'email': userInfo[1], 'password': userInfo[2]};
                    next();
                }

        });

        } else {
            res.redirect('/login');
        }
    }
}

module.exports = userMiddleware;