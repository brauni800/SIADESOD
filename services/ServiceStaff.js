const RepositoryStaff = require('../repositories/RepositoryStaff');
const EnumUserType = require('../enums/EnumUserType');
const EnumStaffType = require('../enums/EnumStaffType');
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

    getAllStaff() {
        return new RepositoryStaff().getAll();
    }
}

module.exports = ServiceStaff;