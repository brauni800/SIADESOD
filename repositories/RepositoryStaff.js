const BasicCRUD = require('./BasicCRUD');
const StaffModel = require('../models/Staff');
const EnumUserType = require('../enums/EnumUserType');
const EnumGender = require('../enums/EnumGender');
const EnumStaffType = require('../enums/EnumStaffType');

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

    /**
     * Actualiza un staff en la base de datos.
     * @param {Number} idStaff ID del staff que se desea actualizar.
     * @param {Object} staff Objeto con los datos del staff que serán actualizados.
     * @param {String} [staff.password] Contraseña del staff.
     * @param {String} [staff.firstName] Nombre del staff.
     * @param {String} [staff.lastName] Apellido del staff.
     * @param {String} [staff.email] Email del staff.
     * @param {Date} [staff.dob] Fecha de cumpleaños del staff.
     * @param {String} [staff.phone] Número de teléfono de contacto del staff.
     * @param {String} [staff.address] Dirección de la vivienda del staff.
     * @param {EnumGender} [staff.gender] Género del staff.
     * @param {Number} [staff.salary] Salario mensual del staff.
     * @param {EnumStaffType} [staff.staffType] Tipo de staff que se maneja en la clínica.
     */
    editStaff(idStaff, staff) {
        let dataUser = {}, dataStaff = {};
        if (staff.password) dataUser['PASSWORD'] = staff.password;
        if (staff.firstName) dataUser['FIRST_NAME'] = staff.firstName;
        if (staff.lastName) dataUser['LAST_NAME'] = staff.lastName;
        if (staff.email) dataUser['EMAIL'] = staff.email;
        if (staff.dob) dataUser['DATE_OF_BIRTH'] = staff.dob;
        if (staff.phone) dataUser['PHONE'] = staff.phone;
        if (staff.address) dataUser['ADDRESS'] = staff.address;
        if (staff.gender) dataUser['GENDER'] = staff.gender;
        if (staff.salary) dataStaff['SALARY'] = staff.salary;
        if (staff.staffType) dataStaff['TYPE'] = staff.staffType;

        if (Object.keys(dataUser).length > 0) {
            if (Object.keys(dataStaff).length > 0) {
                let user = {
                    table: 'USER',
                    data: dataUser,
                    where: {
                        query: 'ID_USER = ?',
                        values: [idStaff],
                    },
                }
                let staff = {
                    table: 'STAFF',
                    data: dataStaff,
                    where: {
                        query: 'ID_STAFF = ?',
                        values: [idStaff],
                    },
                }
                return new BasicCRUD().updateMany(user, staff);
            } else {
                let where = {
                    query: 'ID_USER = ?',
                    values: [idStaff],
                }
                return new BasicCRUD().updateOne('USER', dataUser, where);
            }
        } else {
            if (Object.keys(dataStaff).length > 0) {
                let where = {
                    query: 'ID_STAFF = ?',
                    values: [idStaff],
                }
                return new BasicCRUD().updateOne('STAFF', dataStaff, where);
            } else {
                throw 'Nothing to update';
            }
        }
    }
}

module.exports = RepositoryStaff;