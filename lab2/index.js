var express = require('express');
var http = require("http");
var app = express();

/** Zad 2 **/
app.use('/static', express.static(__dirname + '/public'));

/** Zad 1 **/
var daneGlowne = ["Pierwszy wpis"];

app.get('/dane', function(req, res) {

	/** Zad 3 modyfikacja **/
	if(req.query.formData != null && req.query.formData.length != 0){
		daneGlowne.push(req.query.formData);
	}
	/***********************/

	res.write('<html><head></head><body>');
  	res.write('<p>Liczba elementow tablicy:'  + daneGlowne.length + '</p>');
  	res.write('<ul>');
	for(var i = 0; i<daneGlowne.length; i++){
		res.write('<li>' + daneGlowne[i] + '</li>');
	}
	res.end('</body></html>');
});


/** Zad 2 **/
app.get('/dodaj', function(req, res) {
	if(req.query.formData != null && req.query.formData.length != 0){
		daneGlowne.push(req.query.formData);
	}
	res.redirect('/dane');
});




app.get('/', function (req, res) {
	res.send('Hello World');
});

app.get('/time', function (req, res) {
	res.send('Hello World TIME');
});

app.post('/time', function (req, res) {
	res.status(418);
	res.send('Teapot code');
});

app.put('/time', function (req, res) {
	res.send('Hello World PUT');
});

app.delete('/time', function (req, res) {
	res.send('Hello World DELETE');
});

var fun = function(a, b) {
	console.log(Math.sqrt(Math.pow(a, 2)+ Math.pow(b, 2)));
}


var server = http.createServer(function (request, response) {
	// Wysyłanie nagłówków protokołu HTTP
	// Status HTTP: 200 : OK, Content Type: text/plain
	response.writeHead(200, {'Content-Type': 'text/plain'});
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

app.listen(5006);
console.log('Server działa na http://127.0.0.1:5000/');