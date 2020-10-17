'use strict';
var express = require('express');
var router = express.Router();
var SQ = require('./SQ');
var PR = require('./PR');
const Questionary_licence = ['A', 'B', 'C', 'D', "E", "F", "G", "H", "I", "J", "K", "L", "M"];


/**********************
use sub route
 ***********************/
router.use('/SQ', SQ);
router.use('/PR', PR);

/**********************
 ./GQ/EQ
 ***********************/
router.post('/EQ', function (req, res) {
    res.render('GQ/EQ', { ID: req.body.ID, password: req.body.password });
});

/**********************
./GQ/Questionary/: which
 ***********************/

router.post('/Questionary/:which', function (req, res) {
    if (Questionary_licence.indexOf(req.params.which) > -1)
        res.render('GQ/questionary/' + req.params.which, { ID: req.body.ID, password: req.body.password });
    else
        res.render("warming", { message: "該操作不合法" });
});

module.exports = router;