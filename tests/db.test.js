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
        const bill = new Bill({ 
            "billNumber": "US67864",
            "id_client": "5ffaf5695dc3ce0fa81f16b2",
            "name": "Juan Luis",
            "surnames": "Montes",
            "id_vehicle": "6743TRG",
            "vehicle": "Patin",
            "duration": "00:12:00",
            "rate": "1",
            "amount": 1.25,
            "billStatus": "No pagado" })
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