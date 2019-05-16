const UserModel = require('./User');

class Patient {
    constructor (
        /**@type {UserModel} */ user,
        /**@type {String} */ curp,
        /**@type {String} */ insurances,
        /**@type {String} */ allergies) {
        this.user = user;
        this.curp = curp;
        this.insurances = insurances;
        this.allergies = allergies;
    }
}

module.exports = Patient;