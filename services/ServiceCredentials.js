const RepositoryCredentials = require('../repositories/RepositoryCredentials');

class ServiceCredentials {
    /**
     * Verifica si el usuario existe en los registros del sistema.
     * @param {Object} data Datos del usuario.
     * @param {String} data.email Email del usuario.
     * @param {String} data.password Contraseña del usuario.
     */
    verifyUser(data) {
        const { email, password } = data;
        if (!email) throw 'Email cannot be null';
        if (!password) throw 'Password cannot be null';
        let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegEx.test(email.toLowerCase())) throw 'Invalid email format';
        return new RepositoryCredentials().verifyAccount(email, password);
    }
}

module.exports = ServiceCredentials;