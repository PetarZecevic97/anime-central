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

//User is adding anime to watched list
app.post('/addanimetowatchedlist', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.insertAnimeToWatchedList(req.user.username, req.body.animeName), (err, result) => {
        if(err){             
            if(err.code == 'ER_DUP_ENTRY'){
                res.status(400).send('Anime vec postoji u Watched listi!');
                return;
            }
            else throw err;
        };
        res.send('Anime dodat u Watched Listu!');
    });

});

//User is adding anime to wish list
app.post('/addanimetowishlist', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.insertAnimeToWishList(req.user.username, req.body.animeName), (err, result) => {
        if(err){             
            if(err.code == 'ER_DUP_ENTRY'){
                res.status(400).send('Anime vec postoji u Wish listi!');
                return;
            }
            else throw err;
        };
        res.send('Anime dodat u Wish Listu!');
    });

});

//User is removing anime from watched list
app.delete('/removeanimefromwatchedlist', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.removeAnimeFromWatchedList(req.user.username, req.body.animeName), (err, result) => {
        if(err) throw err;
        res.send('Anime uklonjen iz Watched Lise!');
    });

});

//User is removing anime from wish list
app.delete('/removeanimefromwishlist', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.removeAnimeFromWishList(req.user.username, req.body.animeName), (err, result) => {
        if(err) throw err;
        res.send('Anime uklonjen iz Wish Lise!');
    });

});

//Edit given comment on anime
app.put('/editcomment', isUserLoggedIn, (req, res, next) => {

    let query = db.query(queries.editComment(req.body.commentId, req.body.newComment), (err, result) => {
        if(err) throw err;
        res.send('Komentar promenjen!');
    });

});

//Change given score to anime
app.put('/updatescore', isUserLoggedIn, (req, res, next) => {
    
    let query = db.query(queries.updateAnimeScore(req.user.username, req.body.animeName, req.body.newScore), (err, result) => {
        if(err) throw err;
        res.send('Skor promenjen!');
    });

});


module.exports = app;