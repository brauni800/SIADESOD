const connection = require('../database');
const PatientModel = require('../models/Patient');

class RepositoryPatient {
    createPatient(/**@type {PatientModel} */patient) {
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
            + ' LEFT JOIN PATIENT p ON u.ID_USER = p.ID_PATIENT;';
            connection.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    getPatient(/**@type {Number} */idPatient) {
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

    deletePatient(/**@type {Number} */idPatient) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM USER WHERE ID_USER = ?;'
            const values = [idPatient];
            connection.query(sql, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = RepositoryPatient;