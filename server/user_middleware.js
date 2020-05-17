const {client,  db, hashCode} = require('./global');
const queries = require('./queries');
const mailgun = require('mailgun-js')({apiKey: '136bacece10628e885b4ee39eddf5545-3e51f8d2-39464d1a', domain: 'sandboxd5f756e39d1d4c1eab8c239126ba1cc8.mailgun.org'});



const userMiddleware = {

    /*************************************    INPUT VALIDATION UNRELATED TO DATABASE (format, blank fields, etc)    *************************************/

    //Checking if password is strong enough. Used in sign up and changing password
    checkIsPasswordEnough(req, res,  next) {

        if(req.body.password.length >= 6 && req.body.password.match(/[a-z]/) && req.body.password.match(/[A-Z]/) && req.body.password.match(/[0-9]/)) {
            next();
        } else {
            res.status(400).send("Password is not strong enough");
        }
    },

    //Checking if email format is good. Used for sign up and change email.
    chechEMailFormat(req, res, next){

        var EmailRegEx = /^([a-z]|[A-Z]|[0-9]|[.!^#&$%\/\\])+?[@]([a-z]|[A-Z])*?[.]([a-z]|[A-Z])+$/;
        
        if(EmailRegEx.test(req.body.email)){
            next();        
        } else{
            res.status(400).send("Bad E-mail format");
        }   
    },

    //Checking if username or password is empty. Used for log in and sign up.
    isUserPassEmpty(req, res, next){
        if (!(req.body.username && req.body.password)){
            res.status(400).send("Username or password field is empty.");
        } else {
            next();
        }
    },

    /**************************************    INPUT VALIDATION UNRELATED TO DATABASE (format, blank fields, etc)    *************************************/


    /**********************************************************    DATABASE INPUT VALIDATION    *********************************************************/

    //Checking if username exists in database. Used for both log in, sign up and change username.
    checkUsername(req, res, next){

        let query = db.query(queries.selectUserWithUsername, [req.body.username], (err, results, fields) => {

            if (err) throw err;
            
            if (results.length === 0){
                req.usernameExists = false;
            } else {
                req.usernameExists = true;
                console.log(results);
            }
            next();
        });
    },

    //Checking if email exists in database. Used for sign up and change email.
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
            
            res.status(400).send("Email field is empty.");
        }
        
    },

    //Checking if password is correct for given username. Used for log in and change password.
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

    //Checking if user with specified username and email exists in database. Used in forgotten password
    checkUsernameAndEmail(req, res, next){

        db.query(queries.selectUserWithUsernameAndEmail, [req.body.username, req.body.email], (err, result, fields) => {

            if (err) throw err;

            if (result.length == 0){
                res.status(400).send(`User with username ${req.body.username} and email ${req.body.email} does not exist.`);
            } else {
                next();
            }
        });
        
    },

    /**********************************************************    DATABASE INPUT VALIDATION    *********************************************************/



    /***************************************************************    REDIS RELATED    ***************************************************************/

    // Creating user session. Used for both log in, sign up and update password.
    saveSession(req, res, next) {
        const {username, password, email} = req.body;
        const loginInfo = username + ' ' + email + ' ' + password;
        const hashedUser = hashCode(loginInfo + Date.now()).toString();
        client.set(hashedUser, loginInfo, (err, reply) => {});
        client.expireat(hashedUser, parseInt((+new Date)/1000) + 86400);
        res.cookie('loggedInUser', hashedUser);
        res.redirect('/homepage');
    },

    //Updating info in redis. Used in change password, change email and change username.
    updateSession(req, res, next) {
        
        const newUserInfo = req.body.username + ' ' + req.body.email + ' ' + req.body.password;
        client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
        res.redirect('/homepage');
    },
    
    //Checking if user is logged in. Used in user_anime file and user_profile file (change username, change password, change email).
    isUserLoggedIn(req, res, next) {
        const hashedCode = req.cookies.loggedInUser;
        if (hashedCode){
            client.get(hashedCode, function (error, result) {

                if (error) throw error;

                if(result === null) {
                    res.redirect('/login');
                } else {
                    const userInfo = result.split(' ');
                    req.body.currentUsername = userInfo[0];
                    req.body.currentEmail = userInfo[1];
                    req.body.currentPassword = userInfo[2];
                    next();
                }

        });

        } else {
            res.redirect('/login');
        }
    },

    /***************************************************************    REDIS RELATED    ***************************************************************/



    //Creating a recovery code for forgotten password, sending it to user's mail and saving it in redis. Used in forgot password.
    recoveryCode(req, res, next) {

        const key = `User '${req.body.username}' with email '${req.body.email}' forgot password`;
        const code = hashCode(key);
        client.set(key, code, (err, reply) => {});
        client.expireat(key, parseInt((+new Date)/1000) + 600);

        const data = {
            from: 'AnimeCentral <ruzic.aleksandra@gmail.com>',
            to: req.body.email,
            subject: 'Recovery code for forgotten password',
            text: `You seem to have forgotten your password. Here's your recovery code: ${code}. It will expire in ten minutes so hurry up!`
        };
        mailgun.messages().send(data, function (error, body) {
            if (error) throw error;
          console.log(body);
        });

        res.redirect('/recoverycode');
    }, 

    //Update password. Used in update password and change password.
    updatePassword(req, res, next) {
        let query = db.query(queries.updatePassword, [req.body.password, req.body.currentUsername, req.body.currentEmail], (err, result) => {
            if (err) throw err;
            next();
        });
    }
}

module.exports = userMiddleware;