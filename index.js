const dbConnect = require('./db.js');
const app = require ('./server.js');

var port = (process.env.PORT || 5002);

console.log("Starting API server..." +port);

dbConnect().then(
    ()=>{
       app.listen(port);
       console.log("Server ready!"); 
    },
    err => {
        console.log("Connection error: ");
    }
);
