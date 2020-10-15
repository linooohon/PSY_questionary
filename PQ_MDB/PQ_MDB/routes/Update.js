'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');
const table_license = ['Mtable', 'Ltable'];
const criticalNumber_license = ['critical_value'];

/**************************************
./Update/table
1. 測帳密
2. 測權限
3. 刪表格
4. 資料處理 (csv to string)
5  存資料
  **************************************/

function removeTable(db, where) {
    return new Promise((resolve, reject) => {
        var table = db.db("data").collection(where);
        table.deleteMany({}, function (err, result) {
            if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
            resolve({ result: "remove完成" });
            console.log("移除完成");
        });
    });
}

function CsvToJsonListTable(CsvString,where) {
    var jsonList = [];
    var jsons = CsvString.spilt('\n')
    for (var i in jsons) {
        var elements = jsons[i].spilt(',')
        var json = {}
        if (where == 'Mtable' && elements.length >= 4) {
            json['filepath'] = elements[0]
            json['X'] = elements[1]
            json['Y'] = elements[2]
            json['ans'] = elements[3]
            jsonList.push(json)
        }
        else if (elements.length >= 3) {
            json['filepath'] = elements[0]
            json['ans1'] = elements[1]
            json['ans2'] = elements[2]
            jsonList.push(json)
        }
    }
    console.log(jsonList);
    return jsonList;
}

function InsertJsonList(db, where, jsonList) {
    return new Promise((resolve, reject) => {
        var table = db.db("data").collection(where);
        table.insertMany(jsonList, function (err, result) {
            if (err) { reject({ result: "伺服器連線錯誤" }); throw err; }
            resolve({ result: 'success' });
            console.log("insert success");
        });
    });
}

router.post('/table', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var data = req.body.data;
    var where = req.body.where;
    console.log(data);
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + 'data', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            if (table_license.indexOf(where) > -1)
                removeTable(db, where)
                    .then(pkg => InsertJsonList(db, where, CsvToJsonListTable(data,where)))
                    .then(pkg => res.json(pkg))
                    .catch(error => res.json(error));
            else
                res.json({ result: '無此操作權限' });
        });
    }
    else
        res.json({ result: '帳號或密碼錯誤' });
});

/**************************************
./Update/criticalNumber
1. 測帳密
2. 測權限
3. 刪表格
4. 資料處理 (csv to string)
5  存資料
  **************************************/
function CsvToJsonListCritialNumber(CsvString,where) {
    var jsonList = [];
    var jsons = CsvString.spilt('\n')
    for (var i in jsons) {
        var elements = jsons[i].spilt(',')
        var json = {}
        if (where == 'critical_value' && elements.length >= 31) {
            json['mode'] = elements[0]
            json['A1'] = elements[1]
            json['A2'] = elements[2]
            json['A3'] = elements[3]
            json['A4'] = elements[4]
            json['A5'] = elements[5]
            json['A6'] = elements[6]
            json['A7'] = elements[7]
            json['A8'] = elements[8]
            json['A9'] = elements[9]
            json['A10'] = elements[10]
            json['B1'] = elements[11]
            json['B2'] = elements[12]
            json['B3'] = elements[13]
            json['B4'] = elements[14]
            json['B5'] = elements[15]
            json['C1'] = elements[16]
            json['C2'] = elements[17]
            json['C3'] = elements[18]
            json['C4'] = elements[19]
            json['C5'] = elements[20]
            json['C6'] = elements[21]
            json['C7'] = elements[22]
            json['C8'] = elements[23]
            json['C9'] = elements[24]
            json['C10'] = elements[25]
            json['D1'] = elements[26]
            json['D2'] = elements[27]
            json['D3'] = elements[28]
            json['D4'] = elements[29]
            json['D5'] = elements[30]
            jsonList.push(json)
        }
    }
    console.log(jsonList);
    return jsonList;
}

router.post('/criticalNumber', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var data = req.body.data;
    var where = req.body.where;
    console.log(data);
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + 'data', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            if (criticalNumber_license.indexOf(where) > -1)
                removeTable(db, where)
                    .then(pkg => InsertJsonList(db, where, CsvToJsonListCritialNumber(data, where)))
                    .then(pkg => res.json(pkg))
                    .catch(error => res.json(error));
            else
                res.json({ result: '無此操作權限' });
        });
    }
    else
        res.json({ result: '帳號或密碼錯誤' });
});

module.exports = router;
