const animeQueries = {

    /**************************************     Queries for anime info for both logged and unlogged user    **************************************/
    //TODO: Consider that the user wants to know which anime he rated

    //Select info about anime with name that contains provided string
    selectAllAnimeLike : `SELECT * FROM Anime WHERE name LIKE ?`,
    //Select info about all anime
    selectAllAnime : "SELECT * FROM Anime",

    //Select info about anime with given name
    selectAnimeWithName : `WITH genre_concat AS (
            SELECT Anime.id AS 'id', GROUP_CONCAT(Genre.name SEPARATOR ', ') AS 'Genres'
            FROM Anime JOIN AnimeGenre ON Anime.id = AnimeGenre.anime_id JOIN Genre ON AnimeGenre.genre_id = Genre.id 
            WHERE Anime.name = ?
            GROUP BY Anime.id
        ),
        studio_concat AS (
            SELECT Anime.id AS 'id', GROUP_CONCAT(Studio.name SEPARATOR ', ') AS 'Studios'
            FROM Anime JOIN AnimeStudio ON Anime.id = AnimeStudio.anime_id JOIN Studio ON AnimeStudio.studio_id = Studio.id
            WHERE Anime.name = ?
            GROUP BY Anime.id
        ),
        producer_concat AS (
            SELECT Anime.id AS 'id', GROUP_CONCAT(Producer.name SEPARATOR ', ') AS 'Producers'
            FROM Anime JOIN AnimeProducer ON Anime.id = AnimeProducer.anime_id JOIN Producer ON AnimeProducer.producer_id = Producer.id
            WHERE Anime.name = ? 
            GROUP BY Anime.id
        ),
        licencor_concat AS (
            SELECT Anime.id AS 'id', GROUP_CONCAT(Licencor.name SEPARATOR ', ') AS 'Licencors'
            FROM Anime JOIN AnimeLicencor ON Anime.id = AnimeLicencor.anime_id JOIN Licencor ON AnimeLicencor.licencor_id = Licencor.id
            WHERE Anime.name = ? 
            GROUP BY Anime.id
        ),
        comment_concat AS (
            SELECT Anime.id AS 'id',
            GROUP_CONCAT(CONCAT(User.username, ': ', UserComment.comment, ': ', UserComment.date, ': ', UserComment.id) SEPARATOR '\\n') AS 'Comments'
            FROM Anime JOIN UserComment ON Anime.id = UserComment.anime_id
            JOIN User on UserComment.user_id = User.id
            WHERE Anime.name = ? 
            GROUP BY Anime.id
        )
        SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views, 
        genre_concat.Genres, studio_concat.Studios, producer_concat.Producers, licencor_concat.Licencors, comment_concat.Comments
        FROM Anime JOIN genre_concat ON Anime.id = genre_concat.id
        JOIN studio_concat ON Anime.id = studio_concat.id
        JOIN producer_concat ON Anime.id = producer_concat.id
        JOIN licencor_concat ON Anime.id = licencor_concat.id
        LEFT JOIN comment_concat ON Anime.id = comment_concat.id
        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
        LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id`,

    //Select info about anime with some/all of genres
    selectAllAnimeWithGenres (numOfGenres) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeGenre ON Anime.id = AnimeGenre.anime_id 
                        JOIN Genre ON AnimeGenre.genre_id = Genre.id
                        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                        LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                        WHERE Genre.name = ? `;
        for (let i = 0; i < numOfGenres-1; i++){
            sql += ` OR Genre.name = ? `;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all producers
    selectAllAnimeWithProducers (numOfProducers) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeProducer ON Anime.id = AnimeProducer.anime_id 
                        JOIN Producer ON AnimeProducer.producer_id = Producer.id
                        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                        LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                        WHERE Producer.name = ? `;
        for (let i = 0; i < numOfProducers-1; i++){
            sql += ` OR Producer.name = ? `;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all studios
    selectAllAnimeWithStudios (numOfStudios) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeStudio ON Anime.id = AnimeStudio.anime_id 
                        JOIN Studio ON AnimeStudio.studio_id = Studio.id
                        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                        LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                        WHERE Studio.name = ? `;
        for (let i = 0; i < numOfStudios-1; i++){
            sql += ` OR Studio.name = ? `;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime made by some/all licencors
    selectAllAnimeWithLicencors (numOfLicencors) {
        let sql = `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views, COUNT(*) as 'Count'
                        FROM Anime JOIN AnimeLicencor ON Anime.id = AnimeLicencor.anime_id 
                        JOIN Licencor ON AnimeLicencor.licencor_id = Licencor.id
                        LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                        LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                        WHERE Licencor.name = ? `;
        for (let i = 0; i < numOfLicencors-1; i++){
            sql += ` OR Licencor.name = ? `;
        }
        sql += `GROUP BY Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views
                      HAVING Count > 0
                      ORDER BY Count DESC
                      LIMIT 10`;
        return sql;
    },

    //Select info about anime with best ratings
    selectNTopRatedAnime : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views 
                FROM Anime
                LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                ORDER BY AnimeTotalScore.total_score DESC
                LIMIT ?`,

    //Select info about latest anime
    selectNLatestAnime : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views 
                FROM Anime
                LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                ORDER BY Anime.date_aired DESC
                LIMIT ?`,

    //Select info about most popular
    selectNMostPopularAnime : `SELECT Anime.id, Anime.name, Anime.description, Anime.picture_URL, Anime.date_aired, AnimeTotalScore.total_score, AnimeTotalViews.total_views
                FROM Anime
                LEFT JOIN AnimeTotalScore ON Anime.id = AnimeTotalScore.anime_id
                LEFT JOIN AnimeTotalViews ON Anime.id = AnimeTotalViews.anime_id
                ORDER BY AnimeTotalViews.total_views DESC
                LIMIT ?`,

    selectTopNLatestComments : `SELECT Anime.id, Anime.name AS 'animeName', User.username, UserComment.comment, UserComment.date
                                FROM Anime JOIN UserComment ON Anime.id = UserComment.anime_id JOIN
                                User on UserComment.user_id = User.id
                                ORDER BY UserComment.date DESC
                                LIMIT ?`
    /**************************************     Queries for anime info for both logged and unlogged user    **************************************/

};

module.exports = animeQueries;