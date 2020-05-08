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

//Creating account
app.post('/signup', userMiddleware.isUserPassEmpty, userMiddleware.checkUsername, checkIsPasswordEnough, (req, res, next) => {

    if (req.usernameExists){
        res.status(400).send("Username already exists");
    } else {
        const post = {username:req.body.username, password:req.body.password}
        let query = db.query(queries.insertUser, post, (err, result) => {
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
        res.clearCookie('loggedInUser');
        if (response === 1){
            res.send('uspeo');
        } else {
            res.send('nije uspeo');
        }
    })
});

//Changing password
app.post('/changepassword', userMiddleware.isUserLoggedIn, checkIsPasswordEnough, (req, res, next) => {

    let query = db.query(queries.updatePassword(req.user.username, req.user.password, req.body.password), (err, result) => {
        if (err) throw err;
        res.send("Upit uspeo\n");
    });

});

/* 
//TODO: Enable changing username by making an unique id in the table User
//Changing username
app.post('/changeusername', userMiddleware.isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.updateUsername(req.user.username, req.body.newUsername, req.user.password), (err, result) => {
        if (err) throw err;
        res.send("Upit uspeo\n");
    });

});
*/

module.exports = app;