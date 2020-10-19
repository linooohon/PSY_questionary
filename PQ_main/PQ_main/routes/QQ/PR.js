'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;

/**********************
 ./QQ/PR/
 來到PR頁
 1.檢查帳密
 2.get 個人全部最新資料(QQ.all.ID)
 3.render data:data
 ***********************/

function CheckPassword(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ message: '不存在此帳號' });
            else
                if (result.password == password)
                    resolve(1);
                else
                    reject({ message: "密碼錯誤" });
        });
    });
}

function GetAllData(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("QQ").collection("all");
        table.findOne({ ID: ID }, { projection: { _id: 0, ID: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ message: '不存在資料' });
            else
                resolve({ ID: ID, password: password, data: result });
        });
    });
}

router.post('/', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.render('warming', { message: '伺服器連線錯誤' }); throw err; }
        CheckPassword(db, ID, password)
            .then(pkg => GetAllData(db, ID, password))
            .then(pkg => res.render("QQ/PR", pkg))
            .catch(error => res.render('warming', error));
    });
});

module.exports = router;