const mongoose = require ('mongoose');

const billSchema = new mongoose.Schema({
    billNumber: String,
    name: String,
    surnames: String,
    vehicle: String,
    duration: String,
    rate: Number,
    amount: Number,
    billStatus: String,
});

billSchema.methods.cleanup = function(){
    return {
        billNumber: this.billNumber,
        name: this.name,
        surnames: this.surnames,
        vehicle: this.vehicle,
        duration: this.duration,
        rate: this.rate,
        amount: this.amount,
        billStatus: this.billStatus,
    };
    
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;