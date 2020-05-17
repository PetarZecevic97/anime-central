const express = require('express');
const mysql = require('mysql');
const redis = require('redis');
const client  = redis.createClient(6379);

const db = mysql.createConnection({

    host: "127.0.0.1",
    user: "root",
    password: "Zimovrel9",
	port: "3306",
//    host: "localhost",
//    user: "root",
//    password: "mysql25",

    database: "anime_central_db"
  });

  
//function for hashing
//Moved the hashedCode func to global in order to use it both in queries for unique ids and in user.
//TODO: Consider moving it back in user after a solution is found for ids in queries.
const hashCode = function(s){
  return s.split("").reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

module.exports = {'client': client, 'db': db, 'express': express, 'hashCode': hashCode};
