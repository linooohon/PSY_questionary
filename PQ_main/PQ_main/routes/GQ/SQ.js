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
    C: ['CoherenceRate', 'RT', 'Acc', 'Direction', 'PressKey'],
    D: ['Size', 'PresentTime', 'Direction','Press','Acc'],
    E: ['Cue', 'Congruent', 'Position', 'Orientation','Press','Acc','RT'],
    F: ['Cue','SoA','TargetPosition','Press','Acc'],
    G: ['Point'],
    H: ['Color', 'CorrAns', 'Press', 'Acc', 'RT'],
    I: ['NofDig', 'CorrDig', 'PressDig', 'Accuracy', 'Sum', 'RT'],
    J: ['Position','CorrAns','Press','Accuracy'],
    K: ['Condition', 'Pic', 'Color', 'Press', 'Acc', 'RT'],
    L: ['filename','X','Y','Sub_X','Sub_Y','Spin','Ans','Acc'],
    M: ['file','CorrAns','Ans','Acc']
}

const namesList_group = {
    A: ['ACC', 'RT', 'FA', 'FA_RT'],
    B: ['ACC', 'Go_Acc', 'Go_RT', 'NCRate', 'NC_RT', 'mSSD', 'SSRT'],
    C: ['ACC_R1', 'ACC_R2', 'ACC_R3', 'CR_R1', 'CR_R2', 'CR_R3', 'AVR_R'],
    D: ['R1t1', 'R1t3', 'R1t10', 'R1Acc1', 'R1Acc3', 'R1Acc10', 'R3t1', 'R3t3', 'R3t10', 'R3Acc1', 'R3Acc3', 'R3Acc10', 'R10t1', 'R10t3', 'R10t10', 'R10Acc1', 'R10Acc3', 'R10Acc10','mt1','mt3','mt10','SI'],
    E: ['Acc','RT','NoCue','Center','Dual','Spatial','Cong','Ing','Neutral','Alert','Orientation','Conflict'],
    F: ['Acc','RT','Neutral','Congruent','InCongruent','SoA200','SoA1200'],
    G: ['Level', 'Score'],
    H: ['Acc1', 'Acc2', 'Acc3', 'RT1', 'RT2', 'RT3'],
    I: ['Score', 'Acc'],
    J: ['N','Acc','Score','back_Score2','back_Score3'],
    K: ['Acc', 'RT', 'Positive', 'Negative', 'Middle'],
    L: [],
    M: []
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
        output[parseInt(i) + 1] = buildJsonList(lists[i], names)
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
            case 'B':
            case 'E':
            case 'F':
            case 'I':
            case 'K':
            case 'L':
            case 'M':
                return buildJsonList(str, namesList_one[type]);
            case 'C':
            case 'D':
            case 'G':
            case 'H':
            case 'J':
                return buildClassJson(str, namesList_one[type]);
            default:
                return {};
        }
    }
    else if (mode == "group") {
        switch (type) {
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'H':
            case 'I':
            case 'J':
            case 'K':
                return buildGroupJson(str, namesList_group[type]);
            case 'L':
            case 'M':
                return "NA";
            default:
                return {};
        }
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
    //console.log(req.body);
    MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
        var PromiseList = [];
        PromiseList.push(insertData(db, ID, type, date, "one",one));
        PromiseList.push(insertData(db, ID, type, date, "group", group));
        CheckPasswordAndLicence(db, ID, password, type)
            .then(pkg => Promise.all(PromiseList))
            .then(pkg => res.json({result:"success"}))
            .catch(error => res.json(error));
    });
});

/**********************
 ./GQ/SQ/videoResult
 存影片結果到M_video裡(AJAX)
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

function CheckIfHave(db,pathname) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_data").collection("M_video");
        table.findOne({ pathname: pathname }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            if (result == null)
                resolve(false);
            else
                resolve(true);//存在
        });
    });
}

function InsertVideo(db, pathname) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_data").collection("M_video");
        table.insertOne({ pathname: pathname, Corr: 0, InCorr:0 }, function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve(1);
        });
    });
}

function updateVideo(db, pathname, ans) {
    return new Promise((resolve, reject) => {
        var table = db.db("GQ_data").collection("M_video");
        var Addthing = {};
        Addthing[ans] = 1;
        table.updateOne({ pathname: pathname }, { $inc: Addthing } , function (err, result) {
            if (err) { reject({ result: '伺服器連線錯誤' }); throw err; }
            resolve({ result: 'success' });
        });
    });
}

router.post('/videoResult', function (req, res) {
    var ID = req.body.ID;
    var password = req.body.password;
    var pathname = req.body.pathname;
    var ans = req.body.ans;
    if (ans == 'Corr' || ans == 'InCorr') {
        //console.log(req.body);
        MongoClient.connect(Get("mongoPath") + 'EW', { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) { res.json({ result: '伺服器連線錯誤' }); throw err; }
            CheckPassword(db, ID, password)
                .then(pkg => CheckIfHave(db, pathname)).then(pkg => {
                if (pkg)
                    InsertVideo(db, pathname).then(pkg => updateVideo(db, pathname, ans));
                else
                    updateVideo(db, pathname, ans);
                })
                .then(pkg => res.json(pkg))
                .catch(error => res.json(error));
        });
    }
    else {
        res.json({ result: 'api非法' });
    }
});



module.exports = router;