'use strict';
var express = require('express');
const { Get } = require('./GetConst');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('EW/EW1');
});

//QQ/EQ
router.post('/QQ/EQ', function (req, res) {
    res.render('goto', { url: Get('QQ/EQ') });
});

//test
router.get('/test', function (req, res) {
    res.render('testBW');
});

module.exports = router;
