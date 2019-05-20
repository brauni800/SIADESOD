const jwt = require('jsonwebtoken');
const RepositoryTreatment = require('../repositories/RepositoryTreatment');
const secret = require('../config').secretKey;

const verifyJWT = token => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) throw err;
    });
}

class ServiceTreatment {
    /**
     * @param {String} token Token JWT.
     */
    constructor (token) {
        this.token = token;
    }
    /**
     * Crea un tratamiento para una cita.
     * @param {Object} data Datos del tratamiento.
     * @param {Number} data.idAppointment ID de la cita.
     * @param {Date} data.startDate Fecha de inicio del tratamiento.
     * @param {Date} data.endDate Fecha de fin del tratamiento.
     */
    createTreatment(data) {
        if (data.idAppointment) data.idAppointment = parseInt(data.idAppointment);
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        return new RepositoryTreatment().createTreatment(data);
    }

    /**
     * Busca un tratamiento en la base de datos.
     * @param {Object} data Datos para filtrar la búsqueda.
     * @param {Number} data.idTreatment ID del tratamiento.
     * @param {Number} data.idAppointment ID de la consulta.
     * @param {Date} data.startDate Fecha de inicio del tratamiento.
     * @param {Date} data.endDate Fecha de fin del tratamiento.
     */
    searchTreatment(data) {
        if (data.idTreatment) data.idTreatment = parseInt(data.idTreatment);
        if (data.idAppointment) data.idAppointment = parseInt(data.idAppointment);
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        return new RepositoryTreatment().searchTreatment(data);
    }

    /**
     * Elimina tratamientos de la base de datos.
     * @param {Object} data ID's con de los tratamientos que se desean eliminar.
     * @param {Number} data.idTreatment ID del tratamiento.
     * @param {Number} data.idAppointment ID de la cita.
     */
    deleteTreatment(data) {
        if (data.idTreatment) data.idTreatment = parseInt(data.idTreatment);
        if (data.idAppointment) data.idAppointment = parseInt(data.idAppointment);
        return new RepositoryTreatment().deleteTreatment(data);
    }

    /**
     * Modifica los datos de un tratamiento.
     * @param {Number} idTreatment ID del tratamiento.
     * @param {Object} data Datos que se desean actualizar.
     * @param {Object} data.startDate Fecha de inicio del tratamiento.
     * @param {Object} data.endDate Fecha de fin del tratamiento.
     */
    editTreatment(idTreatment, data) {
        idTreatment = parseInt(idTreatment);
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);
        return new RepositoryTreatment().editTreatment(idTreatment, data);
    }
}

module.exports = ServiceTreatment;