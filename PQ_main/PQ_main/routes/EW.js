'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('./GetConst');
var MongoClient = require('mongodb').MongoClient;
const jumpBoard_license = ['EW3', 'EW4', 'EW5'];


/**********************
 ./EW
 ***********************/
router.get('/', function (req, res) {
    res.render('EW/EW1');
});
/**********************
 ./EW/login
 1.抓帳密和是否第一次
 2.不存在警告 不存在此帳號, 密碼不配對警告 密碼不配對,後傳是否第一次
 3.第一次->改為不是第一次 渲染至EW2
 4.非第一次->抓取過去資料進入EW4
 ***********************/
function logincheckID(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ message: '不存在此帳號' });
            else
                if (result.password == password)
                    result.first ? resolve({ walk: "first" }) : resolve({ walk: "Notfirst" });
                else
                    reject({ message: "密碼錯誤" });
        });
    });
}
function loginFirstRender(db, res, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.updateOne({ ID: ID }, { $set: { first: false } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            res.render('EW/EW2', { ID: ID, password: password });
            resolve({});
        });
    });
}
function loginNotFirstRender(db, res, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_data");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result != null)
                res.render('EW/EW4', { ID: ID, password: password, data: result });
            else
                res.render('EW/EW2', { ID: ID, password: password });
            resolve({});
        });
    });
}

router.post('/login', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.render('warming', { message: '伺服器連線錯誤' }); throw err; }
        logincheckID(db, ID, password)
            .then(pkg => {
                if (pkg.walk == 'first')
                    loginFirstRender(db, res, ID, password)
                else
                    loginNotFirstRender(db, res, ID, password)
            }).then(new function () { })
            .catch(error => res.render('warming', error));
    });
});
/**********************
 ./EW/jumpBoard
 1.查看跳轉頁是否許可
 2.看存在與密碼對不對
 3.跳轉
 ***********************/
function jumpBoardCheckPassword(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ message: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ message: '不存在此帳號' });
            else
                if (result.password == password)
                    resolve({ ID: ID, password: password, data: 'NA' });
                else
                    reject({ message: "密碼錯誤" });
        });
    });
}
router.post('/jumpBoard', function (req, res) {
    //上面有設jumpBoard_license 
    var ID = req.body.ID;
    var password = req.body.password;
    var goal = req.body.goal;
    if (jumpBoard_license.indexOf(goal) > -1)
        MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.render('warming', { message: '伺服器連線錯誤' }); throw err; }
            jumpBoardCheckPassword(db, ID, password)
                .then(pkg => res.render('EW/' + goal, pkg))
                .catch(error => res.render('warming', error));
        });
    else
        res.render('warming', { message: '非法操作, 請聯絡網站管理員' });
});

/**********************
 ./EW/changePassword(AJAX)
 1.確認帳密
 2.更新密碼
 ***********************/
function changePasswordCheckPassword(db, ID, password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ result: '不存在此帳號' });
            else
                if (result.password == password)
                    resolve({ });
                else
                    reject({ result: "密碼錯誤" });
        });
    });
}
function changePasswordUpdatePassword(db,ID,new_password) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.updateOne({ ID: ID }, { $set: { password: new_password } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result : 'success'});
        });
    });
}
router.post('/changePassword', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var new_password = req.body.new_password;
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        changePasswordCheckPassword(db, ID, password)
            .then(changePasswordUpdatePassword(db, ID, new_password))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error));
    });
});
/**********************
 ./EW/updateData(AJAX)
 1.查看存在帳號密碼
 2.更新(upsert:true)

 ***********************/
router.post('/updateData', function (req, res) {

});

module.exports = router;