const BasicCRUD = require('./BasicCRUD');
const PatientModel = require('../models/Patient');
const EnumUserType = require('../enums/EnumUserType');
const EnumGender = require('../enums/EnumGender');

class RepositoryPatient {
    /**
     * Crea un paciente en la base de datos por medio de una transacción.
     * Si ocurre un fallo mientras se está creando el paciente se realizará
     * un rollback y no se insertarán datos en las tablas.
     * @param {PatientModel} data Datos del paciente.
     */
    createPatient(data) {
        const user = {
            table: 'USER',
            columns: [
                'PASSWORD',
                'FIRST_NAME',
                'LAST_NAME',
                'EMAIL',
                'DATE_OF_BIRTH',
                'PHONE',
                'ADDRESS',
                'GENDER',
                'TYPE',
                'ADMIN',
            ],
            values: [
                data.user.password,
                data.user.firstName,
                data.user.lastName,
                data.user.email,
                data.user.dob,
                data.user.phone,
                data.user.address,
                data.user.gender,
                data.user.userType,
                data.user.admin,
            ],
        }
        const patient = {
            table: 'PATIENT',
            columns: [
                'ID_PATIENT',
                'CURP',
                'INSURANCES',
                'ALLERGIES',
            ],
            values: [
                data.curp,
                data.insurances,
                data.allergies,
            ],
        }
        return new BasicCRUD().createMany(user, patient);
    }

    /**
     * Obtiene una lista de todos los pacientes en la base de datos.
     */
    getAll() {
        const select = ''
        + ' u.ID_USER AS id,'
        + ' u.FIRST_NAME AS firstName,'
        + ' u.LAST_NAME AS lastName,'
        + ' u.EMAIL AS email,'
        + ' u.DATE_OF_BIRTH AS dob,'
        + ' u.PHONE AS phone,'
        + ' u.ADDRESS AS address,'
        + ' u.GENDER AS gender,'
        + ' u.TYPE AS userType,'
        + ' p.CURP AS curp,'
        + ' p.INSURANCES AS insurances,'
        + ' p.ALLERGIES AS allergies';
        const from = 'USER u';
        const options = 'JOIN PATIENT p ON u.ID_USER = p.ID_PATIENT';
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Obtiene un paciente de la base de datos con base a su id.
     * @param {Number} idPatient ID del paciente.
     */
    getPatient(idPatient) {
        const select = ''
        + ' u.ID_USER AS id,'
        + ' u.FIRST_NAME AS firstName,'
        + ' u.LAST_NAME AS lastName,'
        + ' u.EMAIL AS email,'
        + ' u.DATE_OF_BIRTH AS dob,'
        + ' u.PHONE AS phone,'
        + ' u.ADDRESS AS address,'
        + ' u.GENDER AS gender,'
        + ' u.TYPE AS userType,'
        + ' p.CURP AS curp,'
        + ' p.INSURANCES AS insurances,'
        + ' p.ALLERGIES AS allergies';
        const from = 'USER u';
        const options = `JOIN PATIENT p ON u.ID_USER = p.ID_PATIENT AND u.ID_USER = ${idPatient}`;
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Elimina un paciente de la base de datos.
     * @param {Number} idPatient ID del paciente.
     */
    deletePatient(idPatient) {
        const table = 'USER';
        const options = {
            'ID_USER': idPatient,
            'TYPE': EnumUserType.PATIENT,
        }
        return new BasicCRUD().delete(table, options);
    }

    /**
     * Actualiza un paciente en la base de datos.
     * @param {Number} idPatient ID del paciente que se desea actualizar.
     * @param {Object} patient Objeto con los datos del paciente que serán actualizados.
     * @param {String} [patient.password] Contraseña del paciente.
     * @param {String} [patient.firstName] Nombre del paciente.
     * @param {String} [patient.lastName] Apellido del paciente.
     * @param {String} [patient.email] Email del paciente.
     * @param {Date} [patient.dob] Fecha de cumpleaños del paciente.
     * @param {String} [patient.phone] Número de teléfono de contacto del paciente.
     * @param {String} [patient.address] Dirección de la vivienda del paciente.
     * @param {EnumGender} [patient.gender] Género del paciente.
     * @param {String} [patient.curp] CURP del paciente.
     * @param {String} [patient.insurances] Número de seguro del paciente.
     * @param {String} [patient.allergies] Alergias del paciente.
     */
    editPatient(idPatient, patient) {
        let dataUser = {}, dataPatient = {};
        if (patient.password !== undefined) dataUser['PASSWORD'] = patient.password;
        if (patient.firstName !== undefined) dataUser['FIRST_NAME'] = patient.firstName;
        if (patient.lastName !== undefined) dataUser['LAST_NAME'] = patient.lastName;
        if (patient.email !== undefined) dataUser['EMAIL'] = patient.email;
        if (patient.dob !== undefined) dataUser['DATE_OF_BIRTH'] = patient.dob;
        if (patient.phone !== undefined) dataUser['PHONE'] = patient.phone;
        if (patient.address !== undefined) dataUser['ADDRESS'] = patient.address;
        if (patient.gender !== undefined) dataUser['GENDER'] = patient.gender;
        if (patient.curp !== undefined) dataPatient['CURP'] = patient.curp;
        if (patient.insurances !== undefined) dataPatient['INSURANCES'] = patient.insurances;
        if (patient.allergies !== undefined) dataPatient['ALLERGIES'] = patient.allergies;

        if (Object.keys(dataUser).length > 0) {
            if (Object.keys(dataPatient).length > 0) {
                let user = {
                    table: 'USER',
                    data: dataUser,
                    where: {
                        query: 'ID_USER = ?',
                        values: [idPatient],
                    },
                }
                let patient = {
                    table: 'PATIENT',
                    data: dataPatient,
                    where: {
                        query: 'ID_PATIENT = ?',
                        values: [idPatient],
                    },
                }
                return new BasicCRUD().updateMany(user, patient);
            } else {
                let where = {
                    query: 'ID_USER = ?',
                    values: [idPatient],
                }
                return new BasicCRUD().updateOne('USER', dataUser, where);
            }
        } else {
            if (Object.keys(dataPatient).length > 0) {
                let where = {
                    query: 'ID_PATIENT = ?',
                    values: [idPatient],
                }
                return new BasicCRUD().updateOne('PATIENT', dataPatient, where);
            } else {
                throw 'Nothing to update';
            }
        }
    }
}

module.exports = RepositoryPatient;