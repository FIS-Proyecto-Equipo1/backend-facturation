var express = require('express');
var bodyParser = require('body-parser');
const Bill = require ('./bills');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>FACTURATIONNNN</h1></body></html>");
});

app.get(BASE_API_PATH + "/bills", (req,res) => {
    console.log(Date() + " - GET /bills");
    
    Bill.find({}, (err, bills) => {
        if(err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        }else{
            res.send(bills.map((bill) => {
                return bill.cleanup();
            }));
        }
    });
});

app.post(BASE_API_PATH + "/bills",(req, res) => {
    console.log(Date() + " - POST /bills");
    var bill = req.body;
    
    Bill.create(bill, (err) => {
        if (err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

module.exports = app;
