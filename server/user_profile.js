/// Routes for:
//      1. sign up
//      2. log in
//      3. log out
//      4. forgot password
//      5. recovery password
//      6. update password
//      7. change password
//      8. change email
//      9. change username

const {client, express} = require('./global');
const userSession = require('./middleware/user_session');
const userInputFormatValidation = require('./middleware/user_input_format');
const userInputDatabaseValidation = require('./middleware/user_input_database_validation')
const userMiddleware = require('./middleware/user_middleware');

const app = express();

//Creating account. req.body = {username: ..., password:..., email:...}
app.post('/signup', userInputFormatValidation.isUserPassEmpty, userInputFormatValidation.checkEMailFormat, userInputDatabaseValidation.checkEmail,
                    userInputDatabaseValidation.checkUsername, userInputFormatValidation.checkIsPasswordEnough, userMiddleware.insertUser, 
                    (req, res, next) => { res.send({ insertUser : true })} );

//Logging into account. req.body = {username: ..., password:...}
app.post('/login', userInputFormatValidation.isUserPassEmpty, userInputDatabaseValidation.checkUsername, userInputDatabaseValidation.checkPassword, userSession.saveSession);

//Logging out
app.get('/logout', (req, res, next) => {
    const hashedCode = req.cookies.loggedInUser;
    client.del(hashedCode, (err, response) => {
        if (err) throw err;
        if (response === 1){
            const response = {loggedOut : true}
            res.send(response);
        } else {
            //res.sessionExpired = true
            const response = {loggedOut : false, sessionExpired : true}
            res.send(response);
        }

    });
});

/****************************************    NEXT THREE ROUTES NEED TO BE EXECUTED SEQUENTALLY!    ****************************************/

//Forgotten password. req.body = {username: ..., email:...}
app.post('/forgotpassword', userInputFormatValidation.checkEMailFormat, userInputDatabaseValidation.checkUsernameAndEmail, userSession.recoveryCode);

//Recovery code for forgotten password. req.body = {username: ..., email:..., recoveryCode:...}
app.post('/recoverypassword', (req, res, next) => {

    const code = client.get(`User '${req.body.username}' with email '${req.body.email}' forgot password`, (err, result) => {
        if (err) throw err;
        if(result === req.body.recoveryCode) {
                
            res.redirect('/updatepassword');
        } else if (result === null) {
            res.send(`Redis nije uspeo da nadje kod '${result}'`);
        } else {
            res.status(400).send('Pogresan kod!')
        }
    });
});

//Changing password after recovery (when logged out). req.body = {username: ..., password:..., email:...}
app.put('/updatepassword', userInputFormatValidation.checkIsPasswordEnough, userMiddleware.updatePassword, userSession.saveSession);

/****************************************    ABOVE THREE ROUTES NEED TO BE EXECUTED SEQUENTALLY!    ****************************************/



//Changing password (when already logged in). req.body = {password:...}
app.put('/changepassword', userSession.isUserLoggedIn, userInputFormatValidation.checkIsPasswordEnough, userMiddleware.updatePassword, userSession.updateSession);

//Changing E-mail adress. req.body = {email:...}
app.put('/changeemail', userSession.isUserLoggedIn, userInputFormatValidation.checkEMailFormat, userInputDatabaseValidation.checkEmail, userMiddleware.updateEmail, userSession.updateSession);

//Changing username. req.body = {username:...}
app.put('/changeusername', userSession.isUserLoggedIn, userInputDatabaseValidation.checkUsername, (req, res, next) => {


    console.log(req.body.username);
    if(req.usernameExists) {
        if(req.body.currentUsername === req.body.username) {
            res.status(400).send("Username is the same")
        } else {
            res.status(400).send("Username already exists");
        }
    } else {
        next();
    }

}, userMiddleware.updateUsername, userSession.updateSession);

module.exports = app;