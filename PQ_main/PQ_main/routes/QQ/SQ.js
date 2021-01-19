'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;
const questionary_count = { Q1: 28, Q2: 31, Q3: 21, Q4: 18, Q5: 25, Q6: 14, Q7: 16, Q8: 76 }
const Questionary_licence = ['Q1', 'Q2', 'Q3', 'Q4', "Q5", "Q6", "Q7", "Q8"];

/**********************
 ./QQ/SQ/saveData
 1.檢測licence
 2.測帳密
 3.插入單一資料與更新全體資料
 ***********************/
function CheckPassword(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ result: '不存在此帳號' });
            else
                if (result.password == password)
                    resolve(1);
                else
                    reject({ result: "密碼錯誤" });
        });
    });
}

function updateAlldate(db, ID, collection, data) {
    return new Promise((resolve, reject) => {
        var table = db.db("QQ").collection("all");
        var list = data.split('_');
        var goal = {};
        if (list.length >= questionary_count[collection])
            for (var i = 1; i <= questionary_count[collection]; i++)
                goal[collection + "_" + i] = list[i - 1];
        else
            reject({ result: '傳入數據格式錯誤' });
        table.updateOne({ ID: ID }, { $set: goal }, { upsert: true }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: "success" });
        });
    });
}

function insertOnedate(db, ID, collection, data, date) {
    return new Promise((resolve, reject) => {
        var table = db.db("QQ").collection("one_" + collection);
        var list = data.split('_');
        var goal = {};
        if (list.length >= questionary_count[collection])
            for (var i = 1; i <= questionary_count[collection]; i++)
                goal[i] = list[i - 1];
        else
            reject({ result: '傳入數據格式錯誤' });
        table.insertOne({ ID: ID, Date: date, data: goal }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: "success" });
        });
    });
}

function updateDate(db, ID, date, type) {
    return new Promise((resolve, reject) => {
        var table = db.db("QQ").collection("personal_Date");
        var updateThing = {};
        updateThing[type] = date;
        table.updateOne({ ID: ID }, { $set: updateThing }, { upsert: true }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: "success" });
        });
    });
}

router.post('/saveData', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var data = req.body.data;
    var collection = req.body.collection;//Q1,Q2.....
    var date = new Date().toLocaleDateString();
    if (Questionary_licence.indexOf(collection) > -1) {
        MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            //var promisrList = [];
            //promisrList.push(updateAlldate(db, ID, collection, data));
            //promisrList.push(insertOnedate(db, ID, collection, data));
            CheckPassword(db, ID, password)
                .then(pkg => updateAlldate(db, ID, collection, data))
                .then(pkg => insertOnedate(db, ID, collection, data, date))
                .then(pkg => updateDate(db, ID, date, collection))
                .then(pkg => res.json({ result: "success" }))
                .catch(error => res.json(error))
                .finally(pkg => db.close());
        });
    }
    else
        res.json({ result: '無此操作權限' });
});

module.exports = router;