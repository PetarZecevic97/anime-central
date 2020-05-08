const {hashCode} = require('./global');

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

    //Select info about anime with best ratings
    selectNTopRatedAnime (n) { 
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score 
                FROM Anime
                ORDER BY Anime.total_score
                LIMIT 10 ${n}`;
    },
    /**************************************     Queries for anime info for both logged and unlogged user    **************************************/



    /*************************************************     Queries needed for log in/sign up    *************************************************/
    selectUserWithUsername (username){
        return `SELECT * FROM User WHERE username = '${username}'`;
    },
    selectUserWithUsernameAndPassword (username, password){
        return `SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`;
    },
    insertUser : 'INSERT INTO User SET ?',

    updatePassword(username, oldPassword, newPassword) {
        return `UPDATE User SET password = '${newPassword}' WHERE username = '${username}' AND password = '${oldPassword}'`;
    },
    
    //TODO: Make an unique id for table User in order to enable a change of username
    //updateUsername(oldUsername,  newUsername, password) {
    //    return `UPDATE User SET username = '${newUsername}' WHERE username = '${oldUsername}' AND password = '${password}'`;
    //},
    /*************************************************     Queries needed for log in/sign up    *************************************************/



    /*********************************************     Queries for anime info for specific user    *********************************************/
    selectAllWatchedAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
        FROM Anime WHERE EXISTS (SELECT *
                                 FROM UserWatched
                                 WHERE UserWatched.anime_id = Anime.id
                                 AND UserWatched.user_username = '${username}')
        ORDER BY Anime.total_score DESC`;
    }, 
    selectAllWishedAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score
        FROM Anime WHERE EXISTS (SELECT *
                                 FROM UserWish
                                 WHERE UserWish.anime_id = Anime.id
                                 AND UserWish.user_username = '${username}')
        ORDER BY Anime.total_score DESC`;
    }, 
    selectAllRatdeAnimeByUser (username) {
        return `SELECT Anime.id, Anime.name, Anime.description, Anime.picture, Anime.date_aired, Anime.total_score, UserScore.score
        FROM Anime JOIN UserScore ON Anime.id = UserScore.anime_id
        WHERE UserScore.user_username = '${username}'
        ORDER BY Anime.total_score DESC`;
    }, 
    insertRating(username, animeName, score){
        return `INSERT INTO UserScore (user_username, anime_id, score)
                SELECT '${username}', id, ${score} FROM Anime where name = '${animeName}' LIMIT 1`;
    },

    //Moved the hashedCode func to global in order to use it both here for unique ids and in user. Should ids be auto-generated? 
    insertComment(username, animeName, comment){
        const id = hashCode(username + animeName + Date.now());
        return `INSERT INTO UserComment (id, user_username, anime_id, comment)
                SELECT ${id}, '${username}', id, '${comment}' FROM Anime where name = '${animeName}' LIMIT 1`;
    }
    /*********************************************     Queries for anime info for specific user    *********************************************/

};

module.exports = queries;