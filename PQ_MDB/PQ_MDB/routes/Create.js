'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');

/**************************************
./Create/newUser
1. 測帳密
2. 得目前編號+更新
3.插入使用者
  **************************************/

function FindAndUpdateUsersNumber(db) {
    return new Promise((resolve, reject) => {
        var table = db.db("lock").collection("users");
        var findThing = { name: 'usersCount' };
        var updateThing = { $inc: { count: 1 } };
        var set = { projection: { _id: 0 } };
        table.findOneAndUpdate(findThing, updateThing, set, function (err, result) {
            if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
            if (result.ok == 1)
                resolve({ result: result.value.count });
            else
                reject({ result: "系統錯誤,無法取得新使用者的編號" });
        });
    });
}

function randomString(digit) {
    var x = '0123456789qwertyuioplkjhgfdsazxcvbnm';
    var tmp = '';
    for (var i = 0; i < digit; i++)
        tmp += x.charAt(Math.floor(Math.random() * x.length));
    return tmp;
}

function InsertNewUser(db, pkg, tag) {
    return new Promise((resolve, reject) => {
        var new_ID = tag + '_' + pkg.result.toString();
        var random_password = randomString(8);
        var table = db.db("EW").collection("personal_information");
        table.insertOne({ ID: new_ID, password: random_password, first: true }, function (err, result) {
            if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
            resolve({ result: 'success', ID: new_ID, password: random_password });
        });
    });
}

router.post('/newUser', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var tag = req.body.tag;
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + 'lock', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            FindAndUpdateUsersNumber(db)
                .then(pkg => InsertNewUser(db, pkg, tag))
                .then(pkg => res.json(pkg))
                .catch(error => res.json(error));
        });
    }
    else
        res.json({ result: '帳號或密碼錯誤' });
});

module.exports = router;
