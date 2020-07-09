const mailgun = require('mailgun-js')({apiKey: '136bacece10628e885b4ee39eddf5545-3e51f8d2-39464d1a', domain: 'sandboxd5f756e39d1d4c1eab8c239126ba1cc8.mailgun.org'});
const {client, hashCode} = require('../global');

const userSessions = {

     // Creating user session. Used for both log in, sign up and update password.
     saveSession(req, res, next) {
        const {username, password, email} = req.body;
        const loginInfo = username + ' ' + email + ' ' + password;
        const hashedUser = hashCode(loginInfo + Date.now()).toString();
        client.set(hashedUser, loginInfo, (err, reply) => {});
        client.expireat(hashedUser, parseInt((+new Date)/1000) + 86400);
        res.cookie('loggedInUser', hashedUser);
        res.send(true);
    },

    //Updating info in redis. Used in change password, change email and change username.
    updateSession(req, res, next) {
        
        const newUserInfo = req.body.username + ' ' + req.body.email + ' ' + req.body.password;
        client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
        res.send(true);
    },
    
    //Checking if user is logged in. Used in user_anime file and user_profile file (change username, change password, change email).
    isUserLoggedIn(req, res, next) {
		console.log(req.headers);
		console.log(req.cookies.loggedInUser);
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
            res.userLoggedIn = false;
            res.send(false);
        }
    },

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

        res.send(true);
    }
}

module.exports = userSessions;