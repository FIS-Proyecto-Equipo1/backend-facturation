const mongoose = require ('mongoose');

mongoose.set('useFindAndModify',false);

const statusEnum = ['Pagado', 'No pagado'];
const BILL_NUMBER_REG_EX=new RegExp('[A-Z]{2}[0-9]{5}'); 

const billSchema = new mongoose.Schema({
    billNumber: {type: String, unique: true, match: BILL_NUMBER_REG_EX},
    id_client: {type: String},
    name: {type: String, required: true},
    surnames: {type: String, requiered: true},
    id_vehicle: {type: String},
    vehicle: {type: String, requiered: true},
    duration: {type: String, required: true},
    rate: {type: String},
    amount: {type: Number},
    billStatus: {type: String, required: true, enum: statusEnum},
});

billSchema.methods.cleanup = function(){
    return {
        billNumber: this.billNumber,
        id_client: this.id_client,
        name: this.name,
        surnames: this.surnames,
        id_vehicle: this.id_vehicle,
        vehicle: this.vehicle,
        duration: this.duration,
        rate: this.rate,
        amount: this.amount,
        billStatus: this.billStatus,
    }; 
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;