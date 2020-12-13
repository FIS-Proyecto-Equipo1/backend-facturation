const dbConnect = require('./db');
const app = require ('./server.js');

var port = (process.env.PORT || 3000);

console.log("Starting API server..." +port);

dbConnect().then(
    ()=>{
       app.listen(port);
       console.log("Server ready!"); 
    },
    err => {
        console.log("Connection error: ");
    }
)

app.listen(port);

console.log("Server ready!");