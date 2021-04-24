'use strict';
var express = require('express');
var router = express.Router();
//var MongoClient = require('mongodb').MongoClient;
const { Get } = require('./GetConst');
const core_ID = Get('ID');
const core_password = Get('password');

/**************************************
 ./
  **************************************/
router.get('/', function (req, res) {
	res.render('signPage');
});

/**************************************
 ./login
  **************************************/

router.post('/login', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	if (core_ID == ID && core_password == password)
		res.render('switchPage', { ID: ID, password: password });
	else res.render('warming', { message: '帳號或密碼錯誤' });
});

/**************************************
 ./base
  **************************************/
router.post('/base', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	if (core_ID == ID && core_password == password)
		res.render('basePage', { ID: ID, password: password });
	else res.render('warming', { message: '帳號或密碼錯誤' });
});
/**************************************
 ./GQ
  **************************************/
router.post('/GQ', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	if (core_ID == ID && core_password == password)
		res.render('GQPage', { ID: ID, password: password });
	else res.render('warming', { message: '帳號或密碼錯誤' });
});

/**************************************
 ./QQ
  **************************************/
router.post('/QQ', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	if (core_ID == ID && core_password == password)
		res.render('QQPage', { ID: ID, password: password });
	else res.render('warming', { message: '帳號或密碼錯誤' });
});

/**************************************
 ./CQ
  **************************************/
router.post('/CQ', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	if (core_ID == ID && core_password == password)
		res.render('CQPage', { ID: ID, password: password });
	else res.render('warming', { message: '帳號或密碼錯誤' });
});

module.exports = router;
