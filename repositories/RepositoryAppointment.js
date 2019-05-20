const BasicCRUD = require('./BasicCRUD');
const AppointmentModel = require('../models/Appointment');
const EnumAppointmentStatus = require('../enums/EnumAppointmentStatus');

class RepositoryAppointment {
    /**
     * Registra una consulta en la base de datos.
     * @param {AppointmentModel} data Datos de la consulta.
     */
    createAppointment(data) {
        let table = 'APPOINTMENT';
        let columns = [
            'ID_PATIENT',
            'ID_DENTIST',
            'DATE',
            'STATUS',
            'DESCRIPTION',
        ];
        let values = [
            data.idPatient,
            data.idDentist,
            data.date,
            data.status,
            data.description,
        ];
        return new BasicCRUD().createOne(table, columns, values);
    }

    /**
     * Obtiene citas de la base de datos.
     * @param {Object} data Datos con los que se filtra la busqueda.
     * @param {Number} [data.idAppointment] ID de la cita.
     * @param {Number} [data.idPatient] ID del paciente.
     * @param {Number} [data.idDentist] ID del dentista.
     * @param {Date} [data.date] Fecha de la consulta.
     * @param {EnumAppointmentStatus} [data.status] Estado de la consulta.
     * @param {String} [data.description] Espacio para que el dentista pueda guardar detalles de la consulta.
     */
    getAppointment(data) {
        let select = ''
            + 'ID_APPOINTMENT AS idAppointment,'
            + 'ID_PATIENT AS idPatient,'
            + 'ID_DENTIST AS idDentist,'
            + 'DATE AS date,'
            + 'STATUS AS status,'
            + 'DESCRIPTION AS description'
        let from = 'APPOINTMENT';
        let options = 'WHERE ';
        if (data.idAppointment) options += `ID_APPOINTMENT = ${data.idAppointment} AND `;
        if (data.idPatient) options += `ID_PATIENT = ${data.idPatient} AND `;
        if (data.idDentist) options += `ID_DENTIST = ${data.idDentist} AND `;
        if (data.date) options += `DATE = '${data.date}' AND `;
        if (data.status) options += `STATUS = '${data.status}' AND `;
        if (data.description) options += `DESCRIPTION = '${data.description}' AND `;
        if (options.length > 5) {
            options = options.slice(0, options.length - 5);
            return new BasicCRUD().read(select, from, options);
        }
        else return new BasicCRUD().read(select, from);
    }

    /**
     * Elimina una o varias citas en la base de datos.
     * @param {Object} data Datos generales.
     * @param {Number} [data.idAppointment] ID de la cita.
     * @param {Number} [data.idPatient] ID del paciente.
     * @param {Number} [data.idDentist] ID del dentista.
     */
    deleteAppointment(data) {
        let table = 'APPOINTMENT';
        let options = {}
        if (data.idAppointment) options['ID_APPOINTMENT'] = data.idAppointment;
        if (data.idPatient) options['ID_PATIENT'] = data.idPatient;
        if (data.idDentist) options['ID_DENTIST'] = data.idDentist;
        return new BasicCRUD().delete(table, options);
    }

    /**
     * Modifica una cita que se encuentre en el sistema.
     * @param {Number} idAppointment ID de la cita.
     * @param {Object} data Datos que se desean actualizar.
     * @param {Date} [data.date] Fecha de la cita.
     * @param {EnumAppointmentStatus} [data.status] Estado de la cita.
     * @param {String} [data.description] Espacio para que el dentista pueda guardar detalles de la consulta.
     */
    editAppointment(idAppointment, data) {
        let table = 'APPOINTMENT';
        let columns = {};
        if (data.date) columns['DATE'] = data.date;
        if (data.status) columns['STATUS'] = data.status;
        if (data.description) columns['DESCRIPTION'] = data.description;
        let where = {
            query: 'ID_APPOINTMENT = ?',
            values: [idAppointment],
        }
        return new BasicCRUD().updateOne(table, columns, where);
    }
}

module.exports = RepositoryAppointment;