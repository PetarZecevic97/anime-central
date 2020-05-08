const {client,  db, hashCode} = require('./global');
const queries = require('./queries');


const userMiddleware = {

    //Checking if username or password is empty
    isUserPassEmpty(req, res, next){
        if (!(req.body.username && req.body.password)){
        res.status(400).send("Username or password field is empty.");
        } else {
        next();
        }
    },

    //Checking if username exists
    checkUsername(req, res, next){

        let query = db.query(queries.selectUserWithUsername(req.body.username), (err, results, fields) => {

            if (err) throw err;
            
            if (results.length == 0){
            req.usernameExists = false;
            } else {
            req.usernameExists = true;
            }
            next();
        });
    },

    //Checking if password is correct for given username
    checkPassword(req, res, next){

        if(req.usernameExists) {
            let query = db.query(queries.selectUserWithUsernameAndPassword(req.body.username, req.body.password), (err, results, fields) => {
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

    // Creating user session
    saveSession(req, res, next) {
        const username = req.body.username;
        const password = req.body.password;
        const loginInfo = username + ' ' + password;
        const timestamp = Date.now();
        const hashedUser = hashCode(username + password + timestamp).toString();
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
                const usernameAndPassword = result.split(' ');
                req.user = {'username': usernameAndPassword[0], 'password': usernameAndPassword[1]};
                next();
            }

        });

        } else {
            res.redirect('/login');
        }
    }
}

module.exports = userMiddleware;