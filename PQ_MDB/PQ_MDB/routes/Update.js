'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');
const table_license = ['Mtable', 'Ltable'];
const criticalNumber_license = ['critical_value'];
const criticalNumber = [
    'mode',
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
    'B1', 'B2', 'B3', 'B4', 'B5',
    'C1_1', 'C1_2', 'C2', 'C3', 'C4', 'C5_1', 'C5_2', 'C5_3', 'C6_1', 'C6_2', 'C6_3', 'C7', 'C8', 'C9', 'C10_1', 'C10_2', 'C10_3',
    'D1_1', 'D1_2', 'D2_1', 'D2_2', 'D3_1', 'D3_2', 'D3_3', 'D4_1', 'D4_2', 'D5'
];//43
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
            //console.log("移除完成");
        });
    });
}

function CsvToJsonListTable(CsvString, where) {
    var jsonList = [];
    var jsons = CsvString.split('\r\n')
    for (var i in jsons) {
        var elements = jsons[i].split(',')
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
    //console.log(jsonList);
    return jsonList;
}

function InsertJsonList(db, where, jsonList) {
    return new Promise((resolve, reject) => {
        //console.log("insert start");
        var table = db.db("data").collection(where);
        table.insertMany(jsonList, function (err, result) {
            if (err) {
                reject({ result: "伺服器連線錯誤" });
                //console.log(err.message);
                throw err;
            }
            resolve({ result: 'success' });
            //console.log("insert success");
        });
    });
}

router.post('/table', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var data = req.body.data;
    var where = req.body.where;
    //console.log(data);
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + 'data', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            if (table_license.indexOf(where) > -1)
                removeTable(db, where)
                    .then(pkg => InsertJsonList(db, where, CsvToJsonListTable(data, where)))
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
function CsvToJsonListCritialNumber(CsvString, where) {
    var jsonList = [];
    var jsons = CsvString.split('\r\n')
    for (var i in jsons) {
        var elements = jsons[i].split(',')
        //console.log(elements);
        if (where == 'critical_value' && elements.length >= criticalNumber.length) {
            var json = {};
            for (var j in criticalNumber) {
                json[criticalNumber[j]] = elements[j];
            }
            jsonList.push(json);
        }
    }
    //console.log(jsonList);
    return jsonList;
}

router.post('/criticalNumber', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var data = req.body.data;
    var where = req.body.where;
    //console.log(data);
    if (core_ID == ID && core_password == password) {
        MongoClient.connect(Get("mongoPath") + 'data', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            if (criticalNumber_license.indexOf(where) > -1)
                removeTable(db, where)
                    .then(pkg => InsertJsonList(db, where, CsvToJsonListCritialNumber(data, where)))
                    //.then(pkg => console.log(CsvToJsonListCritialNumber(data, where)))
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
