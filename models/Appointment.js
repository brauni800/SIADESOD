const EnumAppointmentStatus = require('../enums/EnumAppointmentStatus');

class Appointment {
    /**
     * @param {Number} idDentist ID del dentista.
     * @param {Number} idPatient ID del paciente.
     * @param {Date} date Fecha de la consulta.
     * @param {EnumAppointmentStatus} status Estado de la consulta.
     * @param {String} description Espacio para que el dentista pueda guardar detalles de la consulta.
     */
    constructor (idDentist, idPatient, date, status, description) {
        this.idDentist = idDentist;
        this.idPatient = idPatient;
        this.date = date;
        this.status = status;
        this.description = description;
    }
}

module.exports = Appointment;