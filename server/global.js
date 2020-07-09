const express = require('express');
const mysql = require('mysql');
const redis = require('redis');
const client  = redis.createClient(6379);
const path = require('path')

const db = mysql.createConnection({

    host: "127.0.0.1",

    //host: "localhost",

    // user: "PetarZecevic",
    // password: "mi16169",

    //user: "root",
    //password: "mysql25",

    user: "nikola",
    password: "bobi1234",

    // user : "root",
    // password: "marsovac96"  // andja password

    //user : "root",
    //password: "Zimovrel9",  //coa password this is getting out of hand


    database: "anime_central_db"
  });

//const imageFolder = "C:\\Users\\Petar Zecevic\\Desktop\\12-AnimeCentral\\database\\anime_pictures\\"
 //const imageFolder = "C:/Users/Lexxigar/Desktop/AnimePlanet/AnimeGit/12-animecentral/database/anime_pictures/"
const endIndex = __dirname.lastIndexOf(path.sep);
const imageFolder = path.join(path.join(__dirname.slice(0, endIndex), 'database'), 'anime_pictures');
console.log(__dirname.slice(0, endIndex));
//function for hashing
//Moved the hashedCode func to global in order to use it both in queries for unique ids and in user.
//TODO: Consider moving it back in user after a solution is found for ids in queries.
const hashCode = function(s){
  return s.split("").reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

module.exports = {'client': client, 'db': db, 'express': express, 'path': path, 'hashCode': hashCode, 'imageFolder': imageFolder};
