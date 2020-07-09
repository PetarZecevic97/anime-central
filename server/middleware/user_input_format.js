const userInputFormat = {

    //Checking if password is strong enough. Used in sign up and changing password
    checkIsPasswordEnough(req, res,  next) {

        if(req.body.password.length >= 6 && req.body.password.match(/[a-z]/) && req.body.password.match(/[A-Z]/) && req.body.password.match(/[0-9]/)) {
            next();
        } else {
            res.status(400).send("Password is not strong enough");
        }
    },

    //Checking if email format is good. Used for sign up and change email.
    checkEMailFormat(req, res, next){

        var EmailRegEx = /^([a-z]|[A-Z]|[0-9]|[.!^#&$%\/\\])+?[@]([a-z]|[A-Z])*?[.](.)+$/;
        
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
    }
}

module.exports = userInputFormat;