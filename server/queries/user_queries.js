const userQueries = {

    /*********************************************     Queries for anime info for specific user    *********************************************/
    selectAnimeInfoForUser: `SELECT UserWatched.anime_id, -1 AS 'Type or score'
                            FROM UserWatched WHERE EXISTS (SELECT * FROM User WHERE User.username = ? AND UserWatched.user_id = User.id)
                            UNION
                            SELECT UserWish.anime_id, -2 AS 'Type or score'
                            FROM UserWish WHERE  EXISTS (SELECT * FROM User WHERE User.username = ? AND UserWish.user_id = User.id)
                            UNION
                            SELECT UserScore.anime_id, UserScore.score AS 'Type or score'
                            FROM UserScore WHERE  EXISTS (SELECT * FROM User WHERE User.username = ? AND UserScore.user_id = User.id)`,
    selectAllWatchedAnimeByUser : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score
        FROM Anime 
        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
        WHERE EXISTS (SELECT *
                                 FROM UserWatched JOIN User ON User.id = UserWatched.user_id
                                 WHERE UserWatched.anime_id = Anime.id
                                 AND User.username = ?)
        ORDER BY AnimeTotalScore.total_score DESC`, 

    selectAllWishedAnimeByUser : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score
        FROM Anime 
        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
        WHERE EXISTS (SELECT *
                                 FROM UserWish JOIN User ON User.id = UserWish.user_id
                                 WHERE UserWish.anime_id = Anime.id
                                 AND User.username = ?)
        ORDER BY AnimeTotalScore.total_score DESC`, 

    selectAllRatedAnimeByUser : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, UserScore.score
        FROM Anime JOIN UserScore ON Anime.id = UserScore.anime_id
        JOIN User ON User.id = UserScore.user_id
        JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
        WHERE User.username = ?
        ORDER BY AnimeTotalScore.total_score DESC`, 

    insertRating : `INSERT INTO UserScore (user_id, anime_id, score) VALUES 
        ((SELECT id FROM User WHERE username = ? LIMIT 1), (SELECT id FROM Anime where name = ? LIMIT 1), ?)`,

    insertComment : `INSERT INTO UserComment (user_id, anime_id, comment, date) VALUES 
        ((SELECT id FROM User WHERE username = ? LIMIT 1), (SELECT id FROM Anime where name = ? LIMIT 1), ?, NOW())`,

    insertAnimeToWatchedList : `INSERT INTO UserWatched (user_id, anime_id) VALUES
        ((SELECT id FROM User WHERE username = ? LIMIT 1), (SELECT id FROM Anime WHERE name = ? LIMIT 1))`,

    insertAnimeToWishList : `INSERT INTO UserWish (user_id, anime_id) VALUES
        ((SELECT id FROM User WHERE username = ? LIMIT 1), (SELECT id FROM Anime WHERE name = ? LIMIT 1))`,

    removeAnimeFromWatchedList : `DELETE FROM UserWatched WHERE 
                user_id  = (SELECT id FROM User WHERE username = ? LIMIT 1) and
                anime_id = (SELECT id FROM Anime WHERE name = ? LIMIT 1)`,

    removeAnimeFromWishList : `DELETE FROM UserWish WHERE 
                user_id  = (SELECT id FROM User WHERE username = ? LIMIT 1) and
                anime_id = (SELECT id FROM Anime WHERE name = ? LIMIT 1)`,

    editComment : `UPDATE UserComment SET 
                comment = ? WHERE
                id = ?`,

    deleteComment : `DELETE FROM UserComment WHERE
                id = ?`,

    updateAnimeScore : `UPDATE UserScore SET
        score = ? WHERE
        user_id = (SELECT id FROM User WHERE username = ? LIMIT 1) and
        anime_id = (SELECT id FROM Anime WHERE name = ? LIMIT 1)`,

    deleteAnimeScore : `DELETE FROM UserScore WHERE
        user_id = (SELECT id FROM User WHERE username = ? LIMIT 1) and
        anime_id = (SELECT id FROM Anime WHERE name = ? LIMIT 1)`,


    /*********************************************     Queries for anime info for specific user    *********************************************/

};

module.exports = userQueries;