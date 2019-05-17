const connection = require('../database');
const StaffModel = require('../models/Staff');

class RepositoryStaff {
    /**
     * Crea un empleado en la base de datos por medio de una transacción.
     * Si ocurre un fallo mientras se está creando el empleado se realizará
     * un rollback y no se insertarán datos en las tablas.
     * @param {StaffModel} staff Datos del empleado.
     */
    createStaff(staff) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) reject(error);
                let sql = ''
                    + ' INSERT INTO USER'
                    + ' (PASSWORD, FIRST_NAME, LAST_NAME, EMAIL, DATE_OF_BIRTH, PHONE, ADDRESS, GENDER, TYPE, ADMIN)'
                    + ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                let values = [
                    staff.user.password,
                    staff.user.firstName,
                    staff.user.lastName,
                    staff.user.email,
                    staff.user.dob,
                    staff.user.phone,
                    staff.user.address,
                    staff.user.gender,
                    staff.user.userType,
                    staff.user.admin,
                ];
                connection.query(sql, values, (error, results) => {
                    if (error) return connection.rollback(() => reject(error));
                    sql = ''
                    + ' INSERT INTO STAFF'
                    + ' (ID_STAFF, SALARY, TYPE)'
                    + ' VALUES (?, ?, ?);';
                    values = [
                        results.insertId,
                        staff.salary,
                        staff.staffType,
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
            + ' s.SALARY AS salary,'
            + ' s.TYPE AS staffType'
            + ' FROM USER u'
            + ' JOIN STAFF s ON u.ID_USER = s.ID_STAFF;';
            connection.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = RepositoryStaff;