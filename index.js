const dbConnect = require('./db.js');
const app = require ('./server.js');
const bodyParser = require('body-parser')
const BillsResource = require('./billsResource');

var port = (process.env.PORT || 5002);
const baseAPI = '/v1';

console.log("Starting API server..." +port);

app.use(bodyParser.json());

app.get(baseAPI + '/bills', (req, reponse) => {
    console.log('GET /bills');
    BillsResource.getAllBills()
    .then((body) => {
    reponse.send(body);
    })
    .catch((error) => {
        console.log("error: " + error);
        reponse.sendStatus(500);
    })
})


app.listen(port, () => {
    console.log("Server (client) app ready and running")
});

/*dbConnect().then(
    ()=>{
       app.listen(port);
       console.log("Server ready!"); 
    },
    err => {
        console.log("Connection error: ");
    }
);
*/