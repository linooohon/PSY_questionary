'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');

/**************************************
./Get/table
1. 測帳密
2. find collection(2 種 type)
  **************************************/

function FindCollection(db, DB, collection, fillterKey, fillterValue, type) {
    return new Promise((resolve, reject) => {
        var table = db.db(DB).collection(collection);
        var findThing = {};
        if (type == 1 || type == 2 || type == 3)
            findThing[fillterKey] = fillterValue;
        var projection = { _id: 0 };
        if (type == 3)
            projection["data"] = 0;
        var set = { projection: projection };
        if (type == 1)
            table.findOne(findThing, set, function (err, result) {
                if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
                resolve({ result: "success", data: result });
            });
        else
            table.find(findThing, set).toArray(function (err, result) {
                if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
                //console.log(result);
                resolve({ result: "success", data: result });
            });
    });
}

router.post('/table', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var DB = req.body.DB;
    var collection = req.body.collection;
    var fillterKey = req.body.fillterKey;
    var fillterValue = req.body.fillterValue;
    var type = req.body.type;
    //console.log(req.body);
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + DB, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            FindCollection(db, DB, collection, fillterKey, fillterValue, type)
                .then(pkg => res.json(pkg))
                .catch(error => res.json(error));
        });
    }
    else
        res.json({ result: '帳號或密碼錯誤' });
});

module.exports = router;
