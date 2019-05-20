const jwt = require('jsonwebtoken');
const RepositoryPatient = require('../repositories/RepositoryPatient');
const EnumGender = require('../enums/EnumGender');
const EnumUserType = require('../enums/EnumUserType');
const UserModel = require('../models/User');
const PatientModel = require('../models/Patient');
const secret = require('../config').secretKey;

const verifyJWT = token => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) throw err;
    });
}

class ServicePatient {
    /**
     * @param {String} token Token JWT.
     */
    constructor (token) {
        this.token = token;
    }
    /**
     * Registra un paciente en la base de datos.
     * @param {Object} dataUser Datos del paciente.
     * @param {String} dataUser.password Contraseña del paciente.
     * @param {String} dataUser.firstName Nombre del paciente.
     * @param {String} dataUser.lastName Apellido del paciente.
     * @param {String} dataUser.email Email del paciente.
     * @param {String} dataUser.dob Fecha de cumpleaños del paciente.
     * @param {String} dataUser.phone Número telefónico del paciente.
     * @param {String} dataUser.address Dirección de la vivienda del paciente.
     * @param {String} dataUser.gender Género del paciente.
     * @param {String} dataUser.curp CURP del paciente.
     * @param {String} dataUser.insurances Número de seguro del paciente.
     * @param {String} dataUser.allergies Alergias del paciente.
     */
    ceratePatient(dataUser) {
        verifyJWT(this.token);
        if (dataUser.gender !== EnumGender.MALE && dataUser.gender !== EnumGender.FEMALE) {
            throw 'Invalid Gender';
        }
        const user = new UserModel();
        user.password = dataUser.password;
        user.firstName = dataUser.firstName;
        user.lastName = dataUser.lastName;
        user.email = dataUser.email;
        user.dob = new Date(dataUser.dob);
        user.phone = dataUser.phone;
        user.address = dataUser.address;
        user.gender = dataUser.gender;
        user.userType = EnumUserType.PATIENT;
        user.admin = false;
        const patient = new PatientModel();
        patient.user = user;
        patient.curp = dataUser.curp;
        patient.insurances = dataUser.insurances;
        patient.allergies = dataUser.allergies;
        return new RepositoryPatient().createPatient(patient);
    }

    /**
     * Obtiene una lista de todos los pacientes en la base de datos.
     */
    getAllPatients() {
        verifyJWT(this.token);
        return new RepositoryPatient().getAll();
    }

    /**
     * Obtiene un paciente de la base de datos con base a su id.
     * @param {String} idPatient ID del paciente.
     */
    getPatient(idPatient) {
        verifyJWT(this.token);
        return new RepositoryPatient().getPatient(parseInt(idPatient, 10));
    }

    /**
     * Elimina un paciente de la base de datos, previamente convierte el ID del paciente en un Number.
     * @param {String} idPatient ID del paciente.
     */
    deletePatient(idPatient) {
        verifyJWT(this.token);
        return new RepositoryPatient().deletePatient(parseInt(idPatient, 10));
    }

    /**
     * Edita un paciente de la base de datos.
     * @param {String} idPatient ID del paciente que se desea editar.
     * @param {Object} patient Datos del paciente que se desea editar.
     */
    editPatient(idPatient, patient) {
        verifyJWT(this.token);
        if (patient.gender !== undefined) {
            if (patient.gender !== EnumGender.MALE && patient.gender !== EnumGender.FEMALE) {
                throw 'Invalid Gender';
            }
        }
        if (patient.dob !== undefined) {
            patient.dob = new Date(patient.dob);
        }
        return new RepositoryPatient().editPatient(parseInt(idPatient, 10), patient);
    }
}

module.exports = ServicePatient;