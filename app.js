var express = require('express');
var routes = require('./routes/routes');
var http = require('http');
var path = require('path');
var hbs = require('hbs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);
app.get('/balances/:param', routes.balances);
app.get('/totalbalances', routes.totalBalances);
app.get('/latesttrades/:param', routes.latestTrades);
app.get('/totalwinnings', routes.totalWinnings);
app.get('/isalive', routes.isAlive);

//Handlebars Configuration
hbs.registerPartials(__dirname + '/views/partials');

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
