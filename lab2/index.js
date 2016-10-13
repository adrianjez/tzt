var express = require('express');
var bodyParser = require('body-parser')
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


/** Zad 4 **/
// POST /dodaj2 gets JSON bodies
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.post('/dodaj2', function (req, res) {
	if (!req.body) return res.sendStatus(400);
	daneGlowne.push(req.body.formData);
	res.redirect('/dane');
})

/** Zad 5 **/
var osoby={};
osoby['jnowak'] = {imie:'Janina', nazwisko: "Nowak", email:"jnowak@abc.com"};

app.get('/osoby', function(req, res) {
	res.write('<html><head></head><body>');
  	res.write('<p>Liczba elementow tablicy osoby:'  + Object.keys(osoby).length + '</p>');
  	res.write('<ul>');
	for(var klucz in osoby){
		res.write('<li>' + osoby[klucz].imie + 
			' ' + osoby[klucz].nazwisko + 
			' ' + osoby[klucz].email + '</li>');
	}
	res.end('</body></html>');
});

/** ZAD 6 **/
app.delete('/usun', function (req, res) {
	if (!req.body) return res.sendStatus(400);
	daneGlowne.push(req.body.formData);
	res.redirect('/dane');
})


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

app.listen(5001);
console.log('Server działa na http://127.0.0.1:5000/');