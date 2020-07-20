const insertQueries = {

    selectAnime : `SELECT * FROM Anime WHERE name = ?`,

    selectGenre : `SELECT * FROM Genre WHERE name = ?`,

    selectAllGenres : `SELECT * FROM Genre`,

    insertAnime : `INSERT INTO Anime (name, description, picture_URL, date_aired) VALUES(?, ?, ?, ?)`,

    insertGenre : `INSERT INTO Genre (name) VALUES(?)`,

    insertAnimeGenre : `INSERT INTO AnimeGenre (anime_id, genre_id) VALUES(?, ?)`,

    selectStudio : `SELECT * FROM Studio WHERE name = ?`,

    insertStudio: `INSERT INTO Studio (name) VALUES(?)`,

    insertAnimeStudio : `INSERT INTO AnimeStudio (anime_id, studio_id) VALUES(?, ?)`,

    selectProducer : `SELECT * FROM Producer WHERE name = ?`,

    insertProducer: `INSERT INTO Producer (name) VALUES(?)`,

    insertAnimeProducer : `INSERT INTO AnimeProducer (anime_id, producer_id) VALUES(?, ?)`,

    selectLicencor : `SELECT * FROM Licencor WHERE name = ?`,

    insertLicencor: `INSERT INTO Licencor (name) VALUES(?)`,

    insertAnimeLicencor : `INSERT INTO AnimeLicencor (anime_id, licencor_id) VALUES(?, ?)`,


};

module.exports = insertQueries;