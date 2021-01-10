const mongoose = require('mongoose');
const DB_URL = (process.env.MONGO_URL || 'mongodb+srv://yulipala:RUTA69ruta@cluster0.6om1x.mongodb.net/facturation?retryWrites=true&w=majority');

const dbConnect = function() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, { useNewUrlParser: true });
}
//test
module.exports = dbConnect;