const mysqlPromise = require('promise-mysql');

const queries = require('./queries/insert_queries');

const insertAnime = {

    beginConnection : async function(){
        db = await mysqlPromise.createConnection({
    
            host: "127.0.0.1",
            user: "PetarZecevic",
            password: "mi16169",
            //user: "nikola",
            //password: "bobi1234",
            database: "anime_central_db"
        });
    },

    insert : async function(anime) {
    
        console.log("Inserting anime...")  
        const transaction = await db.beginTransaction();
        let animeId;
        try{
            const insertedAnimeResult = await db.query(queries.insertAnime, [anime.title, anime.synopsis, anime.image_url, anime.airedFrom]);        
            animeId = insertedAnimeResult.insertId;
        }catch(err){
            if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                console.log("Anime already exists in the database. Please try again...")
                await db.rollback();
                return; 
            }else{
                console.log(err.message);
                await db.rollback();
                return;  
            }      
        }    
    
        //inserting genres
        if(anime.genres.length == 0){
            anime.genres.push("None");
        }
    
        for(genre of anime.genres){
    
            let genreId;
    
            try{
                const insertGenreResult = await db.query(queries.insertGenre, [genre]);
                genreId = insertGenreResult.insertId;
            }catch(err){            
                if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                    const selectExistingGenre = await db.query(queries.selectGenre, [genre]);
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
        if(anime.studios.length == 0){
            anime.studios.push("None");
        }   
        for(studio of anime.studios){ 
            let studioId; 
            try{
                const insertStudioResult = await db.query(queries.insertStudio, [studio]);
                studioId = insertStudioResult.insertId;
            }catch(err){            
                if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                    const selectExistingStudio = await db.query(queries.selectStudio, [studio]);
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
        if(anime.producers.length == 0){
            anime.producers.push("None");
        }   
        for(producer of anime.producers){    
            let producerId;   
            try{
                const insertProducerResult = await db.query(queries.insertProducer, [producer]);
                producerId = insertProducerResult.insertId;
            }catch(err){            
                if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                    const selectExistingProducer = await db.query(queries.selectProducer, [producer]);
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
        if(anime.licencors.length == 0){
            anime.licencors.push("None");
        }
        for(licencor of anime.licencors){   
            let licencorId;   
            try{
                const insertLicencorResult = await db.query(queries.insertLicencor, [licencor]);
                licencorId = insertLicencorResult.insertId;
            }catch(err){            
                if(err.code == "ER_DUP_UNIQUE" || err.code == "ER_DUP_ENTRY"){
                    const selectExistingLicencor = await db.query(queries.selectLicencor, [licencor]);
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
        return Promise.resolve(true)
    }
}

module.exports = insertAnime