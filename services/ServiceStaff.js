const RepositoryStaff = require('../repositories/RepositoryStaff');
const EnumUserType = require('../enums/EnumUserType');
const EnumStaffType = require('../enums/EnumStaffType');
const EnumGender = require('../enums/EnumGender');
const UserModel = require('../models/User');
const StaffModel = require('../models/Staff');

class ServiceStaff {
    /**
     * Registra un empleado en la base de datos.
     * @param {Object} dataUser Datos del empleado.
     * @param {String} dataUser.password Contraseña del empleado.
     * @param {String} dataUser.firstName Nombre del empleado.
     * @param {String} dataUser.lastName Apellido del empleado.
     * @param {String} dataUser.email Email del empleado.
     * @param {String} dataUser.dob Fecha de cumpleaños del empleado.
     * @param {String} dataUser.phone Número telefónico del empleado.
     * @param {String} dataUser.address Dirección de la vivienda del empleado.
     * @param {String} dataUser.gender Género del empleado.
     * @param {String} dataUser.salary Salario del empleado.
     * @param {String} dataUser.staffType Tipo de empleado.
     */
    createStaff(dataUser) {
        if (dataUser.gender !== EnumGender.MALE && dataUser.gender !== EnumGender.FEMALE) {
            throw 'Invalid Gender';
        }
        if (dataUser.staffType !== EnumStaffType.ADMINISTRATIVE && dataUser.staffType !== EnumStaffType.INTENDANCE) {
            throw 'Invalid Staff Type';
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
        user.userType = EnumUserType.STAFF;
        user.admin = false;
        const staff = new StaffModel();
        staff.user = user;
        staff.salary = parseInt(dataUser.salary, 10);
        staff.staffType = dataUser.staffType;
        return new RepositoryStaff().createStaff(staff);
    }

    /**
     * Obtiene una lista de todos los empleados en la base de datos.
     */
    getAllStaff() {
        return new RepositoryStaff().getAll();
    }

    /**
     * Obtiene un empleado de la base de datos con base a su id.
     * @param {String} idStaff ID del empleado.
     */
    getStaff(idStaff) {
        return new RepositoryStaff().getStaff(parseInt(idStaff, 10));
    }

    /**
     * Elimina un empleado de la base de datos, previamente convierte el ID del empleado en un Number.
     * @param {String} idStaff ID del empleado.
     */
    deleteStaff(idStaff) {
        return new RepositoryStaff().deleteStaff(parseInt(idStaff, 10));
    }

    /**
     * Edita un staff de la base de datos.
     * @param {String} idStaff ID del staff que se desea editar.
     * @param {Object} staff Datos del staff que se desea editar.
     */
    editStaff(idStaff, staff) {
        if (staff.gender !== undefined) {
            if (staff.gender !== EnumGender.MALE && staff.gender !== EnumGender.FEMALE) {
                throw 'Invalid Gender';
            }
        }
        if (staff.dob !== undefined) {
            staff.dob = new Date(staff.dob);
        }
        if (staff.salary !== undefined) {
            staff.salary = parseInt(staff.salary, 10);
        }
        if (staff.staffType !== undefined) {
            if (staff.staffType !== EnumStaffType.ADMINISTRATIVE && staff.staffType !== EnumStaffType.INTENDANCE) {
                throw 'Invalid Staff Type';
            }
        }
        return new RepositoryStaff().editStaff(idStaff, staff);
    }
}

module.exports = ServiceStaff;