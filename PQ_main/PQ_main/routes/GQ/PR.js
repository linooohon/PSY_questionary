'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;

/**********************
const
 ***********************/
const savePR_licence = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I', 'J', 'K'];
const savePRList = {
    'A': ['A1', 'B1', 'C1_1', 'C1_2'],
    'B': ['A2', 'B2', 'C2'],
    'C': ['A3', 'C3'],
    'D': ['A4', 'C4'],
    'E': ['A5', 'B3', 'C5_1', 'C5_2', 'C5_3'],
    'F': ['A6', 'B4', 'C6_1', 'C6_2', 'C6_3'],
    'G': ['A7', 'C7'],
    //'H': [],
    'I': ['A8', 'C8'],
    'J': ['A9', 'C9'],
    'K': ['A10', 'B5', 'C10_1', 'C10_2', 'C10_3'],
    //'L': [],
    //'M': []
}

/**********************
 ./GQ/PR/
 來到PR頁
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

function GetStartData(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_data");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ message: '不存在此帳號的個人資料' });
            else
                resolve({ ID: ID, password: password, gender: result.gender, age: result.age, Ghand: result.Ghand, Phand: result.Phand, name: result.name, nice: result.nice, year: result.year });
        });
    });
}

router.post('/', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.render('warming', { message: '伺服器連線錯誤' }); throw err; }
        CheckPassword(db, ID, password)
            .then(pkg => GetStartData(db, ID, password))
            .then(pkg => res.render("GQ/PR", pkg))
            .catch(error => res.render('warming', error))
            .finally(pkg => db.close());
    });
});


/**********************
 ./GQ/PR/savePR
 存個人報告需要的值到GQ_personal.personal_critical_data裡
 1.確認帳密
 2.根據問卷update(upsert)personal_critical_data
 ***********************/

function updatePersonaldate(db, ID, type, data) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_personal").collection("personal_critical_data");
        var goal = {};
        if (data.length >= savePRList[type].length)
            for (var i in savePRList[type])
                goal[savePRList[type][i]] = data[i];
        else
            reject({ result: '傳入數據格式錯誤' });
        table.updateOne({ ID: ID }, { $set: goal }, { upsert: true }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: "success" });
        });
    });
}

router.post('/savePR', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var type = req.body.type;
    var data = req.body.data;//string
    //console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        if (savePR_licence.indexOf(type) > -1)
            CheckPassword(db, ID, password)
                .then(pkg => updatePersonaldate(db, ID, type, data.split('_')))
                .then(pkg => res.json(pkg))
                .catch(error => res.json(error))
                .finally(pkg => db.close());
        else
            res.json({ result: '無此操作權限' });
    });
});


/**********************
 ./GQ/PR/GetPersonalData
得到個人報告需要的值->GQ_personal.personal_critical_data
 ***********************/

function GetPersonalData(db, ID) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_personal").collection("personal_critical_data");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ result: '不存在此帳號資料' });
            else
                resolve({ result: "success", data: result });
        });
    });
}

router.post('/GetPersonalData', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;

    //console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        CheckPassword(db, ID, password)
            .then(pkg => GetPersonalData(db, ID))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error))
            .finally(pkg => db.close());
    });
});

/**********************
./GQ/PR/GetCriticalData
得到個人報告需要的分位值->data.critical_value
 ***********************/

function GetCriticalData(db, mode) {
    return new Promise((resolve, reject) => {
        var table = db.db("data").collection("critical_value");
        table.find({ mode: mode }, { projection: { _id: 0, mode: 0 } }).sort({ _id: 1 }).toArray(function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result.length == 0)
                reject({ result: '不存在分界資料' });
            else
                resolve({ result: "success", data: result });
        });
    });
}


router.post('/GetCriticalData', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var mode = req.body.mode;
    //console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        CheckPassword(db, ID, password)
            .then(pkg => GetCriticalData(db, mode))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error))
            .finally(pkg => db.close());
    });
});

module.exports = router;