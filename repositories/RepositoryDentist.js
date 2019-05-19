const BasicCRUD = require('./BasicCRUD');
const DentistModel = require('../models/Dentist');
const EnumUserType = require('../enums/EnumUserType');

class RepositoryDentist {
    /**
     * Crea un dentista en la base de datos por medio de una transacción.
     * Si ocurre un fallo mientras se está creando el dentista se realizará
     * un rollback y no se insertarán datos en las tablas.
     * @param {DentistModel} data Datos del dentista.
     */
    createDentist(data) {
        const user = {
            table: 'USER',
            columns: [
                'PASSWORD',
                'FIRST_NAME',
                'LAST_NAME',
                'EMAIL',
                'DATE_OF_BIRTH',
                'PHONE',
                'ADDRESS',
                'GENDER',
                'TYPE',
                'ADMIN',
            ],
            values: [
                data.user.password,
                data.user.firstName,
                data.user.lastName,
                data.user.email,
                data.user.dob,
                data.user.phone,
                data.user.address,
                data.user.gender,
                data.user.userType,
                data.user.admin,
            ],
        }
        const dentist = {
            table: 'DENTIST',
            columns: [
                'ID_DENTIST',
                'RATE',
                'CEDULA',
                'SPECIALITY',
            ],
            values: [
                data.rate,
                data.cedula,
                data.speciality,
            ],
        }
        return new BasicCRUD().createMany(user, dentist);
    }

    /**
     * Obtiene una lista de todos los dentistas en la base de datos.
     */
    getAll() {
        const select = ''
        + ' u.ID_USER AS id,'
        + ' u.FIRST_NAME AS firstName,'
        + ' u.LAST_NAME AS lastName,'
        + ' u.EMAIL AS email,'
        + ' u.DATE_OF_BIRTH AS dob,'
        + ' u.PHONE AS phone,'
        + ' u.ADDRESS AS address,'
        + ' u.GENDER AS gender,'
        + ' u.TYPE AS userType,'
        + ' d.RATE AS rate,'
        + ' d.CEDULA AS cedula,'
        + ' d.SPECIALITY AS speciality';
        const from = 'USER u';
        const options = 'JOIN DENTIST d ON u.ID_USER = d.ID_DENTIST';
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Obtiene un dentista de la base de datos con base a su id.
     * @param {Number} idDentist ID del dentista.
     */
    getDentist(idDentist) {
        const select = ''
        + ' u.ID_USER AS id,'
        + ' u.FIRST_NAME AS firstName,'
        + ' u.LAST_NAME AS lastName,'
        + ' u.EMAIL AS email,'
        + ' u.DATE_OF_BIRTH AS dob,'
        + ' u.PHONE AS phone,'
        + ' u.ADDRESS AS address,'
        + ' u.GENDER AS gender,'
        + ' u.TYPE AS userType,'
        + ' d.RATE AS rate,'
        + ' d.CEDULA AS cedula,'
        + ' d.SPECIALITY AS speciality';
        const from = 'USER u';
        const options = `JOIN DENTIST d ON u.ID_USER = d.ID_DENTIST AND u.ID_USER = ${idDentist}`;
        return new BasicCRUD().read(select, from, options);
    }

    /**
     * Elimina un dentista de la base de datos.
     * @param {Number} idDentist ID del dentista.
     */
    deleteDentist(idDentist) {
        const table = 'USER';
        const options = {
            'ID_USER': idDentist,
            'TYPE': EnumUserType.DENTIST,
        }
        return new BasicCRUD().delete(table, options);
    }

    /**
     * Actualiza un dentista en la base de datos.
     * @param {Number} idDentist ID del dentista que se desea actualizar.
     * @param {Object} dentist Objeto con los datos del dentista que serán actualizados.
     * @param {String} [dentist.password] Contraseña del dentista.
     * @param {String} [dentist.firstName] Nombre del dentista.
     * @param {String} [dentist.lastName] Apellido del dentista.
     * @param {String} [dentist.email] Email del dentista.
     * @param {Date} [dentist.dob] Fecha de cumpleaños del dentista.
     * @param {String} [dentist.phone] Número de teléfono de contacto del dentista.
     * @param {String} [dentist.address] Dirección de la vivienda del dentista.
     * @param {EnumUserType} [dentist.gender] Género del dentista.
     * @param {Number} [dentist.rate] Tarifa por hora de sueldo.
     * @param {String} [dentist.cedula] Número de cedula profesional.
     * @param {String} [dentist.speciality] Especialidad del dentista.
     */
    editDentist(idDentist, dentist) {
        let dataUser = {}, dataDentist = {};
        if (dentist.password !== undefined) dataUser['PASSWORD'] = dentist.password;
        if (dentist.firstName !== undefined) dataUser['FIRST_NAME'] = dentist.firstName;
        if (dentist.lastName !== undefined) dataUser['LAST_NAME'] = dentist.lastName;
        if (dentist.email !== undefined) dataUser['EMAIL'] = dentist.email;
        if (dentist.dob !== undefined) dataUser['DATE_OF_BIRTH'] = dentist.dob;
        if (dentist.phone !== undefined) dataUser['PHONE'] = dentist.phone;
        if (dentist.address !== undefined) dataUser['ADDRESS'] = dentist.address;
        if (dentist.gender !== undefined) dataUser['GENDER'] = dentist.gender;
        if (dentist.rate !== undefined) dataDentist['RATE'] = dentist.rate;
        if (dentist.cedula !== undefined) dataDentist['CEDULA'] = dentist.cedula;
        if (dentist.speciality !== undefined) dataDentist['SPECIALITY'] = dentist.speciality;

        if (Object.keys(dataUser).length > 0) {
            if (Object.keys(dataDentist).length > 0) {
                let user = {
                    table: 'USER',
                    data: dataUser,
                    where: {
                        query: 'ID_USER = ?',
                        values: [idDentist],
                    },
                }
                let dentist = {
                    table: 'DENTIST',
                    data: dataDentist,
                    where: {
                        query: 'ID_DENTIST = ?',
                        values: [idDentist],
                    },
                }
                return new BasicCRUD().updateMany(user, dentist);
            } else {
                let where = {
                    query: 'ID_USER = ?',
                    values: [idDentist],
                }
                return new BasicCRUD().updateOne('USER', dataUser, where);
            }
        } else {
            if (Object.keys(dataDentist).length > 0) {
                let where = {
                    query: 'ID_DENTIST = ?',
                    values: [idDentist],
                }
                return new BasicCRUD().updateOne('DENTIST', dataDentist, where);
            } else {
                throw 'Nothing to update';
            }
        }
    }
}

module.exports = RepositoryDentist;