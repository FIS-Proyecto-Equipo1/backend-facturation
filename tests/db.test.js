const Bill = require('../bills.js');
const mongoose = require('mongoose');
const dbConnect = require('../db.js');

describe('Bill db connection', ()=>{

    beforeAll(()=>{
        return dbConnect(); 
    })

    beforeEach((done)=>{
        Bill.deleteMany({}, (err)=>{
            done();
        });
    });

    it('writes a bill in the DB', (done)=>{
        const bill = new Bill({"billNumber": "US25677", 
        "name": "Kevin", 
        "surnames": "Segura", 
        "vehicle":"Patin", 
        "duration": "00:14:00", 
        "rate":"",
        "amount":"" ,
        "billStatus":"No pagado" })
        bill.save((err, bill) => {
            expect(err).toBeNull();
            Bill.find({}, (err, bills) => {
                expect(bills).toBeArrayOfSize(1);
                done();
            });
        });
    })

    afterAll((done) => {
        mongoose.connection.db.DropDatabase(() => {
            mongoose.connection.close(done);
        })
    })
})