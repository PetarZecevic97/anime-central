const mailgun = require('mailgun-js')({apiKey: '136bacece10628e885b4ee39eddf5545-3e51f8d2-39464d1a', domain: 'sandboxd5f756e39d1d4c1eab8c239126ba1cc8.mailgun.org'});
const {client, hashCode} = require('../global');
const nodemailer = require('nodemailer');
const sendmail = require('sendmail')({
    smtpPort: 2525, // Default: 25
    smtpHost : 'localhost'});

const userSessions = {

     // Creating user session. Used for both log in, sign up and update password.
     saveSession(req, res, next) {
        const {username, password, email} = req.body;
        const loginInfo = username + ' ' + email + ' ' + password;
        const hashedUser = hashCode(loginInfo + Date.now()).toString();
        client.set(hashedUser, loginInfo, (err, reply) => {});
        client.expireat(hashedUser, parseInt((+new Date)/1000) + 86400);
        res.cookie('loggedInUser', hashedUser);
        const result = {sessionSaved: true}
        res.send({"pericTrue": result, "cookieValue": hashedUser});
    },

    //Updating info in redis. Used in change password, change email and change username.
    updateSession(req, res, next) {
        
        const newUserInfo = req.body.username + ' ' + req.body.email + ' ' + req.body.password;
        client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
        const result = {sessionUpdated: true}
        res.send(result);
    },
    
    //Checking if user is logged in. Used in user_anime file and user_profile file (change username, change password, change email).
    isUserLoggedIn(req, res, next) {
        //console.log("Login cookie: ", req.headers);
		console.log(req.cookies.loggedInUser);
        const hashedCode = req.cookies.loggedInUser;
		
        if (hashedCode){
			
            client.get(hashedCode, function (error, result) {

                if (error) throw error;
				console.log(result)
                if(result === null) {
					const response = {
						isLoggedIn : false
					}
                    res.send(response);
					
					
                } else {
                    const userInfo = result.split(' ');
                    req.body.currentUsername = userInfo[0];
                    req.body.currentEmail = userInfo[1];
                    req.body.currentPassword = userInfo[2];
                    next();
                }

        });

        } else {
            //res.userLoggedIn = false;
			
            const result = {userLoggedIn: false}
            res.send(result);
        }
    },

    
     //Creating a recovery code for forgotten password, sending it to user's mail and saving it in redis. Used in forgot password.
     recoveryCode(req, res, next) {

        const key = `User '${req.body.username}' with email '${req.body.email}' forgot password`;
        const code = hashCode(key);
        client.set(key, code, (err, reply) => {});
        client.expireat(key, parseInt((+new Date)/1000) + 600);

        const data = {
            from: 'ruzic.aleksandra@gmail.com',
            to: req.body.email,
            subject: 'Recovery code for forgotten password',
            html: 'Mail of test sendmail ',
            text: `You seem to have forgotten your password. Here's your recovery code: ${code}. It will expire in ten minutes so hurry up!`
        };
 
        // sendmail(data, function(err, reply) {
        //     console.log(err && err.stack);
        //     console.dir(reply);
        // });

        // myCustomMethod = async function (ctx){
        //     let cmd = await ctx.sendCommand(
        //         'AUTH PLAIN ' +
        //             Buffer.from(
        //                 '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
        //                 'utf-8'
        //             ).toString('base64')
        //     );
    
        //     if(cmd.status < 200 || cmd.status >=300){
        //         throw new Error('Failed to authenticate user: ' + cmd.text);
        //     }
        // }


        // let transporter = nodemailer.createTransport({
        //     // pool : true,
        //     //  host: 'localhost',
        //     //   port: 4200,
        //       tls : { rejectUnauthorized: false },
        //     // secure: true,
        //      auth: {
        //     //      type: 'custom',
        //     //      method: 'MY-CUSTOM-METHOD', // forces Nodemailer to use your custom handler
        //           user: 'username',
        //           pass: 'verysecret'
        //       }
        //     // , customAuth: {
        //     //      'MY-CUSTOM-METHOD': myCustomMethod
        //     // }
        //     // sendmail: true,
        //     // newline: 'unix'
        // });

        // transporter.sendMail(data);
         mailgun.messages().send(data, function (error, body) {
             if (error) throw error;
           console.log(body);
         });

        const result = {codeRecovered : true}
        res.send(result);
    }
}

module.exports = userSessions;