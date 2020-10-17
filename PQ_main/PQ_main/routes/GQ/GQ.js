'use strict';
var express = require('express');
var router = express.Router();
var SQ = require('./SQ');                                                                                                                                                                                                                                                                                                                                                                          

/**********************
 ./GQ/SQ
 ***********************/
router.use('/SQ', SQ);

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
    res.render('GQ/questionary/' + req.params.which, { ID: req.body.ID, password: req.body.password });
});

module.exports = router;