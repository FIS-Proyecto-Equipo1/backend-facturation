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

        beforeAll(() => {
            const bills = [
                new Bill({
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:15:00",
                    "billStatus": "No pagado"
                }),
                new Bill({
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:25:00",
                    "billStatus": "No pagado"
                }),
            ];

            dbFind = jest.spyOn(Bill, "find");
            dbFind.mockImplementation(({ }, callback) => {
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
            return request(app).get('/api/v1/bills/US9999').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFindOne).toBeCalledWith({ "billNumber": "US9999" }, expect.any(Function));
            });
        })
    });

    describe("POST /bills", () => {
        const bill = {
            "billNumber": "US17768",
            "id_client": "5ffaf5695dc3ce0fa81f16b2",
            "id_vehicle": "6743TRG",
            "duration": "00:12:00",
            "billStatus": "No pagado"
        };

        const billPosted = {
        "amount": 1.25,
        "billNumber": "US17768",
        "billStatus": "No pagado",
        "duration": "00:12:00",
        "id_client": "5ffaf5695dc3ce0fa81f16b2",
        "id_vehicle": "6743TRG",
        "name": "Juan Luis",
        "rate": 1,
        "surnames": "Montes",
        "vehicle": "Patin",
        };
        let dbInsert;

        beforeEach(() => {
            dbInsert = jest.spyOn(Bill, "create");
        })


        it("should add a new bill", () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false);
            });

            return request(app).post('/api/v1/bills').send(bill).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbInsert).toBeCalledWith(billPosted, expect.any(Function));
            });

        });

        it('should return 500 if any error occurred', () => {
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

        beforeAll(() => {
            const bills = [
                new Bill({
                    "billNumber":"US3233",
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:15:00",
                    "billStatus": "No pagado"
                }),

                new Bill({
                    "billNumber":"US3233",
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:15:00",
                    "billStatus": "No pagado"
                }),
            ];

            billOK = bills[0];

            dbDelete = jest.spyOn(Bill, "findOneAndDelete");
            dbDelete.mockImplementation(({ }, callback) => {
                callback(null, billOK);
            });
        });

        it('should delete one bill', () => {
            return request(app).delete('/api/v1/bills/' + billOK.billNumber).then((response) => {
                expect(response.statusCode).toBe(204);
                expect(String(response.body)).toMatch(String(billOK.cleanup()));
                expect(dbDelete).toBeCalledWith({ "billNumber": billOK.billNumber }, expect.any(Function));
            });
        });

        it('should not delete any bill', () => {
            dbDelete.mockImplementation(({ }, callback) => {
                callback(null, null);
            });
            return request(app).delete('/api/v1/bills/US9999').then((response) => {
                expect(response.statusCode).toBe(404);
                expect(String(response.body)).toMatch(String({}));
                expect(dbDelete).toBeCalledWith({ "billNumber": "US9999" }, expect.any(Function));
            });
        });
    });

    describe("PUT /bills/:billNumber", () => {
        let dbPut;
        let billOK;
        let billUp;

        beforeAll(() => {
            const bills = [
                new Bill({
                    "billNumber":"US3233",
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:15:00",
                    "billStatus": "No pagado"
                }),
                new Bill({
                    "billNumber":"US3233",
                    "id_client": "5ffaf5695dc3ce0fa81f16b2",
                    "id_vehicle": "4532CDR",
                    "duration": "00:30:00",
                    "billStatus": "No pagado"
                }),
            ];

            billOK = bills[0];
            billUp = new Bill({
                "id_client": "5ffaf5695dc3ce0fa81f16b2",
                "id_vehicle": "4532CDR",
                "duration": "00:15:00",
                "billStatus": "Pagado"
            });

            dbPut = jest.spyOn(Bill, "findOneAndUpdate");
            dbPut.mockImplementation((filter, update_bill, validators, callback) => {
                callback(null, billUp);
            });
        });

        it('should modify and return one bill', () => {
            return request(app).put('/api/v1/bills/' + billOK.billNumber).send(billUp).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(String(response.body)).toMatch(String(billOK.cleanup()));
                expect(dbPut).toBeCalledWith({ "billNumber": billOK.billNumber }, expect.any(Object), { "runValidators": true }, expect.any(Function));
            });
        });
    });
});