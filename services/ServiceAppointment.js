const jwt = require('jsonwebtoken');
const RepositoryAppointments = require('../repositories/RepositoryAppointment');
const EnumAppointmentStatus = require('../enums/EnumAppointmentStatus');
const AppointmentModel = require('../models/Appointment');
const secret = require('../config').secretKey;

const verifyJWT = token => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) throw err;
    });
}

class ServiceAppointments {
    /**
     * @param {String} token Token JWT.
     */
    constructor (token) {
        this.token = token;
    }
    /**
     * Registra una cita en el sistema.
     * @param {Object} dataAppointment Datos de la cita.
     * @param {String} dataAppointment.idPatient ID del paciente.
     * @param {String} dataAppointment.idDentist ID del dentista.
     * @param {String} dataAppointment.date Fecha de la consulta.
     * @param {String} dataAppointment.description Espacio para que el dentista pueda guardar detalles de la consulta.
     */
    createAppointment(dataAppointment) {
        verifyJWT(this.token);
        const appointment = new AppointmentModel();
        appointment.idPatient = parseInt(dataAppointment.idPatient, 10);
        appointment.idDentist = parseInt(dataAppointment.idDentist, 10);
        appointment.date = new Date(dataAppointment.date);
        appointment.status = EnumAppointmentStatus.PENDING;
        appointment.description = dataAppointment.description;
        return new RepositoryAppointments().createAppointment(appointment);
    }

    /**
     * Busca citas en el sistema.
     * @param {Object} query Variables del path con los datos para filtrar la busqueda.
     */
    searchAppointment(query) {
        verifyJWT(this.token);
        return new RepositoryAppointments().getAppointment(query);
    }

    /**
     * Elimina una o varias citas en la base de datos.
     * @param {Object} data Datos generales.
     * @param {Number} [data.idAppointment] ID de la cita.
     * @param {Number} [data.idPatient] ID del paciente.
     * @param {Number} [data.idDentist] ID del dentista.
     */
    deleteAppointment(data) {
        verifyJWT(this.token);
        if (!data.idAppointment && !data.idPatient && !data.idDentist) throw 'Invalid data';
        if (data.idAppointment) data.idAppointment = parseInt(data.idAppointment, 10);
        if (data.idPatient) data.idPatient = parseInt(data.idPatient, 10);
        if (data.idDentist) data.idDentist = parseInt(data.idDentist, 10);
        return new RepositoryAppointments().deleteAppointment(data);
    }

    /**
     * Edita los valores de una cita que se encuentre en el sistema.
     * @param {String} idAppointment ID de la cita.
     * @param {Object} data Datos que se desean actualizar.
     * @param {String} [data.date] Fecha de la cita.
     * @param {String} [data.status] Estado de la cita.
     * @param {String} [data.description] Espacio para que el dentista pueda guardar detalles de la consulta.
     */
    editAppointment(idAppointment, data) {
        verifyJWT(this.token);
        if (!data.date && !data.status && !data.description) throw 'Nothing to update';
        idAppointment = parseInt(idAppointment);
        if (data.date) data.date = new Date(data.date);
        if (data.status) {
            if (data.status !== EnumAppointmentStatus.DONE
                && data.status !== EnumAppointmentStatus.PENDING
                && data.status !== EnumAppointmentStatus.CANCELED)
                throw 'Invalid Appointment Status';
        }
        return new RepositoryAppointments().editAppointment(idAppointment, data);
    }
}

module.exports = ServiceAppointments;