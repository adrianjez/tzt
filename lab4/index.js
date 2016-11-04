var express = require('express');
var bodyParser = require('body-parser')
var http = require("http");
var Redis = require("ioredis");

var redis = new Redis(6379);
var app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/** LAB 4  **/
/** ZAD1 **/
app.get('/napis', function(req, res) {
	
	redis.get('napis', function (err, result) {
		res.send(JSON.stringify(result));
	});
	
});

/** ZAD2 **/
app.get('/owoce', function(req, res) {
	redis.srandmember('OWOCE', 2, function (err, result) {
		res.send(JSON.stringify(result));
	});
});

/** ZAD3 **/
app.get('/dodaj', function(req, res) {
	res.sendFile(__dirname + "/" + "public/dodaj.html");
});

app.post('/dodaj', function(req, res) {
	if (!req.body.imie) return res.sendStatus(400);
	redis.rpush('studenci', req.body.imie);
	res.sendFile(__dirname + "/" + "public/dodaj.html");
});

app.get('/studenci', function(req, res) {
	redis.lrange('studenci', 0, -1, function (err, result) {
		res.send(JSON.stringify(result));
	});
});

/** ZAD 4 **/
app.get('/programista/:programistaId/', function(req, res) {
	var txt = "";
	redis.hgetall('programista:' + req.params.programistaId, function(err, result) {
		//res.send(JSON.stringify(result));
		for(var k in result){
			txt += "<a href='/" +req.params.programistaId  + "</a><br>";
		}
		res.end(txt);
		console.log(result)
	});
});

/***************************************************************/
var server = http.createServer(function (request, response) {
	// Wysyłanie nagłówków protokołu HTTP
	// Status HTTP: 200 : OK, Content Type: text/plain
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.setHeader('Content-Type', 'application/json');
	// Wysyłanie ciała odpowiedzi, niezależnie od rodzaju żądania
	console.log('Metoda żadania: ' + request.method + '\n' +
				'Adres URL: ' + request.url + '\n' +
				'Nazwa hosta: ' + request.headers.host);

	var date = Date();	
	response.end('Metoda żadania: ' + request.method + '\n' +
				'Adres URL: ' + request.url + '\n' +
				'Nazwa hosta: ' + request.headers.host + '\n' +
				'Godzinka: ' + date);


});

app.listen(5001);
console.log('Server działa na http://127.0.0.1:5000/');
