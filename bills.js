const mongoose = require ('mongoose');

mongoose.set('useFindAndModify',false);

const statusEnum = ['Pagado', 'No pagado'];
const BILL_NUMBER_REG_EX=new RegExp('[A-Z]{2}[0-9]{5}'); 

const billSchema = new mongoose.Schema({
    billNumber: {type: String, unique: true, required: true, match: BILL_NUMBER_REG_EX},
    name: {type: String, required: true},
    surnames: {type: String, required: true},
    vehicle: {type: String, required: true},
    duration: {type: String, required: true},
    rate: {type: String, required: true},
    amount: {type: Number},
    billStatus: {type: String, required: true, enum: statusEnum},
});

function rateCalculation (vehicle){
    var rate;
    switch(vehicle){
        case "Coche":
            rate = 3;
            break;
        case "Moto":
            rate = 2;
            break;
        case "Bici":
            rate = 1;
            break;
        default:
            rate = 1;   
            break;  
    }
    return rate;
}

function rateConversion(rate){
    var conversion;
    switch(rate){
        case 3:
            conversion = 50;
            break;
        case 2:
            conversion = 30;
            break;
         case 1:
            conversion = 10;
            break;
        default:
            console.error("Not admitted rate!!"); 
            break;

    }
    return conversion
}

function durationMinutesConversion (duration){
    let durationSplited = duration.split(":");
    var hours = durationSplited[0] * 60;
    var min = durationSplited[1];
    var sec = 1;
    if(durationSplited[2] === 0){
        sec = 0;
    }
    return hours+min+sec;
}

function amountCalculation (duration, vehicle){
    var rate = rateCalculation(vehicle);
    return rateConversion(rate) * durationMinutesConversion(duration);
}

billSchema.methods.cleanup = function(){
    return {
        billNumber: this.billNumber,
        name: this.name,
        surnames: this.surnames,
        vehicle: this.vehicle,
        duration: this.duration,
        rate: this.rate,
        amount: amountCalculation(this.duration,this.vehicle),
        billStatus: this.billStatus,
    }; 
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;