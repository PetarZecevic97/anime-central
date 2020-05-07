const express = require('express');
const mysql = require('mysql');
const redis = require('redis');
const client  = redis.createClient(6379);

const db = mysql.createConnection({
    host: "localhost",
    user: "PetarZecevic",
    password: "mi16169",
    database: "anime_central_db"
  });


module.exports = {'client':client, 'db':db, 'express':express};