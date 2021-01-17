const app = require('../server.js');
const request = require('supertest');
const Bill = require('../bills.js');

jest.setTimeout(30000);

describe("Bills API", () => {


    describe("GET /", () => {
        it("should return html", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe("GET /bills", () => {
        let dbFind;
        let dbFindOne;
        let billOk;

        beforeAll( () => {
            const bills = [
                new Bill({"billNumber": "US01322", 
                "name": "Maria", 
                "surnames": "Suárez", 
                "vehicle":"Coche", 
                "duration": "00:12:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
                new Bill({"billNumber": "US06772", 
                "name": "Pedro", 
                "surnames": "Cano", 
                "vehicle":"Bici", 
                "duration": "00:23:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
            ];

            dbFind = jest.spyOn(Bill, "find");
            dbFind.mockImplementation(({}, callback) => {
                callback(null, bills);
            });

            billOK = bills[0];

            dbFindOne = jest.spyOn(Bill, "findOne");
            dbFindOne.mockImplementation((filter, callback) => {
                callback(null, billOk);
            });

        });

        it("Should return bills", () => {
            return request(app).get('/api/v1/bills').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });            
        })

        it("should not return any bill", () => {
            dbFindOne.mockImplementation((filter, callback) => {
                callback(null, null);
            })
            return request(app).get('/api/v1/bills/zxwef').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindOne).toBeCalledWith({"billNumber":"zxwef"}, expect.any(Function));
            });
        })
    });

    describe("POST /bills", () => {
        const bill = {"billNumber": "US03982", 
        "name": "Sara", 
        "surnames": "Cano", 
        "vehicle":"Moto", 
        "duration": "00:33:00", 
        "rate":"",
        "amount":"" ,
        "billStatus":"Pagado"};
        let dbInsert;
         
        beforeEach(() => {
            dbInsert = jest.spyOn(Bill, "create");
        })


        it ("should add a new bill", () => {
           dbInsert.mockImplementation((c, callback) => {
               callback(false);
           });

           return request(app).post('/api/v1/bills').send(bill).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(bill, expect.any(Function));
           });

        });

        it('should return 500 if any error occurred', ()=>{
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post('/api/v1/bills').send(bill).then((response) => {
                expect(response.statusCode).toBe(500);
           });
        });
    });

    describe("DELETE /bills/:billNumber", () => {
        let dbDelete;
        let billOK;

        beforeAll( () => {
            const bills = [
                new Bill({"billNumber": "US31122", 
                "name": "Maria", 
                "surnames": "Suárez", 
                "vehicle":"Coche", 
                "duration": "00:12:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
                new Bill({"billNumber": "US05677", 
                "name": "Pedro", 
                "surnames": "Cano", 
                "vehicle":"Bici", 
                "duration": "00:23:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
            ];
            
            billOK = bills[0];

            dbDelete = jest.spyOn(Bill, "findOneAndDelete");
            dbDelete.mockImplementation(({}, callback) => {
                callback(null, billOK);
            });
        });

        it('should delete one bill', ()=>{
            return request(app).delete('/api/v1/bills/'+billOK.billNumber).then((response) => {
                expect(response.statusCode).toBe(204);
                expect(String(response.body)).toMatch(String(billOK.cleanup()));
                expect(dbDelete).toBeCalledWith({"billNumber":billOK.billNumber}, expect.any(Function));
           });
        });

        it('should not delete any bill', ()=>{
            dbDelete.mockImplementation(({}, callback) => {
                callback(null, null);
            });
            return request(app).delete('/api/v1/bills/rgerg').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(String(response.body)).toMatch(String({}));
                expect(dbDelete).toBeCalledWith({"billNumber":"rgerg"}, expect.any(Function));
           });
        });
    });

    describe("PUT /bills/:billNumber", () => {
        let dbPut;
        let billOK;
        let billUp;
        
        beforeAll( () => {
            const bills = [
                new Bill({"billNumber": "US09122", 
                "name": "Maria", 
                "surnames": "Suárez", 
                "vehicle":"Coche", 
                "duration": "00:12:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
                new Bill({"billNumber": "US85677", 
                "name": "Pedro", 
                "surnames": "Cano", 
                "vehicle":"Bici", 
                "duration": "00:23:00", 
                "rate":"",
                "amount":"" ,
                "billStatus":"Pagado"}),
            ];
            
            billOK = bills[0];
            billUp =  new Bill({"billNumber": "US45677", 
            "name": "Kiko", 
            "surnames": "Cano", 
            "vehicle":"Patin", 
            "duration": "00:14:00", 
            "rate":"",
            "amount":"" ,
            "billStatus":"No pagado" });
            
            dbPut = jest.spyOn(Bill, "findOneAndUpdate");
            dbPut.mockImplementation((filter, update_bill, validators, callback) => {
                callback(null, billUp);
            });
        });

        it('should modify and return one bill', ()=>{
            return request(app).put('/api/v1/bills/'+billOK.billNumber).send(billUp).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(String(response.body)).toMatch(String(billOK.cleanup()));
                expect(dbPut).toBeCalledWith({"billNumber":billOK.billNumber}, expect.any(Object), {"runValidators": true} ,expect.any(Function));
           });
        });
    });
});