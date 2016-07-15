var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var url = require('url');
var uuid = require('node-uuid');
var fs = require('fs');
var _ = require('lodash');

var app = express();

app.set('path', ['api', 'v1']);
app.set('root', `${__dirname}/uploads`);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Location");
  res.header('Access-Control-Expose-Headers', 'Location');
  next();
});

app.use(function (req, res, next) {
  res.url = function (path) {
    return [req.protocol+'://'+req.get('host')].concat(app.get('path')).concat(path).join('/');
  }
  next();
});

app.post('/api/v1/media', function(req, res){
    var id = uuid.v4();
    var ext = '';
    switch (req.get('Content-Type')) {
      case 'image/jpeg': {
        ext = 'jpeg';
        break;
      }
      case 'image/png': {
        ext = 'png';
        break;
      }
      case 'image/gif': {
        ext = 'gif';
        break;
      }
      default: {
        res.set('Content-Type', 'text/html; charset=utf-8')
        res.status(422).end('Formato de imagem não aceito.');
      }
    }
    res.location(res.url(['media', id]));
    req.pipe(fs.createWriteStream(`uploads/${id}.${ext}`, {
      flags: 'w',
      autoClose: true
    }));
    res.status(200).end();
});

app.get('/api/v1/media/:id', function( req, res) {

  var options = {
    root: app.get('root')
  };
  var id = req.params.id;
  var callback = function(error) {
    if (error) {
      console.error(error);
      res.sendStatus(404);
    }
  };
  var file = searchFile(id, options, function(err, data) {
    if (err) { res.sendStatus(404); }
    res.sendFile(data, options, callback);
  });
});

var searchFile = function(filename, options, callback) {
  var { root } = options;

  if (!filename) {
    callback(true);
    return;
  }

  var dir = fs.readdirSync(root);
  var files = _.reduce(dir, function(result, file) {
    if (file.search(filename) > -1) {
      result.push(file);
    }
    return result;
  }, []);
  if (!files) {
    callback(true);
    return;
  }
  callback(null, _.head(files));
};

var server = http.createServer(app);
// reload(server, app);
server.listen(process.argv[2] || 9255, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Web server listening at http://%s:%s', host, port);
});
