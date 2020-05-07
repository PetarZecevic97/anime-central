const {client,  db,  express} = require('./global');
const queries = require('./queries');


const app = express();

//function for hashing
const hashCode = function(s){
    return s.split("").reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }

/***************************MIDDLEWARE: LOGIN AND SIGNUP***************************/

//Checking if username or password is empty
function isUserPassEmpty(req, res, next){
    if (!(req.body.username && req.body.password)){
      res.status(400).send("Username or password field is empty.");
    } else {
      next();
    }
}

//Checking if username exists
function checkUsername(req, res, next){
let query = db.query(queries.selectUserWithUsername(req.body.username), (err, results, fields) => {
    if (err) throw err;
    if (results.length == 0){
    req.usernameExists = false;
    } else {
    req.usernameExists = true;
    }
    next();
})
}

//Checking if password is correct for given username
function checkPassword(req, res, next){
let query = db.query(queries.selectUserWithUsernameAndPassword(req.body.username, req.body.password), (err, results, fields) => {
    if (err) throw err;
    if (results.length == 0){
    res.status(400).send("Username or password is not correct.");
    } else {
    next();
    }
})
}

// Creating user session
function saveSession(req, res, next) {
    const username = req.body.username;
    const password = req.body.username;
    const timestamp = Date.now();
    const hashedUser = hashCode(username + password + timestamp).toString();
    client.set(hashedUser, username, (err, reply) => {});
    client.expireat(hashedUser, parseInt((+new Date)/1000) + 86400);
    res.cookie('loggedInUser', hashedUser);
    res.redirect('/homepage');
};


//Creating account
app.post('/signup', isUserPassEmpty, checkUsername, (req, res, next) => {

    if (req.usernameExists){
        res.status(400).send("Username already exists");
    } else {
        const post = {username:req.body.username, password:req.body.password}
        let query = db.query(queries.insertUser, post, (err, result) => {
        if (err) throw err;
        next();
        });
    }

}, saveSession);

//Logging into account
app.post('/login', isUserPassEmpty, checkUsername, checkPassword, saveSession);

//Logging out
app.get('/logout', (req, res, next) => {
    const hashedCode = req.cookies.loggedInUser;
    console.log(req.cookies);
    client.del(hashedCode, (err, response) => {
        res.clearCookie('loggedInUser');
        if (response === 1){
            res.send('uspeo');
        } else {
            res.send('nije uspeo');
        }
    })
})

/***************************MIDDLEWARE: LOGIN AND SIGNUP***************************/

module.exports = app;