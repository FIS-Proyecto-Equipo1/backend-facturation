const urljoin = require('url-join')
const request = require('request-promise-native').defaults({json: true})


class UsersResource {
    static STATUS_DISPONIBLE = "DISPONIBLE"
    
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
        const options = {
            headers: UsersResource.requestHeaders()
        }
        return request.get(url, options);
    }
}


module.exports = UsersResource;