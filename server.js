var express = require('express');
var bodyParser = require('body-parser');
const Bill = require ('./bills');
const { updateOne, findByIdAndUpdate } = require('./bills');
const VehiclesResource = require('./vehiclesResource');
const UsersResource = require('./usersResource');


var BASE_API_PATH = "/api/v1";

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>FACTURATION</h1></body></html>");
});

app.get(BASE_API_PATH + "/bills", (req,res) => {
    idCliente = req.header('x-user');
    console.log(`user: ${idCliente}`);
    console.log(Date() + " - GET /bills");
    
    Bill.find(req.query, (err, bills) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            console.log(Date() + " GET /bills")
            res.send(bills.map((bill) => {
                return bill.cleanup();}));
        }
    })
});


app.get(BASE_API_PATH + "/bills/generatePdf/:billNumber", (req,res) => {
    Bill.findOne({"billNumber":req.params.billNumber}, (err, bill) => {
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
                const pdf = require('html-pdf');
                var fs = require('fs');
                const fileName = 'pdf.pdf'
                const content = '<h1>Factura: ' + bill.billNumber + '</h1>' + '<p><strong>Nombre: </strong>' + bill.name + ' ' + bill.surname + '</p>'
                + '<p><strong>Vehículo: </strong>' + bill.vehicle + '</p>' + '<p><strong>Duración: </strong>' + bill.duration + '</p>'
                + '<p><strong>Importe: </strong>' + parseFloat(Math.round(bill.amount)).toFixed(2) + "€" + '</p>' + '<p><strong>Estado: </strong>' + bill.billStatus + '</p>' 
            
                pdf.create(content).toBuffer(function(err, buffer) {
                    if (err){
                        console.log(err);
                    } else {
                        var savedFilePath = './tmp/' + fileName;
                        console.log(buffer)
                        fs.writeFile(savedFilePath, buffer, function() {
                            res.status(200).download(savedFilePath, fileName);
                        });
                    }
                })
            }
        }
    })
});

/*app.get(BASE_API_PATH + '/bills', (req, res) => {
    console.log('GET /bills');
    BillsResource.getAllBills()
    .then((body) => {
    res.send(body);
    })
    .catch((error) => {
        console.log("error: " + error);
        res.sendStatus(500);
    })
})*/


app.get(BASE_API_PATH + "/bills/billStatus/:billStatus", (req, res)  => {
    Bill.find({"billStatus": req.params.billStatus}, (err, bills) => {
        if(err){
            console.log(Date()+" - "+ err);
            res.sendStatus(500);
        }else{
            if(req.params.billStatus != 'Pagado' && req.params.billStatus != 'No pagado'){
                console.log(Date() + " GET /bills/"+req.params.billStatus +" - Invalid");
                res.sendStatus(404);
            }
            else    
            {
                console.log(Date() + " GET /bills/"+req.params.billStatus);
                res.send(bills.map((bill) => {
                    return bill.cleanup();}));

            }
        }
    })
});

app.get(BASE_API_PATH + "/bills/:billNumber", (req, res)  => {
    Bill.findOne({"billNumber":req.params.billNumber}, (err, bill) => {
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
                res.send(bill.cleanup())
            }
        }
    })
});

app.post(BASE_API_PATH + "/bills",(req, res) => {
    console.log(Date() + " - POST /bills");
    var bill = req.body;
    id_cliente = req.header('x-user')

     // Obtenemos los datos del usuario
     UsersResource.getUser(id_cliente)
     .then((user => {
    
        bill.username = user.nombre;
        bill.surname = user.apellidos;
        bill.id_cliente = id_cliente;
     
    }));

     // Obtenemos los datos del vehiculo
     VehiclesResource.getVehicle(bill.id_vehicle)
     .then((vehicle =>{
         bill.vehicle = vehicle.tipo;
     }));

    Bill.create(bill, (err) => {
        if (err){
            console.log(Date() + "-" + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.delete(BASE_API_PATH + "/bills/:billNumber", (req, res)  => {
        let billNumber = req.params.billNumber;

        Bill.findOneAndDelete({"billNumber": billNumber}, (err, billDelete) => {
            if(err == null && billDelete == null)
            {    
                var auxErr = new Error("Bill not found " + billNumber);
                console.log(Date()+" - "+auxErr);
                res.sendStatus(404)
            }
            else if(err)
            {    
                console.log(err);
                res.sendStatus(500)
            }else
            {
                console.log(Date() + " DELETE /bills/" + billNumber)
                res.status(204).send({message : "Bill " + billNumber+ " deleted"});
            }
        });  
});

app.put(BASE_API_PATH + "/bills/:billNumber",(req, res) => {
    console.log(Date() + " - PUT /bills/billNumber={billNumber}");
    let billNumber = req.params.billNumber;
    let update_bill = req.body;
    Bill.findOneAndUpdate({"billNumber": billNumber}, update_bill, { runValidators: true }, (err, bill_update) => {
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
