const urljoin = require('url-join')
const request = require('request-promise-native').defaults({json: true})


class VehiclesResource {
    static STATUS_DISPONIBLE = "DISPONIBLE"
    static STATUS_RESERVADO = "RESERVADO"
    static STATUS_TRAYECTO = "TRAYECTO"
    
    static vehiclesUrl(resourceUrl) {
        const vehiclesServer = (process.env.VEHICULOS_URL || 'https://urbanio-vehiculos.herokuapp.com');
        return urljoin(vehiclesServer, resourceUrl);
    }


    static requestHeaders() {
        return {
            "x-role": "ADMIN",
            "rol": "ADMIN"
        };
    }

    static getVehicle(matricula) {
        console.log("getVehicle " + matricula)
        const url = VehiclesResource.vehiclesUrl("/api/v1/vehicles/" + matricula);

        var body = {
            matricula: matricula,
            tipo: this.tipo,
            estado: this.estado,
            permiso: this.permiso,
            localizacion: this.localizacion
        }
        const options = {
            headers: VehiclesResource.requestHeaders(),
            body: body
        }
        return request.get(url, options);
    }
}


module.exports = VehiclesResource;