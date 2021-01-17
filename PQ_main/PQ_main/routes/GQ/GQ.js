'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;
var SQ = require('./SQ');
var PR = require('./PR');
var video = require('./video');
const Questionary_licence = ['A', 'B', 'C', 'D', "E", "F", "G", "H", "I", "J", "K", "L", "M"];


/**********************
use sub route
 ***********************/
router.use('/SQ', SQ);
router.use('/PR', PR);
router.use('/video', video);

/**********************
 ./GQ/EQ
 ***********************/
router.post('/EQ', function (req, res) {
    res.render('GQ/EQ', { ID: req.body.ID, password: req.body.password });
});

/**********************
./GQ/Questionary/: which
 ***********************/

router.post('/Questionary/:which', function (req, res) {
    if (Questionary_licence.indexOf(req.params.which) > -1)
        res.render('GQ/questionary/' + req.params.which, { ID: req.body.ID, password: req.body.password, url: Get("SRSurl") });
    else
        res.render("warming", { message: "該操作不合法" });
});

/**********************
./GQ/GetDate
取得使用者過去填答時間
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

function GetDate(db, ID) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_personal").collection("personal_Date");
        table.findOne({ ID: ID }, { projection: { _id: 0, ID: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                resolve({ result: "success", data: {} });
            else
                resolve({ result: "success", data: result });
        });
    });
}

router.post('/GetDate', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;

    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        CheckPassword(db, ID, password)
            .then(pkg => GetDate(db, ID))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error))
            .finally(pkg => db.close());
    });
});

module.exports = router;