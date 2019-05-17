const connection = require('../database');
const PatientModel = require('../models/Patient');
const EnumUserType = require('../enums/EnumUserType');

class RepositoryPatient {

    /**
     * Crea un paciente en la base de datos por medio de una transacción.
     * Si ocurre un fallo mientras se está creando el paciente se realizará
     * un rollback y no se insertarán datos en las tablas.
     * @param {PatientModel} patient Datos del paciente.
     */
    createPatient(patient) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) reject(error);
                let sql = ''
                    + ' INSERT INTO USER'
                    + ' (PASSWORD, FIRST_NAME, LAST_NAME, EMAIL, DATE_OF_BIRTH, PHONE, ADDRESS, GENDER, TYPE, ADMIN)'
                    + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                let values = [
                    patient.user.password,
                    patient.user.firstName,
                    patient.user.lastName,
                    patient.user.email,
                    patient.user.dob,
                    patient.user.phone,
                    patient.user.address,
                    patient.user.gender,
                    patient.user.userType,
                    patient.user.admin,
                ];
                connection.query(sql, values, (error, results) => {
                    if (error) return connection.rollback(() => reject(error));
                    sql = ''
                    + ' INSERT INTO PATIENT'
                    + ' (ID_PATIENT, CURP, INSURANCES, ALLERGIES)'
                    + ' VALUES (?, ?, ?, ?);';
                    values = [
                        results.insertId,
                        patient.curp,
                        patient.insurances,
                        patient.allergies,
                    ];
                    connection.query(sql, values, (error, results) => {
                        if (error) return connection.rollback(() => reject(error));
                        connection.commit(error => {
                            if (error) return connection.rollback(() => reject(error));
                            resolve(results);
                        });
                    });
                });
            });
        });
    }

    /**
     * Obtiene una lista de todos los pacientes en la base de datos.
     */
    getAll() {
        return new Promise((resolve, reject) => {
            const sql = ''
            + ' SELECT'
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
            + ' p.ALLERGIES AS allergies'
            + ' FROM USER u'
            + ' JOIN PATIENT p ON u.ID_USER = p.ID_PATIENT;';
            connection.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Obtiene un paciente de la base de datos con base a su id.
     * @param {Number} idPatient ID del paciente.
     */
    getPatient(idPatient) {
        return new Promise((resolve, reject) => {
            const sql = ''
            + ' SELECT'
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
            + ' p.ALLERGIES AS allergies'
            + ' FROM USER u'
            + ' JOIN PATIENT p ON u.ID_USER = p.ID_PATIENT'
            + ' AND u.ID_USER = ?;';
            const values = [idPatient];
            connection.query(sql, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Elimina un paciente de la base de datos.
     * @param {Number} idPatient ID del paciente.
     */
    deletePatient(idPatient) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USER WHERE ID_USER = ? AND TYPE = ?;';
            const values = [idPatient, EnumUserType.PATIENT];
            connection.query(sql, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Actualiza una entidad de la base de datos. Se deberá pasar como parámetro el query que será compilado.
     * @param {String} query Query que será compilado en la base de datos.
     * @param {String[]} values Arreglo de valores que serán actualizados en la base de datos.
     */
    editOneEntity(query, values) {
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Actualiza dos entidades de la base de datos por medio de una transacción,
     * si ocurre un fallo mientras se ejecutan los scripts, se realizará un rollback
     * y no se guardarán datos en las tablas. Los querys y datos que se desean utilizar
     * se deberán pasar como parámetro.
     * @param {String} queryUser Query de la primera tabla que se desea editar.
     * @param {*} valuesUser Datos de la primera tabla que se desea editar.
     * @param {*} queryPatient Query de la segunda tabla que se desea editar.
     * @param {*} valuesPatient Datos de la segunda tabla que se desea editar.
     */
    editBothEntities(queryUser, valuesUser, queryPatient, valuesPatient) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) reject(error);
                connection.query(queryUser, valuesUser, error => {
                    if (error) return connection.rollback(() => reject(error));
                    connection.query(queryPatient, valuesPatient, (error, results) => {
                        if (error) return connection.rollback(() => reject(error));
                        connection.commit(error => {
                            if (error) return connection.rollback(() => reject(error));
                            resolve(results);
                        });
                    });
                });
            });
        });
    }
}

module.exports = RepositoryPatient;