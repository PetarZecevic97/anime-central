const loginQueries = {

    /*************************************************     Queries needed for log in/sign up    *************************************************/
    selectUserWithUsername : `SELECT * FROM User WHERE username = ?`,

    selectUserWithEmail : `SELECT * FROM User WHERE email = ?`,

    selectUserWithUsernameAndPassword : `SELECT * FROM User WHERE username = ? AND password = ?`,

    selectUserWithUsernameAndEmail : `SELECT * FROM User WHERE username = ? AND email = ?`,

    insertUser : `INSERT INTO User (username, password, email) VALUES(?, ?, ?)`,

    updatePassword : `UPDATE User SET password = ? WHERE username = ? AND email = ?`,
    
    updateUsername : `UPDATE User SET username = ? WHERE username = ? AND password = ?`,

    updateEmail : `UPDATE User SET email = ? WHERE username = ? AND password = ?`,
    /*************************************************     Queries needed for log in/sign up    *************************************************/

};

module.exports = loginQueries;