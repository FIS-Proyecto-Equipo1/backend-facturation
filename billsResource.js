/*const { json } = require('express');
const urljoin = require ('url-join');
const request = require ('request-promise-native').defaults({json:true});

class BillsResource {
    static billsUrl(resourceUrl){
        const billsServer = (process.env.BILLS_URL || "http://localhost:3000/api/v1");
        return urljoin (billsServer, resourceUrl);
    }

    static requestHeaders(){
        const billsKey = (process.env.BILLS_APIKEY || "WEFWEF");
        return {
            apikey : billsKey};
    }

    static getAllBills() {
        const url = BillsResource.billsUrl("/bills");
        const options = {
            headers: BillsResource.requestHeaders()
        }
        return request.get(url, options);
        
    }
}
module.exports = BillsResource;*/