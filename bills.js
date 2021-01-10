const mongoose = require ('mongoose');

mongoose.set('useFindAndModify',false);

const statusEnum = ['Pagado', 'No pagado'];
const BILL_NUMBER_REG_EX=new RegExp('[A-Z]{2}[0-9]{5}'); 

const billSchema = new mongoose.Schema({
    billNumber: {type: String, unique: true, required: true, match: BILL_NUMBER_REG_EX},
    name: {type: String, required: true},
    surnames: {type: String, required: true},
    vehicle: {type: String, required: true},
    duration: {type: String},
    rate: {type: String},
    amount: {type: Number},
    billStatus: {type: String, required: true, enum: statusEnum},
});

function rateCalculation (vehicle){
    let rate;
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
    let conversion;
    switch(rate){
        case 3:
            conversion = 15;
            break;
        case 2:
            conversion = 10;
            break;
         case 1:
            conversion = 5;
            break;
        default:
            console.error("Not admitted rate!!"); 
            break;

    }
    return conversion
}

function durationMinutesConversion (duration){
    let durationSplited = duration.split(":");
    let hours = parseInt(durationSplited[0] * 60);
    let min = parseInt(durationSplited[1]);
    let sec = 1;
    if(parseInt(durationSplited[2]) === 0){
        sec = 0;
    }
    return hours+min+sec;
}

function amountCalculation (duration, vehicle){
    let rate = rateCalculation(vehicle);
    let minTax = 1.25;
    let amount = rateConversion(rate) * durationMinutesConversion(duration);
    if(amount/100>=minTax){
        return amount;
    } else{
        return minTax;
    }
}

billSchema.methods.cleanup = function(){
    return {
        billNumber: this.billNumber,
        name: this.name,
        surnames: this.surnames,
        vehicle: this.vehicle,
        duration: this.duration,
        rate: rateCalculation(this.vehicle),
        amount: amountCalculation(this.duration,this.vehicle),
        billStatus: this.billStatus,
    }; 
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;