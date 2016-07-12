var express = require('express');
var fs = require('fs');
var formidable = require('formidable');
var multer = require('multer');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage : storage}).single('file');

app.post('/upload',function(req,res){
    
    upload(req,res,function(err) {
      console.log(arguments);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

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
  console.log('Let\'s do it on 9255...');
});
