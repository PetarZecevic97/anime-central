const {db} = require('../global');
const queries = require('../queries/login_queries');

const userInputDatabaseValidation = {
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
                    next();
                } else {
                    res.status(400).send("Email already exists.");
                }
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
        
    }
}

module.exports = userInputDatabaseValidation;