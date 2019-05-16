const connection = require('../database');
const PatientModel = require('../models/Patient');

class RepositoryPatient {
    createPatient(/**@type {PatientModel} */patient) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) {
                    reject(error);
                }
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
                connection.query(sql, values, (error, results, fields) => {
                    if (error) {
                        return connection.rollback(() => {
                            reject(error);
                        });
                    }
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
                    connection.query(sql, values, (error, results, fields) => {
                        if (error) {
                            return connection.rollback(() => {
                                reject(error);
                            });
                        }
                        connection.commit(error => {
                            if (error) {
                                return connection.rollback(() => {
                                    reject(error);
                                });
                            }
                            resolve(results);
                        });
                    });
                });
            });
        });
    }
}

module.exports = RepositoryPatient;