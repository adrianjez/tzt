var express = require('express');
var bodyParser = require('body-parser')
var http = require("http");
var Redis = require("ioredis");

var redis = new Redis(6379);
var app = express();

/** Zad 5 **/
app.get('/dodaj', function(req, res) {
	
	redis.multi()
	.set('imie', 'Jan')
	.set('nazwisko', 'Kowalski')
	.exec(function(err, result) {
		res.write('<html><head></head><body>');
		res.write('<p>' + result + '</p>');
		res.end('</body></html>');
	});
	
});

app.get('/odczyt', function(req, res) {
	res.write('<html><head></head><body>');
	
	redis.pipeline()
	.get('imie')
	.get('nazwisko')
	.exec(function(err, results){
		console.log(results);
		res.write(JSON.stringify(results));
		res.end('</body></html>');
	});
	
});


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
