const insertQueries = {

    selectAnime : `SELECT * FROM Anime WHERE name = ?`,

    selectGenre : `SELECT * FROM Genre WHERE name = ?`,

    selectAllGenres : `SELECT * FROM Genre`,

    insertAnime : `INSERT INTO Anime (name, description, picture_URL, date_aired) VALUES(?, ?, ?, ?)`,

    insertGenre : `INSERT INTO Genre (name) VALUES(?)`,

    insertAnimeGenre : `INSERT INTO AnimeGenre (anime_id, genre_id) VALUES(?, ?)`,
};

module.exports = insertQueries;