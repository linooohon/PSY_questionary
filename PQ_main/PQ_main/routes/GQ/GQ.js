'use strict';
var express = require('express');
var router = express.Router();
var SQ = require('./SQ');                                                                                                                                                                                                                                                                                                                                                                          

/**********************
 ./GQ/SQ
 ***********************/
router.use('/SQ', SQ);

module.exports = router;