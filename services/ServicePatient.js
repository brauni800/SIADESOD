const RepositoryPatient = require('../repositories/RepositoryPatient');
const EnumGender = require('../enums/EnumGender');
const EnumUserType = require('../enums/EnumUserType');
const UserModel = require('../models/User');
const PatientModel = require('../models/Patient');

class ServicePatient {
    /**
     * Registra un paciente en la base de datos.
     * @param {Object} data Datos del paciente.
     */
    ceratePatient({ password, firstName, lastName, email, dob, phone, address, gender, curp, insurances, allergies }) {
        if (gender !== EnumGender.MALE && gender !== EnumGender.FEMALE) {
            throw 'Invalid Gender';
        }
        const user = new UserModel();
        user.password = password;
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.dob = new Date(dob);
        user.phone = phone;
        user.address = address;
        user.gender = gender;
        user.userType = EnumUserType.PATIENT;
        user.admin = false;
        const patient = new PatientModel();
        patient.user = user;
        patient.curp = curp;
        patient.insurances = insurances;
        patient.allergies = allergies;
        return new RepositoryPatient().createPatient(patient);
    }

    /**
     * Obtiene una lista de todos los pacientes en la base de datos.
     */
    getAllPatients() {
        return new RepositoryPatient().getAll();
    }

    /**
     * Obtiene un paciente de la base de datos con base a su id.
     * @param {String} idPatient ID del paciente.
     */
    getPatient(idPatient) {
        return new RepositoryPatient().getPatient(parseInt(idPatient, 10));
    }

    /**
     * Elimina un paciente de la base de datos, previamente convierte el ID del paciente en un Number.
     * @param {String} idPatient ID del paciente.
     */
    deletePatient(idPatient) {
        return new RepositoryPatient().deletePatient(parseInt(idPatient, 10));
    }

    /**
     * Edita un paciente de la base de datos.
     * @param {String} idPatient ID del paciente que se desea editar.
     * @param {Object} patient Datos del paciente que se desea editar.
     */
    editPatient(idPatient, patient) {
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