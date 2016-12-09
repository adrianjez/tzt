var express = require('express');
var http = require("http");

var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
// Dane do połączenia w adresie URL
var url = 'mongodb://localhost:27017/lab06';
var database;


/** Help methods **/
function simpleStringify (object){
    var simpleObject = {};
    for (var prop in object ){
        if (!object.hasOwnProperty(prop)){
            continue;
        }
        if (typeof(object[prop]) == 'object'){
            continue;
        }
        if (typeof(object[prop]) == 'function'){
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

/** Zad1 **/
app.get('/lstud', function(req, res) {
    var studenci = database.collection('studenci');
    studenci.count(function (err, count) {
       res.end("Count: " + count);
    });
});

/** Zad2 **/
app.get('/liczba/:db/:collection', function (req, res) {
    var tempUrl = 'mongodb://localhost:27017/' + req.params.db;
    MongoClient.connect(tempUrl, function(err, db) {
        assert.equal(null, err);
        var collection = db.collection(req.params.collection);
        collection.count(function (err, count) {
           res.end("Liczba dokumentow w kolekcji" + req.params.collection + " " + count);
            db.close();
        });
    });
});

/** Zad 3 **/
app.get('/wydzialy', function(req, response) {
    var text = "Wydzialy na pcz: \n";
    var wydzialy = database.collection('wydzialy');
    wydzialy.find({}).toArray(function (err, res) {
        for (var i = 0; i < res.length; i++) {
            text += res[i].nazwa + '\n';
            for(var j = 0; j< res[i].kierunki.length; j++){
                text += "*" + res[i].kierunki[j] + '\n';
            }
        }
        response.end(text)
    });
});

/** Zad 4 **/
app.get('/nabor', function (req, resposne) {
    var text = "Id wydzialu: liczba \n";
    var studenci = database.collection('studenci');
    studenci.aggregate(
        [
            {$group: {"_id" : "$wydzial", "count" : {$sum: 1}}},
            {$sort: {"count" : -1}}
        ], function (err, result) {
            for(var i = 0; i < result.length; i++){
                text += result[i]._id + ": " + result[i].count + '\n';
            }
            resposne.end(text);
        }
    )
});


/** Zad 5 **/
app.get('/wydzialy/:id', function (req, response) {
    var collection = database.collection('wydzialy');
    console.log("Given id: " + req.params.id);
    collection.findOne({"_id" :  new ObjectID(req.params.id)}, function (err, item) {
        response.end(item.nazwa);
    })
});


/** Zad 6 **/
app.get('/nabor2', function (req, resposne) {
    var text = "Id wydzialu: liczba \n";
    var studenci = database.collection('studenci');
    var collection = database.collection('wydzialy');
    studenci.aggregate(
        [
            {$group: {"_id" : "$wydzial", "count" : {$sum: 1}}},
            {$sort: {"count" : -1}}
        ], function (err, result) {

            for(var i = 0; i < result.length; i++){

                collection.findOne({"_id" :  new ObjectID(req.params.id) }, function (err, item) {
                    text += item.nazwa + " " + result[i].count + '\n';
                })
            }
            resposne.end(text);
        }
    )
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
/** Init of mongodb **/
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Nawiązano połączenie z serwerem");
    database = db;
});
console.log('Server działa na http://127.0.0.1:5001/');