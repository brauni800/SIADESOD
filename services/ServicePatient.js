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
     * @param {Object} data Datos del paciente que se desea editar. Si algún dato es undefined
     * no se incluirá en el query. Determina de manera dinámica la tabla que se editará.
     */
    editPatient(idPatient, { password, firstName, lastName, email, dob, phone, address, gender, curp, insurances, allergies }) {
        let queryUserFields = '', queryPatientFields = '';
        let userValues = [], patientValues = [];
        if (password !== undefined) {
            queryUserFields += 'PASSWORD = ?,';
            userValues.push(password);
        }
        if (firstName !== undefined) {
            queryUserFields += 'FIRST_NAME = ?,';
            userValues.push(firstName);
        }
        if (lastName !== undefined) {
            queryUserFields += 'LAST_NAME = ?,';
            userValues.push(lastName);
        }
        if (email !== undefined) {
            queryUserFields += 'EMAIL = ?,';
            userValues.push(email);
        }
        if (dob !== undefined) {
            queryUserFields += 'DATE_OF_BIRTH = ?,';
            userValues.push(dob);
        }
        if (phone !== undefined) {
            queryUserFields += 'PHONE = ?,';
            userValues.push(phone);
        }
        if (address !== undefined) {
            queryUserFields += 'ADDRESS = ?,';
            userValues.push(address);
        }
        if (gender !== undefined) {
            queryUserFields += 'GENDER = ?,';
            userValues.push(gender);
        }
        if (curp !== undefined) {
            queryPatientFields += 'CURP = ?,';
            patientValues.push(curp);
        }
        if (insurances !== undefined) {
            queryPatientFields += 'INSURANCES = ?,';
            patientValues.push(insurances);
        }
        if (allergies !== undefined) {
            queryPatientFields += 'ALLERGIES = ?,';
            patientValues.push(allergies);
        }

        if (userValues.length > 0) {
            if (patientValues.length > 0) {
                let queryUser = `UPDATE USER SET ${queryUserFields.slice(0, queryUserFields.length - 1)} WHERE ID_USER = ?;`;
                let queryPatient = `UPDATE PATIENT SET ${queryPatientFields.slice(0, queryPatientFields.length - 1)} WHERE ID_PATIENT = ?;`;
                userValues.push(parseInt(idPatient, 10));
                patientValues.push(parseInt(idPatient, 10));
                return new RepositoryPatient().editBothEntities(queryUser, userValues, queryPatient, patientValues);
            } else {
                let queryUser = `UPDATE USER SET ${queryUserFields.slice(0, queryUserFields.length - 1)} WHERE ID_USER = ?;`;
                userValues.push(parseInt(idPatient, 10));
                return new RepositoryPatient().editOneEntity(queryUser, userValues);
            }
        } else {
            if (patientValues.length > 0) {
                let queryPatient = `UPDATE PATIENT SET ${queryPatientFields.slice(0, queryPatientFields.length - 1)} WHERE ID_PATIENT = ?;`;
                patientValues.push(parseInt(idPatient, 10));
                return new RepositoryPatient().editOneEntity(queryPatient, patientValues);
            } else {
                throw 'Nothing to update';
            }
        }
    }
}

module.exports = ServicePatient;