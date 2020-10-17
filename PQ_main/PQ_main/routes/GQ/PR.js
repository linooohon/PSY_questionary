'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;

/**********************
 ./GQ/PR/
 來到PR頁
 ***********************/

router.post('/', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    //console.log(req.body);
    res.render("GQ/PR", { ID: ID, password: password });
});



module.exports = router;