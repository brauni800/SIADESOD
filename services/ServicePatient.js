const RepositoryPatient = require('../repositories/RepositoryPatient');
const EnumGender = require('../enums/EnumGender');
const EnumUserType = require('../enums/EnumUserType');
const UserModel = require('../models/User');
const PatientModel = require('../models/Patient');

class ServicePatient {
    ceratePatient({ password, firstName, lastName, email, dob, phone, address, gender, curp, insurances, allergies }) {
        if (gender !== EnumGender.MALE && gender !== EnumGender.FEMALE) {
            throw 'Invalid Gender';
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
        user.userType = EnumUserType.PATIENT;
        user.admin = false;
        const patient = new PatientModel();
        patient.user = user;
        patient.curp = curp;
        patient.insurances = insurances;
        patient.allergies = allergies;
        return new RepositoryPatient().createPatient(patient);
    }

    getAllPatients() {
        return new RepositoryPatient().getAll();
    }

    getPatient(/**@type {String} */idPatient) {
        return new RepositoryPatient().getPatient(parseInt(idPatient, 10));
    }

    deletePatient(/**@type {String} */idPatient) {
        return new RepositoryPatient().deletePatient(parseInt(idPatient, 10));
    }
}

module.exports = ServicePatient;