'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const express = require('express')
var app = (0, _express2.default)();

app.get('/', function (req, res) {
    res.send('<h1> Hello World </h1>');
});

var PORT = process.env.PORT || 1002;
app.listen(PORT, function () {
    return console.log('Server is running on port ' + PORT);
});