const express = require('express');
const mysql = require('mysql');
const redis = require('redis');
const client  = redis.createClient(6379);
const path = require('path')

const db = mysql.createConnection({

    host: "127.0.0.1",

    user: "PetarZecevic",
    password: "mi16169",

    //user: "root",
    //password: "mysql25",

    //user: "nikola",
    //password: "bobi1234",

    //user : "root",
    //password: "marsovac96",  // andja password

    //user : "root",
    //password: "Zimovrel9",  //coa password this is getting out of hand

    database: "anime_central_db"
  });
const endIndex = __dirname.lastIndexOf(path.sep);
const imageFolder = path.join(path.join(__dirname.slice(0, endIndex), 'database'), 'anime_pictures');

//function for hashing
const hashCode = function(s){
  return s.split("").reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

module.exports = {'client': client, 'db': db, 'express': express, 'path': path, 'hashCode': hashCode, 'imageFolder': imageFolder};
