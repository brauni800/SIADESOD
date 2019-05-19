const UserModel = require('../models/User');

class Dentist {
    constructor (
        /**@type {UserModel} */ user,
        /**@type {Number} */ rate,
        /**@type {String} */ cedula,
        /**@type {String} */ speciality) {
        this.user = user;
        this.rate = rate;
        this.cedula = cedula;
        this.speciality = speciality;
    }
}

module.exports = Dentist;