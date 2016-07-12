var express = require('express');
var bodyParser = require('body-parser');
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


// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, './uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, Date.now() + '-' + file.originalname);
//   }
// });

// var upload = multer({ storage : storage}).single('file');

var extractExtension = function(name) {
  return name.split('.').reverse()[0];
}
app.post('/api/v1/media', function(req, res){
    var id = uuid.v4();
    var storage = multer.diskStorage({
      destination: function(r, f, callback) {
        callback(null, './uploads');
      },
      filename: function(r, file, callback) {
        switch (file.mimetype) {
          case 'image/jpeg': {
            callback(null, `${id}.jpeg`);
            break;
          }
          case 'image/png': {
            callback(null, `${id}.png`);
            break;
          }
          case 'image/gif': {
            callback(null, `${id}.gif`);
            break;
          }
          default: {
            callback(true);
            break;
          }
        }

      }
    });
    var upload = multer({ storage : storage}).single('file');
    upload(req,res,function(err) {
        if(err) {
            return res.status(422).end();
        }
        res.location(res.url(['media', id]));
        res.status(201).end();
    });
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
})

// app.post('/upload', function(req, res) {
//   var form = new formidable.IncomingForm();
//   form.parse(req, function(err, fields, files) {
//     var file = files.file;
//     var pathIn = file.path;
//     var pathOut = 'uploads/' + file.name;
//     // console.log(path);
//     var readStream = fs.createReadStream(pathIn);
//     var writeStream = fs.createWriteStream(pathOut, {
//       flags: 'w',
//       autoClose: true,
//       filename: file.name
//     });
//     readStream.pipe(writeStream);
//     writeStream.close();
//   });
//   res.end();
// });
app.get('/digaOla', function(req, res) {
  res.send("Olá!").end();
})
app.listen(9255, function() {
  console.log('Let\'s do it on 9255... ');
});
