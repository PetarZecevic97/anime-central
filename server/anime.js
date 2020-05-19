const {db,  express} = require('./global');
const queries = require('./queries/anime_queries.js');


//ruter sa korenom putanjom '/anime' koji ce se ukljuciti u glavni express fajl 
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

    let query = db.query(queries.selectAnimeWithName, [req.params.name, req.params.name, req.params.name, req.params.name, req.params.name], (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get all anime with specified genres: /anime/genre/:name1-name2-...-nameN
animeRouter.get('/genre/:name', (req, res, next) => {
    
    let genres = req.params.name.split('-');
    let query = db.query(queries.selectAllAnimeWithGenres(genres.length), genres, (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get all anime made by specified producers: /anime/producer/name1-name2-...-nameN
animeRouter.get('/producer/:name', (req, res, next) => {
    
    let producers = req.params.name.split('-');
    let query = db.query(queries.selectAllAnimeWithProducers(producers.length), producers, (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get all anime made by specified studios: /anime/studio/name1-name2-...-nameN
animeRouter.get('/studio/:name', (req, res, next) => {
    
    let studios = req.params.name.split('-');
    let query = db.query(queries.selectAllAnimeWithStudios(studios.length), studios, (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});

// Get all anime made by specified licencor: /anime/licencor/name1-name2-...-nameN
animeRouter.get('/licencor/:name', (req, res, next) => {
    
    let licencors = req.params.name.split('-');
    let query = db.query(queries.selectAllAnimeWithLicencors(licencors.length), licencors, (err, result, fields) => {
        if (err) throw err;
        res.send(result);
    });

});
  
//Get all anime which name starts with specified string
//TODO: Can % be put in anime_queries?
animeRouter.get('/selectallanimelike/:startswith', (req, res, next) => {
    let query = db.query(queries.selectAllAnimeLike, [req.params.startswith + '%'], (err, results, fields) => {
      if (err) throw err;
      res.send(results);
    })
  
});

//Get top n anime with best rating
animeRouter.get('/toplist/:n', (req, res, next) => {
    db.query(queries.selectNTopRatedAnime, [Number(req.params.n)], (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    })
});

//Get top n latest anime
animeRouter.get('/latestlist/:n', (req, res, next) => {
    db.query(queries.selectNLatestAnime, [Number(req.params.n)], (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    })
});

//Get top n most popular anime
animeRouter.get('/popularlist/:n', (req, res, next) => {
    db.query(queries.selectNMostPopularAnime, [Number(req.params.n)], (err, results, fields) => {
        if (err) throw err;
        res.send(results);
    })
});

module.exports = animeRouter;

