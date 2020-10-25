'use strict';
var express = require('express');
const { Get } = require('./GetConst');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('EW/EW1');
});

//test
router.get('/test', function (req, res) {
    res.render('testBW');
});
router.get('/GQ/Questionary/:which', function (req, res) {
    res.render(req.params.which);
});
module.exports = router;
