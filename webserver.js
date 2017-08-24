// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var solr = require('solr-client');
app.use(express.static(path.join(__dirname, '.')));

// routes will go here
app.get('/', function(req, res) { 
  res.sendFile(__dirname+'/webindex.html');
});

app.get('/csvdata', function(req, res) {
    var fs = require('fs'); 
    var parse = require('csv-parse');
    var csvData = [];
    fs.createReadStream("mapLATimesDataFile.csv")
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            csvData.push(csvrow);
        })
        .on('end',function() {
          res.contentType('application/json');
          res.send(JSON.stringify(csvData));
        });
        
});

app.get('/snippet', function(req, res) {
    var fs = require('fs'); 

    fs.readFile('Test.txt', 'utf8', function (err, data) {
      var query = req.param('qs');
      console.log(query);
      var snippet = "";
      if (err) {
        return console.log(err);
      }
      //console.log(data);
        /*
        var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
        var array_matches = pattern.exec(data);
        var body = array_matches[1];
        body = body.replace((new RegExp("<script.*>.*<\/script>", "gi")), "");
        body = body.replace(/[^a-zA-Z. ]/gi, "");
        body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
        //console.log(body);*/
        var index = data.search(new RegExp("Emilio Francisco", "i"));
        var index1 = data.indexOf(".", index);
        if (index != -1)
        {
            snippet = data.substring(index, index1);
            console.log(snippet);
        }
        res.send(snippet);
    });
        
});

app.get('/solr', function(req, res) { 

    var client = solr.createClient();
    var query = 'wt=json&q=' +req.param('qs');
    if (req.param('opt') == "pagerank")
        query += "&sort=pageRankFile desc";
    client.get('webindex/select', encodeURI(query), function(err, obj){
        if(err){
            console.log(err);
        }else{
            res.send(obj.response);
        }
    });
});

// http://localhost:8983/solr/webindex/suggest?indent=on&q=califo&wt=json
app.get('/solrsuggest', function(req, res) { 

    var client = solr.createClient();
    var param = req.param('qs').split(" ").splice(-1);
    var query = 'wt=json&q=' +param;
    console.log(query);
    client.get('webindex/suggest', encodeURI(query), function(err, obj){
        if(err){
            console.log(err);
        }else{
            //console.log(obj.suggest);
            res.send(obj.suggest.suggest[param]);
        }
    });
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
