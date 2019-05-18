const BasicCRUD = require('./BasicCRUD');
const StaffModel = require('../models/Staff');
const EnumUserType = require('../enums/EnumUserType');

class RepositoryStaff {
    /**
     * Crea un empleado en la base de datos por medio de una transacción.
     * Si ocurre un fallo mientras se está creando el empleado se realizará
     * un rollback y no se insertarán datos en las tablas.
     * @param {StaffModel} data Datos del empleado.
     */
    createStaff(data) {
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
        const staff = {
            table: 'STAFF',
            columns: [
                'ID_STAFF',
                'SALARY',
                'TYPE',
            ],
            values: [
                data.salary,
                data.staffType,
            ],
        }
        return new BasicCRUD().createMany(user, staff);
    }

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
        + ' s.SALARY AS salary,'
        + ' s.TYPE AS staffType';
        const from = 'USER u';
        const options = 'JOIN STAFF s ON u.ID_USER = s.ID_STAFF';
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Obtiene un empleado de la base de datos con base a du id.
     * @param {Number} idStaff ID del empleado.
     */
    getStaff(idStaff) {
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
        + ' s.SALARY AS salary,'
        + ' s.TYPE AS staffType';
        const from = 'USER u';
        const options = `JOIN STAFF s ON u.ID_USER = s.ID_STAFF AND u.ID_USER = ${idStaff}`;
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Elimina un empleado de la base de datos con base a su id.
     * @param {Number} idStaff ID del empleado.
     */
    deleteStaff(idStaff) {
        const table = 'USER';
        const options = {
            'ID_USER': idStaff,
            'TYPE': EnumUserType.STAFF,
        }
        return new BasicCRUD().delete(table, options);
    }
}

module.exports = RepositoryStaff;