'use strict';
var express = require('express');
var router = express.Router();
const { Get } = require('../GetConst');
var MongoClient = require('mongodb').MongoClient;
var SQ = require('./SQ');

/**********************
use sub route
 ***********************/
//router.use('/SQ', SQ);

/**********************
 ./CQ/EQ
 ***********************/
router.post('/EQ', function (req, res) {
	res.render('CQ/test', { ID: req.body.ID, password: req.body.password });
});

module.exports = router;
