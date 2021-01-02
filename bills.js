const mongoose = require ('mongoose');

const statusEnum = ['PAID', 'UNPAID'];

const billSchema = new mongoose.Schema({
    billNumber: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    surnames: {type: String, required: true},
    vehicle: {type: String, required: true},
    duration: {type: String, required: true},
    rate: {type: String, required: true},
    amount: {type: Number, required: true},
    billStatus: {type: String, required: true, enum: statusEnum},
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