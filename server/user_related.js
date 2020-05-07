const {client,  db,  express} = require('./global');
const queries = require('./queries');


const app = express();

//Checking if user is logged in
function isUserLoggedIn(req, res, next){
    const hashedCode = req.cookies.loggedInUser;
    if (hashedCode){
        client.get(hashedCode, function (error, result) {

        if (error) throw error;

        if(result === null) {

            console.log("Korisnik nije logovan\n");
            res.redirect('/login');
        } else {
            const usernameAndPassword = result.split(' ');
            req.user = {'username': usernameAndPassword[0], 'password': usernameAndPassword[1]};
            next();
        }

    });

    } else {
        console.log("Korisnik nije logovan\n");
        res.redirect('/login');
    }

}


/*********************************************  OUTPUT NOT IMPLEMENTED DUE TO EMPTY DATABASE! TODO: IMPLEMENT!   *********************************************/

//Get all anime that user has rated
app.get('/myratedanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.selectAllRatdeAnimeByUser(req.user.username), (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//Get all anime that user has put on the watch list
app.get('/mywishlistanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.selectAllWishedAnimeByUser(req.user.username), (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//Get all anime that user has watched
app.get('/mywatchedanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.selectAllWatchedAnimeByUser(req.user.username), (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});
/*********************************************  OUTPUT NOT IMPLEMENTED DUE TO EMPTY DATABASE! TODO: IMPLEMENT!   *********************************************/


//User is rating anime with given anime name and given score
app.post('/ratethisanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.insertRating(req.user.username, req.body.animeName, req.body.score), (err, result) => {
        if (err) throw err;
        res.send("Upit uspeo\n");
    });

});


module.exports = app;