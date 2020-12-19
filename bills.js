const mongoose = require ('mongoose');

const billSchema = new mongoose.Schema({
    billStatus: String,
    rate: Number,
    amount: Number,
    id_travel: String,
    id_duration: String,
    id_user:String
});

billSchema.methods.cleanup = function(){
    return {
         billStatus: this.billStatus,
         rate: this.rate,
         amount: this.amount,
         id_travel: this.travel,
         id_duration: this.id_duration,
         id_user: this.id_user

        };
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;