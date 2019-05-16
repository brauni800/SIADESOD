const EnumGender = require('../enums/EnumGender');
const EnumUserType = require('../enums/EnumUserType');

class User {
    constructor (
        /**@type {String} */password,
        /**@type {String} */firstName,
        /**@type {String} */lastName,
        /**@type {String} */email,
        /**@type {Date} */dob,
        /**@type {String} */phone,
        /**@type {String} */address,
        /**@type {EnumGender} */gender,
        /**@type {EnumUserType} */userType,
        /**@type {Boolean} */admin) {
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dob = dob;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.userType = userType;
        this.admin = admin;
    }
}

module.exports = User;