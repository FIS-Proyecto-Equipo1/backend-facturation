var express = require('express');
var bodyParser = require('body-parser');
const Bill = require ('./bills');

const dbConnect = require('./db.js');
//const app = require ('./server.js');

var BASE_API_PATH = "/api/v1";

var app = express();
app.use(bodyParser.json());

var port = (process.env.PORT || 5000); 
//DUDA: SI PONGO EL 3000 ME FALLA, SI PONGO LOS DATOS DE CONEXION EN OTRO FICHERO TAMBIÉN ME FALLA

console.log("Starting API server..." +port);

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
dbConnect().then(
    ()=>{
       app.listen(port);
       console.log("Server ready!"); 
    },
    err => {
        console.log("Connection error: ");
    }
);