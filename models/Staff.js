const UserModel = require('./User');
const StaffType = require('../enums/EnumStaffType');

class Staff {
    constructor(
        /**@type {UserModel} */ user,
        /**@type {Number} */ salary,
        /**@type {StaffType} */ staffType) {
            this.user = user;
            this.salary = salary;
            this.staffType = staffType;
        }
}

module.exports = Staff;