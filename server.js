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

app.get(BASE_API_PATH + "/bills/:billStatus", (req, res)  => {
    Bill.findOne({"billStatus": req.params.billStatus}, (err, bill) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            if(bill == null){
                console.log(Date() + " GET /bills/ "+req.params.billStatus +" - Invalid");
                res.sendStatus(404);
            }
            else    
            {
                console.log(Date() + " GET /bills/ "+req.params.billStatus);
                res.send(billStatus.cleanId());
            }
        }
    })
});

app.get(BASE_API_PATH + "/bills/:billNumber", (req, res)  => {
    Bill.findOne({"billNumber": req.params.billNumber}, (err, bill) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            if(bill == null){
                console.log(Date() + " GET /bills/ "+req.params.billNumber +" - Invalid");
                res.sendStatus(404);
            }
            else    
            {
                console.log(Date() + " GET /bills/ "+req.params.billNumber);
                res.send(billNumber.cleanId());
            }
        }
    })
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

app.put(BASE_API_PATH + "/bills/:billNumber",(req, res) => {
    console.log(Date() + " - PUT /bills?billNumber={billNumber}");
    let billNumber = req.params.billNumber;
    let update_bill = req.body;
    Vehicle.findOneAndUpdate({"billNumber": billNumber}, update_bill, { runValidators: true }, (err, bill_update) => {
        if(err == null && bill_update == null)
            err = new Error("Bill not found " + billNumber);
        if(err)
        {    
            console.log(Date()+" - "+err);
            res.sendStatus(500);
        }else
        {
            console.log(Date() + " PUT /bills/" + billNumber);
            res.status(200).send({billNumber : bill_update, body: req.body});
        }                                                                     
                                                                              
    });
});

module.exports = app;
