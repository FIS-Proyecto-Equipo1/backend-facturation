const mongoose = require ('mongoose');

const billSchema = new mongoose.Schema({
    billStatus: String,
    rate: Number,
    amount: Number
});

billSchema.methods.cleanup = function(){
    return {
         billStatus: this.billStatus,
         rate: this.rate,
         amount: this.amount};
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;