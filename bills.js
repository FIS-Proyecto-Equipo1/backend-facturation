const mongoose = require ('mongoose');

const billSchema = new mongoose.Schema({
    user: String,
    billStatus: String,
    rate: Number,
    amount: Number,
    travel: String,
    duration: String
});

billSchema.methods.cleanup = function(){
    return {
        user: this.id_user,
         billStatus: this.billStatus,
         rate: this.rate,
         amount: this.amount,
         travel: this.travel,
         duration: this.id_duration
        };
}

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;