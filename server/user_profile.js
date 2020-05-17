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

const {client,  db,  express} = require('./global');
const queries = require('./queries');
const userMiddleware = require('./user_middleware');

const app = express();

//Creating account. req.body = {username: ..., password:..., email:...}
app.post('/signup', userMiddleware.isUserPassEmpty, userMiddleware.chechEMailFormat, userMiddleware.checkEmail, userMiddleware.checkUsername, userMiddleware.checkIsPasswordEnough, (req, res, next) => {

    if (req.usernameExists){
        res.status(400).send("Username already exists");
    } else if (req.emailExists){
        res.status(400).send("Email already exists");
    } else {
        const {username, password, email} = req.body;
        let query = db.query(queries.insertUser, [username, password, email], (err, result) => {
            if (err) throw err;
            next();
        });
    }

}, userMiddleware.saveSession);

//Logging into account. req.body = {username: ..., password:...}
app.post('/login', userMiddleware.isUserPassEmpty, userMiddleware.checkUsername, userMiddleware.checkPassword, userMiddleware.saveSession);

//Logging out
app.get('/logout', (req, res, next) => {
    const hashedCode = req.cookies.loggedInUser;
    client.del(hashedCode, (err, response) => {
        if (err) throw err;
        if (response === 1){
            res.send('uspeo');
        } else {
            res.send('nije uspeo');
        }

    });
});



/****************************************    NEXT THREE ROUTES NEED TO BE EXECUTED SEQUENTALLY!    ****************************************/

//Forgotten password. req.body = {username: ..., email:...}
app.post('/forgotpassword', userMiddleware.chechEMailFormat, userMiddleware.checkUsernameAndEmail, userMiddleware.recoveryCode);

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
app.post('/updatepassword', userMiddleware.checkIsPasswordEnough, userMiddleware.updatePassword, userMiddleware.saveSession);

/****************************************    ABOVE THREE ROUTES NEED TO BE EXECUTED SEQUENTALLY!    ****************************************/



//Changing password (when already logged in). req.body = {password:...}
app.post('/changepassword', userMiddleware.isUserLoggedIn, userMiddleware.checkIsPasswordEnough, userMiddleware.updatePassword, userMiddleware.updateSession);

//Changing E-mail adress. req.body = {email:...}
app.put('/changeemail', userMiddleware.isUserLoggedIn, userMiddleware.chechEMailFormat, (req, res, next) => {

    let query = db.query(queries.updateEmail, [req.body.email, req.body.currentUsername, req.body.currentPassword], (err, result) => {
        if(err) throw err;
        next();
    });

}, userMiddleware.updateSession);

//Changing username. req.body = {username:...}
app.post('/changeusername', userMiddleware.isUserLoggedIn, userMiddleware.checkUsername, (req, res, next) => {

    console.log(req.body.username);
    if(req.usernameExists) {
        if(req.body.currentUsername === req.body.username) {
            res.status(400).send("Username is the same")
        } else {
            res.status(400).send("Username already exists");
        }
    } else {

        let query = db.query(queries.updateUsername, [req.body.username, req.body.currentUsername, req.body.currentPassword], (err, result) => {
            if (err) throw err;
            next();
        });
    }

}, userMiddleware.updateSession);

module.exports = app;