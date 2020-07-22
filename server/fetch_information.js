const jikanjs  = require('jikanjs');
const mysql = require('mysql');
const queries = require('./queries/insert_queries');
const { insertAnime } = require('./queries/insert_queries');
const mysqlPromise = require('promise-mysql');

const KitsuAPIWrapper = require("./kitsu_wrapper");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })





async function insert(id){
    
    let animeResult;

    try{
        animeResult = await jikanjs.loadAnime(id);   
    }catch(err){
        console.log(err.message);
        return;
    }

    const db = await mysqlPromise.createConnection({

        host: "127.0.0.1",
        //user: "PetarZecevic",
        //password: "mi16169",
        user: "nikola",
        password: "bobi1234",
        database: "anime_central_db"
    });


    const transaction = await db.beginTransaction();

    let animeId;

    try{
        const insertedAnimeResult = await db.query(queries.insertAnime, [animeResult.title, animeResult.synopsis, animeResult.image_url, animeResult.aired.from]);        
        animeId = insertedAnimeResult.insertId;
    }catch(err){
        console.log(err.message);
        await db.rollback();
        return;       
    }    

    //inserting genres

    if(animeResult.genres.length == 0){
        animeResult.genres.push({name : "None"});
    }

    for(genre of animeResult.genres){

        let genreId;

        try{
            const insertGenreResult = await db.query(queries.insertGenre, [genre.name]);
            genreId = insertGenreResult.insertId;
        }catch(err){            
            if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                const selectExistingGenre = await db.query(queries.selectGenre, [genre.name]);
                genreId = selectExistingGenre[0].id;
            }else{
                console.log(err.message);
                await db.rollback();
                return;  
            }
        }


        try{
            await db.query(queries.insertAnimeGenre, [animeId, genreId]);
        }catch(err){
            console.log(err.message);
            await db.rollback();
            return; 
        }


    }

    //inserting studios

    if(animeResult.studios.length == 0){
        animeResult.studios.push({name : "None"});
    }

    for(studio of animeResult.studios){

        let studioId;

        try{
            const insertStudioResult = await db.query(queries.insertStudio, [studio.name]);
            studioId = insertStudioResult.insertId;
        }catch(err){            
            if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                const selectExistingStudio = await db.query(queries.selectStudio, [studio.name]);
                studioId = selectExistingStudio[0].id;
            }else{
                console.log(err.message);
                await db.rollback();
                return;  
            }
        }


        try{           
            await db.query(queries.insertAnimeStudio, [animeId, studioId]);
        }catch(err){
            console.log(err.message);
            await db.rollback();
            return; 
        }


    }

    //inserting producers
    if(animeResult.producers.length == 0){
        animeResult.producers.push({name : "None"});
    }

    for(producer of animeResult.producers){

        let producerId;

        try{
            const insertProducerResult = await db.query(queries.insertProducer, [producer.name]);
            producerId = insertProducerResult.insertId;
        }catch(err){            
            if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                const selectExistingProducer = await db.query(queries.selectProducer, [producer.name]);
                producerId = selectExistingProducer[0].id;
            }else{
                console.log(err.message);
                await db.rollback();
                return;  
            }
        }


        try{           
            await db.query(queries.insertAnimeProducer, [animeId, producerId]);
        }catch(err){
            console.log(err.message);
            await db.rollback();
            return; 
        }


    }

    //inserting licencors
    if(animeResult.licensors.length == 0){
        animeResult.licensors.push({name : "None"});
    }
    for(licencor of animeResult.licensors){

        let licencorId;

        try{
            const insertLicencorResult = await db.query(queries.insertLicencor, [licencor.name]);
            licencorId = insertLicencorResult.insertId;
        }catch(err){            
            if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                const selectExistingLicencor = await db.query(queries.selectLicencor, [licencor.name]);
                licencorId = selectExistingLicencor[0].id;
            }else{
                console.log(err.message);
                await db.rollback();
                return;  
            }
        }


        try{           
            await db.query(queries.insertAnimeLicencor, [animeId, licencorId]);
        }catch(err){
            console.log(err.message);
            await db.rollback();
            return; 
        }


    }

    await db.commit();

    console.log("Anime successfully inserted!");
}

function kitsuuu(){


    const api = new KitsuAPIWrapper();

    api.getAnime("brotherhood")
                .then(res => { 
                    //console.log(res[0].relationships.genres.links.related)
                    api.getGenres(res[0])
                })
                //.then(res => console.log(res))
                .catch(err => console.error(err));
    
    

}



readline.question(`Enter anime id:`, (id) => {
    
    //insert(Number(id));

    kitsuuu();

    /*
    jikanjs.loadAnime(19815).then((response) => {
        console.log(response);
    })
    */
})
