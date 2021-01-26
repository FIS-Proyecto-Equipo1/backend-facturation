const urljoin = require('url-join')
const request = require('request-promise-native').defaults({json: true})


class UsersResource {
    
    static usersUrl(resourceUrl) {
        const usersServer = (process.env.AUTENTICACION_URL || 'https://urbanio-autenticacion.herokuapp.com');
        return urljoin(usersServer, resourceUrl);
    }


    static requestHeaders() {
        return {};
    }

    static getUser(userId) {
        console.log("getUsuario " + userId)
        const url = UsersResource.usersUrl("/api/v1/user/" + userId);
        console.log(url)
        var body = {
            rol: this.rol,
            email: this.email,
            nombre: this.nombre,
            apellidos: this.apellidos,
            telefono: this.telefono,
            cuentaBancaria: this.cuentaBancaria,
            permiso: this.permiso,
            userId: this.userId
        }
    
        const options = {
            headers: UsersResource.requestHeaders(),
            body: body
        }
        return request.get(url, options);
    }
}


module.exports = UsersResource;