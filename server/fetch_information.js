const jikanjs  = require('jikanjs');
const mysql = require('mysql');
const queries = require('./queries/insert_queries');
const { insertAnime } = require('./queries/insert_queries');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

const db = mysql.createConnection({

    host: "127.0.0.1",
    user: "PetarZecevic",
    password: "mi16169",
    //user: "nikola",
    //password: "bobi1234",
    database: "anime_central_db"
});

function insert(id) {
    jikanjs.loadAnime(id).then((response) => {

        db.query(queries.selectAnime, [response.title_english], (err, result) => {
            if (err) {
                throw err;
            }
            if (result.length > 0) {
                //return Promise.reject(new Error("Anime already exists!"));
                console.log("Anime already exists!")
            } else {
                insertA(response)
            }
        })
    })
    /*   }).then((response) => {
        db.query(queries.insertAnime, [response.title, response.synopsis, response.aired.from], (err, result) => {
            if (err) throw err;
        });
        return response;
    }).catch((error) => {
        console.log("d")
        console.error(error.message);
    });*/
}


function insertA(anime){
    db.query(queries.insertAnime, [anime.title_english, anime.synopsis, anime.image_url, anime.aired.from], (err, result) => {
        if (err) throw err;
        db.query(queries.selectAnime, [anime.title_english], (err, result) => {
            if (err) throw err;
            const anime_id = result[0].id
            console.log(anime_id)
            checkGenres(anime, anime_id)
        })
    });
    
}


function checkGenres(anime, anime_id){
    db.query(queries.selectAllGenres, (err, result) => {
        if (err) throw err;
        const currentGenres = result
        const currentGenreNames = result.map(genre => genre.name)
        const genres = anime.genres.map(genre => genre.name)
        for (genre of genres){
            const index = currentGenreNames.indexOf(genre.toLowerCase())
            if (index == -1){
                insertGenre(genre.toLowerCase(), anime_id)
            } else {
                const genre_id = currentGenres[index].id
                insertAnimeGenre(anime_id, genre_id)
            }
        }

    });
}


function insertGenre(genre, anime_id){
    console.log(genre)
    db.query(queries.insertGenre, [genre], (err, result) => {
        if (err) throw err;
        db.query(queries.SelectGenre, [genre], (err, result) => {
            if (err) throw err;
            insertAnimeGenre(anime_id, result[0].id)
        });
    });
}

function insertAnimeGenre(anime_id, genre_id){
    db.query(queries.insertAnimeGenre, [anime_id, genre_id], (err, result) => {
        if (err) throw err;
    });
}


readline.question(`Enter anime id:`, (id) => {
    insert(Number(id));
})
