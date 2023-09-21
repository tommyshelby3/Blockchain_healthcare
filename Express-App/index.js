var express = require('./node_modules/express'); //try changing it to just express
var app = express();
app.use(express.static('src')); // All our static files 
app.get('/', function (req, res) {
  res.render('index.html');
});



app.listen(3010, function () {
    console.log('My Express App listening on port 3010!');
  });