var express = require('express');
var bodyParser = require('body-parser');
var body = require('body/json');
var url = require('url');
var uuid = require('node-uuid');
var fs = require('fs');
var multer = require('multer');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(function (req, res, next) {
  res.url = function (path) {
    return [req.protocol+'://'+req.get('host')].concat(path).join('/');
  }
  next();
});

var extractExtension = function(name) {
  return name.split('.').reverse()[0];
}
app.post('/api/v1/media', function(req, res){
    var id = uuid.v4();
    var ext = '';
    switch (req.get('Content-Type')) {
      case 'image/jpeg': {
        ext = 'jpeg';
        break;
      }
      // case 'image/png': {
      //   ext = 'png';
      //   break;
      // }
      case 'image/gif': {
        ext = 'gif';
        break;
      }
      default: {
        res.set('Content-Type', 'text/html; charset=utf-8')
        res.status(422).end('Formato de imagem não aceito.');
      }
    }
    req.pipe(fs.createWriteStream(`uploads/${id}.png`, {
      flags: 'w',
      autoClose: true
    }));
    res.status(200).end();
});

app.get('/api/v1/media/:id', function( req, res) {

  var options = {
    root: __dirname + '/uploads'
  };
  var id = req.params.id;
  var callback = function(error) {
    if (error) { res.sendStatus(404); }
  };
  if (req.accepts('jpeg')) {
    res.contentType('image/jpeg');
    res.sendFile(`${id}.jpeg`, options, callback);
  } else if (req.accepts('png')) {
    res.contentType('image/png');
    res.sendFile(`${id}.png`, options, callback);
  } else {
    res.sendStatus(415);
  }
});
app.get('/digaOla', function(req, res) {
  res.send("Olá!").end();
})
app.listen(9255, function() {
  console.log('Let\'s do it on 9255... ');
});
