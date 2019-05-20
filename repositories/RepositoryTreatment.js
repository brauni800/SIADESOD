const BasicCRUD = require('./BasicCRUD');

class RepositoryTreatment {
    /**
     * Crea un tratamiento para una cita.
     * @param {Object} data Datos del tratamiento.
     * @param {Number} data.idAppointment ID de la cita.
     * @param {Date} data.startDate Fecha de inicio del tratamiento.
     * @param {Date} data.endDate Fecha de fin del tratamiento.
     * @param {String} data.diagnostic Diagnóstico medico que registra el dentista.
     * @param {String} data.medicine Medicinas recetadas por el dentista.
     * @param {String} data.observation Observaciones que considere el dentista.
     */
    createTreatment(data) {
        let table = 'TREATMENT';
        let columns = [
            'ID_APPOINTMENT',
            'START_DATE',
            'END_DATE',
            'MEDICAL_DIAGNOSTIC',
        ];
        let values = [
            data.idAppointment,
            data.startDate,
            data.endDate,
            data.diagnostic,
        ];
        if (data.medicine) {
            columns.push('MEDICINE');
            values.push(data.medicine);
        }
        if (data.observation) {
            columns.push('OBSERVATION');
            values.push(data.observation);
        }
        return new BasicCRUD().createOne(table, columns, values);
    }

    /**
     * Busca un tratamiento en la base de datos.
     * @param {Object} data Datos para filtrar la búsqueda.
     * @param {Number} [data.idTreatment] ID del tratamiento.
     * @param {Number} [data.idAppointment] ID de la consulta.
     * @param {Date} [data.startDate] Fecha de inicio del tratamiento.
     * @param {Date} [data.endDate] Fecha de fin del tratamiento.
     */
    searchTreatment(data) {
        let select = ''
            + 'ID_TREATMENT AS idTreatment,'
            + 'ID_APPOINTMENT AS idAppointment,'
            + 'START_DATE AS startDate,'
            + 'END_DATE AS endDate,'
            + 'MEDICAL_DIAGNOSTIC AS diagnostic,'
            + 'MEDICINE AS medicine,'
            + 'OBSERVATION AS observation';
        let from = 'TREATMENT';
        let options = 'WHERE ';
        if (data.idTreatment) options += `ID_TREATMENT = ${data.idTreatment} AND `;
        if (data.idAppointment) options += `ID_APPOINTMENT = ${data.idAppointment} AND `;
        if (data.startDate) options += `START_DATE = '${data.startDate}' AND `;
        if (data.endDate) options += `END_DATE = '${data.endDate}' AND `;
        if (options.length > 5) {
            options = options.slice(0, options.length - 5);
            return new BasicCRUD().read(select, from, options);
        }
        else return new BasicCRUD().read(select, from);
    }

    /**
     * Elimina tratamientos de la base de datos.
     * @param {Object} data ID's con de los tratamientos que se desean eliminar.
     * @param {Number} data.idTreatment ID del tratamiento.
     * @param {Number} data.idAppointment ID de la cita.
     */
    deleteTreatment(data) {
        let table = 'TREATMENT';
        let options = {};
        if (data.idTreatment) options['ID_TREATMENT'] = data.idTreatment;
        if (data.idAppointment) options['ID_APPOINTMENT'] = data.idAppointment;
        if (Object.keys(options).length <= 0) throw 'Invalid values';
        return new BasicCRUD().delete(table, options);
    }

    /**
     * Modifica los datos de un tratamiento.
     * @param {Number} idTreatment ID del tratamiento.
     * @param {Object} dataTreatment Datos que se desean actualizar.
     * @param {Object} dataTreatment.startDate Fecha de inicio del tratamiento.
     * @param {Object} dataTreatment.endDate Fecha de fin del tratamiento.
     * @param {Object} dataTreatment.diagnostic Diagnóstico proporcionado por el dentista.
     * @param {Object} dataTreatment.medicine Medicina recetada en el tratamiento.
     * @param {Object} dataTreatment.observation Observaciones del dentista.
     */
    editTreatment(idTreatment, dataTreatment) {
        let table = 'APPOINTMENT';
        let data = {}
        if (dataTreatment.startDate) data['START_DATE'] = dataTreatment.startDate;
        if (dataTreatment.endDate) data['END_DATE'] = dataTreatment.endDate;
        if (dataTreatment.diagnostic) data['MEDICAL_DIAGNOSTIC'] = dataTreatment.diagnostic;
        if (dataTreatment.medicine) data['MEDICINE'] = dataTreatment.medicine;
        if (dataTreatment.observation) data['OBSERVATION'] = dataTreatment.observation;
        if (Object.keys(data).length <= 0) throw 'Invalid values';
        let where = {
            query: 'ID_TREATMENT = ?',
            values: [idTreatment],
        }
        return new BasicCRUD().updateOne(table, data, where);
    }
}

module.exports = RepositoryTreatment;