const {db,  express} = require('./global');
const queries = require('./queries');
const {isUserLoggedIn} = require('./user_middleware');

const app = express();


/*********************************************  OUTPUT NOT IMPLEMENTED DUE TO EMPTY DATABASE! TODO: IMPLEMENT!   *********************************************/

//Get all anime that user has rated
app.get('/myratedanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.selectAllRatedAnimeByUser(req.user.username), (err, result, fields) => {
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

//User is commenting on an anime with given name
app.post('/commentonthisanime', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.insertComment(req.user.username, req.body.animeName, req.body.comment), (err, result) => {
        if (err) throw err;
        res.send("Upit uspeo\n");
    });

});

module.exports = app;