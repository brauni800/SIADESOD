const jwt = require('jsonwebtoken');
const RepositoryDentist = require('../repositories/RepositoryDentist');
const EnumUserType = require('../enums/EnumUserType');
const EnumGender = require('../enums/EnumGender');
const UserModel = require('../models/User');
const DentistModel = require('../models/Dentist');
const secret = require('../config').secretKey;

const verifyJWT = token => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) throw err;
    });
}

class ServiceDentist {
    /**
     * @param {String} token Token JWT.
     */
    constructor (token) {
        this.token = token;
    }
    /**
     * Registra un dentista en la base de datos.
     * @param {Object} dataUser Datos del usuario.
     * @param {String} dataUser.password Contraseña del dentista.
     * @param {String} dataUser.firstName Nombre del dentista.
     * @param {String} dataUser.lastName Apellido del dentista.
     * @param {String} dataUser.email Email del dentista.
     * @param {String} dataUser.dob Fecha de cumpleaños del dentista.
     * @param {String} dataUser.phone Número telefónico del dentista.
     * @param {String} dataUser.address Dirección de la vivienda del dentista.
     * @param {String} dataUser.gender Género del dentista.
     * @param {String} dataUser.rate Tarifa por hora de sueldo.
     * @param {String} dataUser.cedula Número de cedula profesional.
     * @param {String} dataUser.speciality Especialidad del dentista.
     */
    createDentist(dataUser) {
        verifyJWT(this.token);
        const user = new UserModel();
        user.password = dataUser.password;
        user.firstName = dataUser.firstName;
        user.lastName = dataUser.lastName;
        user.email = dataUser.email;
        user.dob = new Date(dataUser.dob);
        user.phone = dataUser.phone;
        user.address = dataUser.address;
        user.gender = dataUser.gender;
        user.userType = EnumUserType.DENTIST;
        user.admin = false;
        const dentist = new DentistModel();
        dentist.user = user;
        dentist.rate = dataUser.rate;
        dentist.cedula = dataUser.cedula;
        dentist.speciality = dataUser.speciality;
        return new RepositoryDentist().createDentist(dentist);
    }

    /**
     * Obtiene una lista de todos los dentistas en la base de datos.
     */
    getAllDentists() {
        verifyJWT(this.token);
        return new RepositoryDentist().getAll();
    }

    /**
     * Obtiene un dentista de la base de datos con base a su id.
     * @param {String} idDentist ID del dentista.
     */
    getDentist(idDentist) {
        verifyJWT(this.token);
        return new RepositoryDentist().getDentist(parseInt(idDentist, 10));
    }

    /**
     * Elimina un dentista de la base de datos con base a su id.
     * @param {String} idDentist ID del dentista.
     */
    deleteDentist(idDentist) {
        verifyJWT(this.token);
        return new RepositoryDentist().deleteDentist(parseInt(idDentist, 10));
    }

    /**
     * Edita un dentista de la base de datos.
     * @param {Number} idDentist ID del dentista que se desea editar.
     * @param {Object} dentist Datos del dentista que se desea editar.
     */
    editDentist(idDentist, dentist) {
        verifyJWT(this.token);
        if (dentist.gender !== undefined) {
            if (dentist.gender !== EnumGender.MALE && dentist.gender !== EnumGender.FEMALE) {
                throw 'Invalid Gender';
            }
        }
        if (dentist.dob !== undefined) {
            dentist.dob = new Date(dentist.dob);
        }
        if (dentist.rate !== undefined) {
            dentist.rate = parseInt(dentist.rate, 10);
        }
        return new RepositoryDentist().editDentist(parseInt(idDentist, 10), dentist);
    }
}

module.exports = ServiceDentist;