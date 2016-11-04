var express = require('express');
var bodyParser = require('body-parser')
var http = require("http");
var Redis = require("ioredis");
//~ var ejs = require('ejs');

var redis = new Redis(6379);
var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.engine('html',require('hjs').renderFile);
app.set('views', __dirname);
app.set('view engine', 'html');

/** LAB 5  **/

/** ZAD1 **/
app.get('/:imie/:wiek/', function(req, res, next) {
	
	var text = "Witaj " + req.params.imie + ". Masz " + req.params.wiek 
		+ " lat ";
	if(req.params.wiek === 'edycja')
	{
		next();
		return;
	}
	res.end(text);
});

/** ZAD 2 **/
app.get('/:imie/edycja', function(req, res) {
	var imie = req.params.imie;
	res.end('Edycja imienia ' + imie);
});

/** ZAD 3 **/
app.get('/witaj', function (req, res) {
    var Osoba = {
        imie: "Janek",
        wiek: 35
    }
    res.render('szablon.html', Osoba);
});

/** ZAD 4 **/
app.get('/szablon', function (req, res) {
	
	var dane = "";
    var Osoba = {
        imie: "Janek",
        wiek: 35
    }
    app.render('szablon2', Osoba, function(err, html) {
		dane += html;
		
	});
    app.render('szablon', Osoba, function(err, html) {
		dane += html;
		
	});
	res.send(dane);
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
