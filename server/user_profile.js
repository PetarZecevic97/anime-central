const {client,  db,  express} = require('./global');
const queries = require('./queries');
const userMiddleware = require('./user_middleware');

const app = express();

//Checking if password is strong enough. Used in sign up and when changing password. Should this be in the middleware file?
function checkIsPasswordEnough(req, res,  next) {

    if(req.body.password.length >= 6 && req.body.password.match(/[a-z]/) && req.body.password.match(/[A-Z]/) && req.body.password.match(/[0-9]/)) {
        next();
    } else {
        res.status(400).send("Password is not strong enough");
    }
}

//Checking if E-mail format is good. Should this be in the middleware file?
function chechEMailFormat(req, res, next){

    var EmailRegEx = /^([a-z]|[A-Z]|[0-9]|[.!^#&$%\/\\])+?[@]([a-z]|[A-Z])*?[.]([a-z]|[A-Z])+$/;
    
    if(EmailRegEx.test(req.body.email)){
        next();        
    }else{
        res.status(400).send("Bad E-mail format");
    }   
}

//Creating account
app.post('/signup', userMiddleware.isUserPassEmpty, userMiddleware.checkEmail, userMiddleware.checkUsername, checkIsPasswordEnough, (req, res, next) => {

    if (req.usernameExists){
        res.status(400).send("Username already exists");
    } else if (req.emailExists){
        res.status(400).send("Email already exists");
    } else {
        const {username, password, email} = req.body;
        let query = db.query(queries.insertUser(username, password, email), (err, result) => {
            if (err) throw err;
            next();
        });
    }

}, userMiddleware.saveSession);

//Logging into account
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

//Changing password
app.post('/changepassword', userMiddleware.isUserLoggedIn, checkIsPasswordEnough, (req, res, next) => {

    let query = db.query(queries.updatePassword(req.user.username, req.user.password, req.body.password), (err, result) => {
        if (err) throw err;
        const newUserInfo = req.user.username + ' ' + req.user.email + ' ' + req.body.password;
        client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
        res.send("Upit uspeo\n");
    });

});

//Changing E-mail adress
app.put('/changeemail', chechEMailFormat, userMiddleware.isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.updateEmail(req.user.username, req.user.password, req.body.email), (err, result) => {
        if(err) throw err;
        const newUserInfo = req.user.username + ' ' + req.body.email + ' ' + req.user.password;
        client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
        res.send('Upit uspeo! Email promenjen!\n');
    });

});


//TODO: What if use tries to change username into their own username? Currently it should say "Username already exists"
//Changing username
app.post('/changeusername', userMiddleware.isUserLoggedIn, userMiddleware.checkUsername, (req, res, next) => {

    if(req.usernameExists) {
        res.status(400).send("Username already exists");
    } else {

        let query = db.query(queries.updateUsername(req.user.username, req.body.username, req.user.password), (err, result) => {
            if (err) throw err;
            const newUserInfo = req.body.username + ' ' + req.user.email + ' ' + req.user.password;
            client.set(req.cookies.loggedInUser, newUserInfo, (err, reply) => {});
            res.send("Upit uspeo\n");
        });
    }

});

module.exports = app;