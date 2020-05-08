const {db,  express} = require('./global');
const queries = require('./queries');


//ruter sa korenom putanjom '/anime' koji ce se ukljuciti u glavni express fajl 
//TODO: napraviti glavnu Express aplikaciju i ukljuciti ovaj ruter
const animeRouter = express.Router();


// Get all anime:  /anime
animeRouter.get('/', (req, res, next) => {

    let query = db.query(queries.selectAllAnime, (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get anime with specified name:  /anime/:name  
animeRouter.get('/:name', (req, res, next) => {

    let query = db.query(queries.selectAnimeWithName(req.params.name), (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get all anime with specified genres: /anime/genre/:name
animeRouter.get('/genre/:name', (req, res, next) => {
    
    let genres = req.params.name.split('-');
    let query = db.query(queries.selectAllAnimeWithGenres(genres), (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});
  
animeRouter.get('/selectallanimelike/:startswith', (req, res, next) => {
    let query = db.query(queries.selectAllAnimeLike(req.params.startswith), (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
  
});


module.exports = animeRouter;

