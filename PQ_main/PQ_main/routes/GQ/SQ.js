'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
const type_licence = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
var MongoClient = require('mongodb').MongoClient;

/**********************
const
 ***********************/

const namesList_one = {
    A: ['color', 'Acc', 'RT'],
    B: ['color', 'CorrAns', 'Press', 'Acc', 'RT', 'SSD', 'SS_Acc'],
    C: ['CoherenceRate', 'RT', 'Acc', 'Direction', 'PressKey'], D:[], E:[], F:[],
    G: ['Point'],
    H: ['Color', 'CorrAns', 'Press', 'Acc', 'RT'],
    I: ['NofDig', 'CorrDig', 'PressDig', 'Accuracy', 'Sum', 'RT'], J:[],
    K: ['Condition', 'Pic', 'Color', 'Press', 'Acc', 'RT'], L:[], M: []
}

const namesList_group = {
    A: ['ACC', 'RT', 'FA', 'FA_RT'],
    B: ['ACC', 'Go_Acc', 'Go_RT', 'NCRate', 'NC_RT', 'mSSD', 'SSRT'],
    C: ['ACC_R1', 'ACC_R2', 'ACC_R3', 'CR_R1', 'CR_R2', 'CR_R3', 'AVR_R'], D:[], E:[], F:[],
    G: ['Level', 'Score'],
    H: ['Acc1', 'Acc2', 'Acc3', 'RT1', 'RT2', 'RT3'],
    I: ['Score', 'Acc'], J:[],
    K: ['Acc', 'RT', 'Positive', 'Negative', 'Middle'], L: [], M: []
}

/**********************
 each data translate function
 ***********************/
//one
function buildJson(num, names, elements) {
    var json = {};
    json['Trail'] = parseInt(num) + 1;
    for (var i = 0; i < names.length; i++)
        json[names[i]] = elements[i];
    return json;
}
function buildJsonList(str, names) {
    var jsons = str.split('~');
    var output = [];
    for (var i in jsons) {
        var json = buildJson(i, names, jsons[i].split('_'));
        output.push(json);
    }
    return output
}
function buildClassJson(str, names) {
    var lists = str.split('-');
    var output = {};
    for (var i in lists)
        output[i + 1] = buildJsonList(lists[i], names)
    return output;
}

//group

function buildGroupJson(str, names) {
    var elements = str.split('_');
    var json = {};
    for (var i = 0; i < names.length; i++)
        json[names[i]] = elements[i];
    return json;
}

/**********************
 ./GQ/SQ/saveData
 ***********************/

function CheckPasswordAndLicence(db, ID, password, type) {
    return new Promise((resolve, reject) => {
        var table = db.db("EW").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                reject({ result: '不存在此帳號' });
            else
                if (result.password == password)
                    if (type_licence.indexOf(type) > -1)
                        resolve(1);
                    else
                        reject({ result: "無此操作權限" });
                else
                    reject({ result: "密碼錯誤" });
        });
    });
}

function saveInDB(type, mode, str) {
    if (mode == "one") {
        switch (type) {
            case 'A':
                return buildJsonList(str, namesList_one.A);
            case 'B':
                return buildJsonList(str, namesList_one.B);
            case 'C':
                return buildClassJson(str, namesList_one.C);
            case 'D':
                return {};
            case 'E':
                return {};
            case 'F':
                return {};
            case 'G':
                return buildClassJson(str, namesList_one.G);
            case 'H':
                return buildClassJson(str, namesList_one.H);
            case 'I':
                return buildJsonList(str, namesList_one.I);
            case 'J':
                return {};
            case 'K':
                return buildJsonList(str, namesList_one.K);
            case 'L':
                return {};
            case 'M':
                return {};
            default:
                return {};
        }
    }
    else if (mode == "group") {
        return buildGroupJson(str, namesList_group[type])
    }
}

function insertData(db,ID,type,date,mode,data) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_data").collection(type + "_" + mode);
        table.insertOne({ ID: ID, Date: date, data: saveInDB(type,mode,data) }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: "success" });
        });
    });
}

router.post('/saveData', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var one = req.body.one;//string
    var group = req.body.group;//string
    var type = req.body.type;
    var date = new Date();
    console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        var PromiseList = [];
        PromiseList.push(insertData(db, ID, type, date, "one",one));
        PromiseList.push(insertData(db, ID, type, date, "group", group));
        CheckPasswordAndLicence(db, ID, password, type)
            .then(pkg => Promise.all(PromiseList))
            .then(pkg => /*res.json(pkg)*/console.log(pkg))
            .catch(error => /*res.json(error)*/ console.log(error));
    });
});

module.exports = router;