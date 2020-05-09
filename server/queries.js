const queries = {

    /**************************************     Queries for anime info for both logged and unlogged user    **************************************/
    //TODO: Consider that the user wants to know which anime he rated

    //Select info about anime with name that contains provided string
    selectAllAnimeLike (startsWith) {
        return `SELECT * FROM Anime WHERE name LIKE '${startsWith}%'`;
    },
    //Select info about all anime
    selectAllAnime : "SELECT * FROM Anime",

    //Select info about anime with given name
    selectAnimeWithName (name) {
        return  `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, 
        GROUP_CONCAT(Genre.name SEPARATOR ', ') AS 'Genres', GROUP_CONCAT(Studio.name SEPARATOR ', ') AS 'Studios', 
        GROUP_CONCAT(Producer.name SEPARATOR ', ') AS 'Producers', GROUP_CONCAT(Licencor.name SEPARATOR ', ') AS 'Licencors', 
        GROUP_CONCAT(UserComment.comment SEPARATOR '\\n') AS 'Comments'
        FROM Anime JOIN AnimeGenre ON Anime.id = AnimeGenre.anime_id JOIN Genre ON AnimeGenre.genre_id = Genre.id 
        JOIN AnimeStudio ON Anime.id = AnimeStudio.anime_id JOIN Studio ON AnimeStudio.studio_id = Studio.id 
        JOIN AnimeProducer ON Anime.id = AnimeProducer.anime_id JOIN Producer ON AnimeProducer.producer_id = Producer.id 
        JOIN AnimeLicencor ON Anime.id = AnimeLicencor.anime_id JOIN Licencor ON AnimeLicencor.licencor_id = Licencor.id 
        JOIN UserComment ON Anime.id = UserComment.anime_id
        WHERE Anime.name = '${name}' 
        GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score`;
    },

    //Select info about anime with some/all of genres
    selectAllAnimeWithGenres (genres) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeGenre ON Anime.id = AnimeGenre.anime_id 
                        JOIN Genre ON AnimeGenre.genre_id = Genre.id
                        WHERE Genre.name = '${genres[0]}'`;
        for (let i = 0; i < genres.length; i++){
            sql += ` OR Genre.name = '${genres[i]}'`;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all producers
    selectAllAnimeWithProducers (producers) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeProducer ON Anime.id = AnimeProducer.anime_id 
                        JOIN Producer ON AnimeProducer.producer_id = Producer.id
                        WHERE Producer.name = '${producers[0]}'`;
        for (let i = 0; i < producers.length; i++){
            sql += ` OR Producer.name = '${producers[i]}'`;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all studios
    selectAllAnimeWithStudios (studios) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeStudio ON Anime.id = AnimeStudio.anime_id 
                        JOIN Studio ON AnimeStudio.studio_id = Studio.id
                        WHERE Studio.name = '${studios[0]}'`;
        for (let i = 0; i < studios.length; i++){
            sql += ` OR Studio.name = '${studios[i]}'`;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all licencors
    selectAllAnimeWithLicencors (licencors) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeLicencor ON Anime.id = AnimeLicencor.anime_id 
                        JOIN Licencor ON AnimeLicencor.licencor_id = Licencor.id
                        WHERE Licencor.name = '${licencors[0]}'`;
        for (let i = 0; i < licencors.length; i++){
            sql += ` OR Licencor.name = '${licencors[i]}'`;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime with best ratings
    selectNTopRatedAnime (n) { 
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score 
                FROM Anime
                ORDER BY Anime.total_score
                LIMIT ${n}`;
    },
    /**************************************     Queries for anime info for both logged and unlogged user    **************************************/



    /*************************************************     Queries needed for log in/sign up    *************************************************/
    selectUserWithUsername (username){
        return `SELECT * FROM User WHERE username = '${username}'`;
    },
    selectUserWithEmail (email){
        return `SELECT * FROM User WHERE email = '${email}'`;
    },
    selectUserWithUsernameAndPassword (username, password){
        return `SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`;
    },

    insertUser(username, password, email){
        return `INSERT INTO User (username, password, email) VALUES('${username}', '${password}', '${email}')`;
    },

    updatePassword(username, oldPassword, newPassword) {
        return `UPDATE User SET password = '${newPassword}' WHERE username = '${username}' AND password = '${oldPassword}'`;
    },
    
    updateUsername(oldUsername,  newUsername, password) {
        return `UPDATE User SET username = '${newUsername}' WHERE username = '${oldUsername}' AND password = '${password}'`;
    },
    /*************************************************     Queries needed for log in/sign up    *************************************************/



    /*********************************************     Queries for anime info for specific user    *********************************************/
    selectAllWatchedAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
        FROM Anime WHERE EXISTS (SELECT *
                                 FROM UserWatched JOIN User ON User.id = UserWatched.user_id
                                 WHERE UserWatched.anime_id = Anime.id
                                 AND User.username = '${username}')
        ORDER BY Anime.total_score DESC`;
    }, 
    selectAllWishedAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
        FROM Anime WHERE EXISTS (SELECT *
                                 FROM UserWish JOIN User ON User.id = UserWish.user_id
                                 WHERE UserWish.anime_id = Anime.id
                                 AND User.username = '${username}')
        ORDER BY Anime.total_score DESC`;
    }, 
    selectAllRatedAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, UserScore.score
        FROM Anime JOIN UserScore ON Anime.id = UserScore.anime_id
        JOIN User ON User.id = UserScore.user_id
        WHERE User.username = '${username}'
        ORDER BY Anime.total_score DESC`;
    }, 
    insertRating(username, animeName, score){
        return `INSERT INTO UserScore (user_id, anime_id, score) VALUES 
        ((SELECT id FROM User WHERE username = '${username}' LIMIT 1), (SELECT id FROM Anime where name = '${animeName}' LIMIT 1), ${score})`;
    },

    insertComment(username, animeName, comment){
        return `INSERT INTO UserComment (user_id, anime_id, comment) VALUES 
        ((SELECT id FROM User WHERE username = '${username}' LIMIT 1), (SELECT id FROM Anime where name = '${animeName}' LIMIT 1), '${comment}')`;
    }
    /*********************************************     Queries for anime info for specific user    *********************************************/

};

module.exports = queries;