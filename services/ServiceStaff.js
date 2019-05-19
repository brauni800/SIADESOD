const RepositoryStaff = require('../repositories/RepositoryStaff');
const EnumUserType = require('../enums/EnumUserType');
const EnumStaffType = require('../enums/EnumStaffType');
const EnumGender = require('../enums/EnumGender');
const UserModel = require('../models/User');
const StaffModel = require('../models/Staff');

class ServiceStaff {
    /**
     * Registra un empleado en la base de datos.
     * @param {Object} data Datos del empleado.
     */
    createStaff({ password, firstName, lastName, email, dob, phone, address, gender, salary, staffType }) {
        if (staffType !== EnumStaffType.ADMINISTRATIVE && staffType !== EnumStaffType.INTENDANCE) {
            throw 'Invalid staff type';
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
        user.userType = EnumUserType.STAFF;
        user.admin = false;
        const staff = new StaffModel();
        staff.user = user;
        staff.salary = salary;
        staff.staffType = staffType;
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
        if (staff.staffType !== undefined) {
            if (staff.staffType !== EnumStaffType.ADMINISTRATIVE && staff.staffType !== EnumStaffType.INTENDANCE) {
                throw 'Invalid Staff Type'
            }
        }
        return new RepositoryStaff().editStaff(idStaff, staff);
    }
}

module.exports = ServiceStaff;