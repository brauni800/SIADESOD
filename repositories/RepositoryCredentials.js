const BasicCRUD = require('./BasicCRUD');

class RepositoryCredentials {
    /**
     * Busca en la base de datos un usuario que coincida con los
     * valores proporcionados.
     * @param {String} email Email del usuario
     * @param {String} password Contraseña del usuario
     */
    verifyAccount(email, password) {
        let select = 'u.EMAIL AS email, u.ID_USER AS id, u.TYPE AS userType, u.ADMIN AS admin';
        let from = 'USER  u';
        let options = `WHERE u.EMAIL = '${email}' AND u.PASSWORD = '${password}'`;
        return new BasicCRUD().read(select, from, options);
    }
}

module.exports = RepositoryCredentials;