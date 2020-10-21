'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;


/**********************
 ./GQ/video/getList
 獲得對應的影片資源
 ***********************/


router.post('/getList', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;

    //console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }

    });
});

module.exports = router;