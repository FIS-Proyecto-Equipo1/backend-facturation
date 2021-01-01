var express = require('express');
var bodyParser = require('body-parser');
const Bill = require ('./bills');
//const Amount = require('./amount');
const { updateOne, findByIdAndUpdate } = require('./bills');
const BillsResource = require ('./billsResource');

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

app.get(BASE_API_PATH + "/bills", (req,res) => {
    console.log(Date() + " - GET /bills");
    
    BillsResource.getAllBills()
    .then((body) => {
        this.response.send(body);
    })
    .catch((error =>{
        console.log ("error: " + error);
        this.response.sendStatus(500);
    } ))
});

//TODO
app.get(BASE_API_PATH + "/bills/:billStatus", (req,res) => {
    console.log(Date() + " - GET /bills/?billStatus");
    
    Bill.find({}, (err, bills) => {
        if(err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
            res.send(req.params);
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

app.delete(BASE_API_PATH + "/bills",(req, res) => {
    console.log(Date() + " - DELETE /bills");
    var bill = req.body;
    
    Bill.findOneAndDelete(bill, (err) => {
        if (err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.patch(BASE_API_PATH + "/bills/:billNumber",(req, res) => {
    console.log(Date() + " - PATCH /bills?billNumber={billNumber}");
    var bill = req.body;
    var id = req.params.id;
    db.bills.updateOne({_id  : ObjectId(id)}, {$set: findByIdAndUpdate});
    
    Bill.patch(bill, (err) => {
        if (err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.patch.
            res.sendStatus(201);
        }
    });
});

module.exports = app;
