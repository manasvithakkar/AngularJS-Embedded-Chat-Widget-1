/*
    Simple Express server for serving static javascript files, images and EJS templates.
*/
var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS Temporary set to allow all cross domain requests.
    res.render('partials/test');

});

app.use('/static', express.static(__dirname + '/public'))

app.listen(8080);