var express = require('express');
var app = express();

var http = require("http"); // for fetching txt file

var cors = require('cors')

app.use(cors())

var port = process.env.PORT || 3000; // HEROKU requirement

// split words by space
function splitByWords (text) {
    var wordsArray = text.split(/\s+/);
    return wordsArray;
}
  
  function createWordMap (wordsArray) {
    var wordsMap = {};
    wordsArray.forEach(function (key) {
      if (wordsMap.hasOwnProperty(key)) {
        wordsMap[key]++;
      } else {
        wordsMap[key] = 1;
      }
    });
    return wordsMap;
  }
  
  function sortByCount (wordsMap) {
    var finalWordsArray = [];
    finalWordsArray = Object.keys(wordsMap).map(function(key) {
      return {
        value: key,
        count: wordsMap[key]
      };
    });
  
    finalWordsArray.sort(function(a, b) {
      return b.count -  a.count;
    });
  
    return finalWordsArray;
  
  }
  
app.get('/:count', function (req, res) {

    let count = req.params.count;

    http.get('http://terriblytinytales.com/test.txt').on('response', function (response) {
        
        var body = '';
        var i = 0;
        
        //streaming the data in chunks
        response.on('data', function (chunk) {
            i++;
            body += chunk;
        });

        //when done fetching
        response.on('end', function () {
    
            var wordsArray = splitByWords(body);
            var wordsMap = createWordMap(wordsArray);
            var finalWordsArray = sortByCount(wordsMap);

            var topNwords = finalWordsArray.slice(0, count);

            res.send(topNwords); //creates an API
            
        });
    });
    

});


app.get('/', (req, res) => { res.send('Pass the parameter'); }); 

app.get('/*', (req, res) => { res.send('/Pass number parameter'); }); 

app.listen(port, function () {
  console.log('Server running on'+ port);
});