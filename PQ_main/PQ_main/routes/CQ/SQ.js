'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
const type_licence = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
];
var MongoClient = require('mongodb').MongoClient;

/**********************
const
 ***********************/

const namesList_one = {
	A: ['Level', 'Class', 'Acc', 'RT'],
	B: ['Class', 'Acc', 'RT'],
	C: ['Level', 'Class', 'Acc', 'RT'],
	D: ['Level', 'Direct', 'CorrAns', 'Press', 'Acc', 'RT', 'SSD'],
	E: ['Class', 'CorrAns', 'Press', 'Acc', 'RT', 'SSD', 'SS_Acc'],
	F: [
		'Level',
		'Cue',
		'Congruent',
		'Position',
		'Orientation',
		'Press',
		'Acc',
		'RT',
	],
	G: ['Level', 'Point'],
	H: ['Level', 'Count', 'Point'],
	I: [],
	J: ['Position', 'Press', 'Acc', 'RT'],
	K: ['Color', 'Press', 'Acc', 'RT'],
	L: ['Cue', 'CorrAns', 'Press', 'Acc', 'RT'],
	M: ['Level', 'Count', 'Errors', 'Distance', 'Time'],
	N: ['Level', 'CalculateRight', 'CharRight', 'Score'],
	O: ['Level', 'CorrAns', 'PressAns', 'Accuracy', 'Sum', 'Time'],
	P: ['Level', 'CorrAns', 'PressAns', 'Accuracy', 'Sum', 'Time'],
	Q: ['Level', 'N', 'Taget', 'Position', 'CorrAns', 'Press', 'Accuracy'],
	R: ['Level', 'Time', 'Score'],
	S: ['Level', 'Time', 'Score'],
	T: ['Count', 'Speed', 'A', 'Direction', 'PressKey', 'Acc', 'RT'],
};

const namesList_group = {
	A: ['Acc', 'RT', 'FA', 'FA_RT', 'Score'],
	B: ['Acc', 'RT', 'FA', 'FA_RT', 'Score'],
	C: ['Acc', 'RT', 'FA', 'FA_RT', 'Score'],
	D: [
		'Level',
		'Level_Acc_1',
		'Level_Acc_2',
		'Level_Acc_3',
		'Level_Acc_4',
		'Level_Acc_5',
		'Level_Acc_6',
		'Level_Acc_7',
		'Level_Acc_8',
		'Level_Acc_9',
		'Level_Acc_10',
		'Go_Acc_1',
		'Go_Acc_2',
		'Go_Acc_3',
		'Go_Acc_4',
		'Go_Acc_5',
		'Go_Acc_6',
		'Go_Acc_7',
		'Go_Acc_8',
		'Go_Acc_9',
		'Go_Acc_10',
		'Go_RT_1',
		'Go_RT_2',
		'Go_RT_3',
		'Go_RT_4',
		'Go_RT_5',
		'Go_RT_6',
		'Go_RT_7',
		'Go_RT_8',
		'Go_RT_9',
		'Go_RT_10',
		'NCRate_1',
		'NCRate_2',
		'NCRate_3',
		'NCRate_4',
		'NCRate_5',
		'NCRate_6',
		'NCRate_7',
		'NCRate_8',
		'NCRate_9',
		'NCRate_10',
		'NC_RT_1',
		'NC_RT_2',
		'NC_RT_3',
		'NC_RT_4',
		'NC_RT_5',
		'NC_RT_6',
		'NC_RT_7',
		'NC_RT_8',
		'NC_RT_9',
		'NC_RT_10',
		'Score',
	],
	E: ['Acc', 'Go_Acc', 'Go_RT', 'NCRate', 'NC_RT', 'mSSD', 'SSRT'],
	F: [
		'Acc',
		'RT',
		'NoCue',
		'Center',
		'Dual',
		'Spatial',
		'Cong',
		'Ing',
		'Alert',
		'Orientation',
		'Conflict',
		'Score',
	],
	G: ['Level', 'Score', 'Acc'],
	H: ['Level', 'Score', 'Acc'],
	I: [],
	J: ['Acc', 'RT', 'Score'],
	K: ['Acc', 'RT', 'Score'],
	L: ['Acc', 'RT', 'Pos_Acc', 'Pos_RT', 'Col_Acc', 'Col_RT', 'Score'],
	M: [
		'Level',
		'Distance',
		'Time',
		'T_Taget',
		'Last_Taget',
		'Last_Click',
		'Last_Distance',
		'Last_Time',
	],
	N: ['Level', 'Num_Score', 'Letter_Score', 'Score'],
	O: ['Score', 'Acc'],
	P: ['Score', 'Acc'],
	Q: ['Level', 'N', 'Acc', 'Score', '1backScore', '2backScore'],
	R: ['Level', 'Score'],
	S: ['Level', 'Score'],
	T: ['Count', 'Speed', 'Level', 'Score'],
};

/**********************
 each data translate function
 ***********************/
//one 由下到上,拆解資料字串 成JSON
function buildJson(num, names, elements) {
	var json = {};
	json['Trail'] = parseInt(num) + 1;
	for (var i = 0; i < names.length; i++) json[names[i]] = elements[i];
	return json;
}
function buildJsonList(str, names) {
	var jsons = str.split('~');
	var output = [];
	for (var i in jsons) {
		var json = buildJson(i, names, jsons[i].split('_'));
		output.push(json);
	}
	return output;
}
function buildClassJson(str, names) {
	var lists = str.split('-');
	var output = {};
	for (var i in lists) output[parseInt(i) + 1] = buildJsonList(lists[i], names);
	return output;
}

//group

function buildGroupJson(str, names) {
	var elements = str.split('_');
	var json = {};
	for (var i = 0; i < names.length; i++) json[names[i]] = elements[i];
	return json;
}

/**********************
 ./CQ/SQ/saveData
 ***********************/

function CheckPasswordAndLicence(db, ID, password, type) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.findOne(
			{ ID: ID },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				if (result == null) reject({ result: '不存在此帳號' });
				else if (result.password == password)
					if (type_licence.indexOf(type) > -1) resolve(1);
					else reject({ result: '無此操作權限' });
				else reject({ result: '密碼錯誤' });
			}
		);
	});
}

function saveInDB(type, mode, str) {
	if (mode == 'one') {
		return namesList_one[type].indexOf('Level') > -1
			? buildClassJson(str, namesList_one[type])
			: buildJsonList(str, namesList_one[type]);
	} else if (mode == 'group') {
		return buildGroupJson(str, namesList_group[type]);
	}
}

function insertData(db, ID, type, date, mode, data) {
	return new Promise((resolve, reject) => {
		var table = db.db('CQ_data').collection(type + '_' + mode);
		table.insertOne(
			{ ID: ID, Date: date, data: saveInDB(type, mode, data) },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				resolve({ result: 'success' });
			}
		);
	});
}

function updateDate(db, ID, date, type) {
	return new Promise((resolve, reject) => {
		var table = db.db('CQ_personal').collection('personal_Date');
		var updateThing = {};
		updateThing[type] = date;
		table.updateOne(
			{ ID: ID },
			{ $set: updateThing },
			{ upsert: true },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				resolve({ result: 'success' });
			}
		);
	});
}

router.post('/saveData', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	var one = req.body.one; //string
	var group = req.body.group; //string
	var type = req.body.type;
	var date = new Date().toLocaleDateString();
	//console.log(req.body);
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		function (err, db) {
			if (err) {
				res.json({ result: '伺服器連線錯誤' });
				throw err;
			}
			//var PromiseList = [];
			//PromiseList.push(insertData(db, ID, type, date, "one",one));
			//PromiseList.push(insertData(db, ID, type, date, "group", group));
			CheckPasswordAndLicence(db, ID, password, type)
				.then((pkg) => insertData(db, ID, type, date, 'one', one))
				.then((pkg) => insertData(db, ID, type, date, 'group', group))
				.then((pkg) => updateDate(db, ID, date, type))
				.then((pkg) => res.json({ result: 'success' }))
				.catch((error) => res.json(error))
				.finally((pkg) => db.close());
		}
	);
});

module.exports = router;
