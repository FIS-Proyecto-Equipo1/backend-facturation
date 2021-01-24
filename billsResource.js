const { json } = require('express');
const urljoin = require ('url-join');
const request = require ('request-promise-native').defaults({json:true});

class BillsResource {
    static billsUrl(resourceUrl){
        const billsServer = (process.env.BILLS_URL || "https://backend-facturacion-1.herokuapp.com");
        return urljoin (billsServer, resourceUrl);
    }

    static requestHeaders(){
        const billsKey = (process.env.BILLS_APIKEY || "WEFWEF");
        return {
            apikey : billsKey};
    }

    static postBills(id_client, id_vehicle, duration) {
        console.log("postBills " + matricula + ", " + estado)
        const url = BillsResource.billsUrl("/api/v1/bills");
        var body = {
            id_client: id_client,
            id_vehicle: id_vehicle,
            duration: duration,
            billStatus: "No pagado"
        }
        const options = {
            headers: BillsResource.requestHeaders(),
            body: body
        }
        return request.post(url, options);
    }
}
module.exports = BillsResource;