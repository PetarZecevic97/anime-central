const {db, express} = require('./global');
const queries = require('./queries/user_queries');
const {isUserLoggedIn} = require('./middleware/user_session');

const app = express();

//Get anime info for the user
//This route should be implicitly called after login and after all delete, post and put request route in this file
app.get('/useranimeinfo', isUserLoggedIn, (req, res, next) => {

    db.query(queries.selectAnimeInfoForUser, [req.body.currentUsername, req.body.currentUsername, req.body.currentUsername], (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//Get all anime that user has rated
app.get('/myratedanime', isUserLoggedIn, (req, res, next) => {

    db.query(queries.selectAllRatedAnimeByUser, [req.body.currentUsername], (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//Get all anime that user has put on the watch list
app.get('/mywishlistanime', isUserLoggedIn, (req, res, next) => {
	
    db.query(queries.selectAllWishedAnimeByUser, [req.body.currentUsername], (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//Get all anime that user has watched
app.get('/mywatchedanime', isUserLoggedIn, (req, res, next) => {

    db.query(queries.selectAllWatchedAnimeByUser, [req.body.currentUsername], (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

//User is rating anime with given anime name and given score. req.body= {animeName:..., score:....}
app.post('/ratethisanime', isUserLoggedIn, (req, res, next) => {

    db.query(queries.insertRating, [req.body.currentUsername, req.body.animeName, req.body.score], (err, result) => {
        if (err) throw err;
        res.send({ msg : "Upit uspeo\n" });
    });

});

//User is commenting on an anime with given name. req.body= {animeName:..., comment:....}
app.post('/commentonthisanime', isUserLoggedIn, (req, res, next) => {

    db.query(queries.insertComment, [req.body.currentUsername, req.body.animeName, req.body.comment], (err, result) => {
        if (err) throw err;
        res.send({ msg : "Upit uspeo\n"});
    });

});

//User is adding anime to watched list. req.body= {animeName:...}
app.post('/addanimetowatchedlist', isUserLoggedIn, (req, res, next) => {

	console.log(req.body.currentUsername, req.body.animeName);
    db.query(queries.insertAnimeToWatchedList, [req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err){             
            if(err.code == 'ER_DUP_ENTRY'){
                res.status(400).send({ msg : 'Anime vec postoji u Watched listi!'});
                return;
            }
            else throw err;
        };
		
        res.send({ msg : 'Anime dodat u Watched Listu!'});
    });

});

//User is adding anime to wish list. req.body= {animeName:...}
app.post('/addanimetowishlist', isUserLoggedIn, (req, res, next) => {

    db.query(queries.insertAnimeToWishList, [req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err){             
            if(err.code == 'ER_DUP_ENTRY'){
                res.status(400).send({ msg : 'Anime vec postoji u Wish listi!' });
                return;
            }
            else throw err;
        };
        res.send({ msg : 'Anime dodat u Wish Listu!' });
    });

});

//User is removing anime from watched list. req.body= {animeName:...}
app.delete('/removeanimefromwatchedlist', isUserLoggedIn, (req, res, next) => {

    db.query(queries.removeAnimeFromWatchedList, [req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err) throw err;
        res.send('Anime uklonjen iz Watched Lise!');
    });

});

//User is removing anime from wish list. req.body= {animeName:...}
app.delete('/removeanimefromwishlist', isUserLoggedIn, (req, res, next) => {

    db.query(queries.removeAnimeFromWishList, [req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err) throw err;
        res.send('Anime uklonjen iz Wish Lise!');
    });

});

//Edit given comment on anime. req.body= {newComment:..., commentId:...}
app.put('/editcomment', isUserLoggedIn, (req, res, next) => {

    db.query(queries.editComment, [req.body.newComment, req.body.commentId], (err, result) => {
        if(err) throw err;
        res.send('Komentar promenjen!');
    });

});

//Change given score to anime. req.body= {animeName:..., newScore:...}
app.put('/updatescore', isUserLoggedIn, (req, res, next) => {
    
    db.query(queries.updateAnimeScore, [req.body.newScore, req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err) throw err;
        res.send('Skor promenjen!');
    });

});

//Delete comment. req.body= {commentId:...}
app.delete('/deletecomment', isUserLoggedIn, (req, res, next) => {
    
    db.query(queries.deleteComment, [req.body.commentId], (err, result) => {
        if(err) throw err;
        res.send('Komentar je obrisan!');
    });

});

//Delete user score. req.body= {animeName:...}
app.delete('/deletescore', isUserLoggedIn, (req, res, next) => {
    
    db.query(queries.deleteAnimeScore, [req.body.currentUsername, req.body.animeName], (err, result) => {
        if(err) throw err;
        res.send('Ocena je obrisana!');
    });

});
module.exports = app;