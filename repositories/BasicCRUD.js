const connection = require('../database');

const GenerateDeleteQuery = data => {
    if (!data) return null;
    let keys = Object.keys(data);
    let values = [];
    let queryWhere = '';
    if (keys.length === 1) {
        queryWhere = `${keys[0]} = ?`;
        values.push(data[keys[0]]);
        return { where: queryWhere, values };
    } else if (keys.length > 1) {
        for (let i = 0; i < keys.length; i++) {
            queryWhere += `${keys[i]} = ?${i !== keys.length - 1 ? ' AND ' : '' }`;
            values.push(data[keys[i]]);
        }
        return { where: queryWhere, values };
    } else {
        return null;
    }
}

class BasicCRUD {
    /**
     * Inserta datos en una tabla de la base de datos.
     * @param {String} table Nombre de la tabla.
     * @param {String[]} columns Lista con el nombre de las columnas de la tabla.
     * @param {any[]} values Lista con los datos de las columnas. Deben estar en el mismo orden que su columna.
     * @example
     *  var table = 'table';
     *  var columns = ['column1', 'column2', 'column3', ...];
     *  var values = ['foo', 0, 'foo2', ...];
     *  new BasicCRUD().createOne(table, columns, values);
     */
    createOne(table, columns, values) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ${table} (${columns.map(column => column)}) VALUES (${values.map(() => ('?'))});`;
            connection.query(query, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Inserta datos en 2 tablas por medio de una transacción. Si ocurre un fallo
     * en el proceso, ocurrirá un rollback y no se insertarán elementos.
     * @param {Object} data1 Datos de la tabla 1.
     * @param {String} data1.table Nombre de la tabla.
     * @param {String[]} data1.columns Lista con el nombre de las columnas de la tabla.
     * @param {any[]} data1.values Lista con los datos de las columnas. Deben estar en el mismo orden que su columna.
     * @param {Object} data2 Datos de la tabla 1.
     * @param {String} data2.table Nombre de la tabla.
     * @param {String[]} data2.columns Lista con el nombre de las columnas de la tabla. Se debe incluir
     * el nombre de la columna ID de esta tabla como el primer valor del arreglo.
     * @param {any[]} data2.values Lista con los datos de las columnas. Deben estar en el mismo orden que su columna.
     * No incluir el valor del ID, se auto genera en la transacción.
     * @example
     *  var data1 = {
     *      table: 'table1',
     *      columns: ['column1', 'column2', 'column3', ...],
     *      values: ['foo', 0, 'foo2', ...],
     *  }
     *  var data2 = {
     *      table: 'table2',
     *      columns: ['column1', 'column2', 'column3', ...],
     *      values: ['foo', 0, 'foo2', ...],
     *  }
     * new BasicCRUD().create(data1, data2);
     */
    createMany(data1, data2) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) reject(error);
                const query1 = `INSERT INTO ${data1.table} (${data1.columns.map(column => column)}) VALUES (${data1.values.map(() => ('?'))});`;
                connection.query(query1, data1.values, (error, results) => {
                    if (error) return connection.rollback(() => reject(error));
                    //Se inserta el id resultado al inicio del arreglo de la segunda tabla.
                    data2.values.unshift(results.insertId);
                    const query2 = `INSERT INTO ${data2.table} (${data2.columns.map(column => column)}) VALUES (${data2.values.map(() => ('?'))});`;
                    connection.query(query2, data2.values, (error, results) => {
                        if (error) return connection.rollback(() => reject(error));
                        connection.commit(error => {
                            if (error) return connection.rollback(() => reject(error));
                            resolve(results);
                        });
                    });
                });
            });
        });
    }

    /**
     * Obtiene valores de las tablas en la base de datos.
     * @param {String} select Query con los elementos que se desea obtener de la tabla.
     * @param {String} from Query con la tabla que se desea acceder.
     * @param {String} [options] Query con posibles opciones que se deseen.
     * @example
     * var select = "t.col1, t.col2";
     * var from = "tabla t";
     * new BasicCRUD().read(select, from);
     * 
     * var options = "WHERE t.col1 = 0";
     * new BasicCRUD().read(select, from, options);
     * 
     * var options = "JOIN tabla2 t2 ON t.col1 = t2.col1";
     * new BasicCRUD().read(select, from, options);
     */
    read(select, from, options) {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${select} FROM ${from} ${options || ''};`;
            connection.query(query, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Actualiza un elemento en la base de datos.
     * @param {String} table Nombre de la tabla.
     * @param {Object} data Objeto que contiene parejas de valores con los datos que se
     * desean actualizar en la tabla. Se deberá definir con el formato { "column" : "value" }.
     * @param {Object} where Objeto que contendrá las condicionales.
     * @param {String} where.query Query de la condicional, deberá tener el formato "column1 = ?, column2 = ?, ...".
     * @param {any[]} where.values Valor de las condiciones. Por cada símbolo ? en el query deberá existir un valor.
     * @example
     *  var table = 'table';
     *  var data = {
     *      'column1': 'foo',
     *      'column2': 'foo2',
     *      ...
     *  }
     *  var where = {
     *      query: 'column1 = ?, column2 = ?, ...',
     *      values: ['foo', 0, ...],
     *  }
     * new BasicCRUD().updateOne(table, data, where);
     */
    updateOne(table, data, where) {
        const columns = Object.keys(data);
        let values = Object.values(data);
        where.values.map(value => {
            values.push(value);
        });
        const query = `UPDATE ${table} SET ${columns.map(column => (`${column} = ?`))} WHERE ${where.query || ''};`;
        return new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }

    /**
     * Actualiza dos elementos en la base de datos por medio de una transacción.
     * Si ocurre un fallo en el proceso, se realiza un rollback y no se
     * insertan datos en las tablas de la base de datos.
     * @param {Object} data1 Datos para la tabla 1.
     * @param {String} data1.table Nombre de la tabla.
     * @param {Object} data1.data Objeto que contiene parejas de valores con los datos que se
     * desean actualizar en la tabla. Se deberá definir con el formato { "column" : "value" }.
     * @param {Object} data1.where Objeto que contendrá las condicionales.
     * @param {String} data1.where.query Query de la condicional, deberá tener el formato "column1 = ?, column2 = ?, ...".
     * @param {any[]} data1.where.values Valor de las condiciones. Por cada símbolo ? en el query deberá existir un valor.
     * @param {Object} data2 Datos para la tabla 2.
     * @param {String} data2.table Nombre de la tabla.
     * @param {Object} data2.data Objeto que contiene parejas de valores con los datos que se
     * desean actualizar en la tabla. Se deberá definir con el formato { "column" : "value" }.
     * @param {Object} data2.where Objeto que contendrá las condicionales.
     * @param {String} data2.where.query Query de la condicional, deberá tener el formato "column1 = ?, column2 = ?, ...".
     * @param {any[]} data2.where.values Valor de las condiciones. Por cada símbolo ? en el query deberá existir un valor.
     * @example
     *  var data1 = {
     *      table: 'table1',
     *      data: {
     *          'column1': 'foo',
     *          'column2': 'foo2',
     *          ...
     *      },
     *      where: {
     *          query: 'column1 = ?, column2 = ?, ...',
     *          values: ['foo', 0, ...],
     *      },
     *  }
     *  var data2 = {
     *      table: 'table2',
     *      data: {
     *          'column1': 'foo',
     *          'column2': 'foo2',
     *          ...
     *      },
     *      where: {
     *          query: 'column1 = ?, column2 = ?, ...',
     *          values: ['foo', 0, ...],
     *      },
     *  }
     *  new BasicCRUD().updateMany(data1, data2);
     */
    updateMany(data1, data2) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(error => {
                if (error) reject(error);
                const columns1 = Object.keys(data1.data);
                let values1 = Object.values(data1.data);
                data1.where.values.map(value => {
                    values1.push(value);
                });
                const query1 = `UPDATE ${data1.table} SET ${columns1.map(column => (`${column} = ?`))} WHERE ${data1.where.query || ''};`;
                connection.query(query1, values1, (error, results1) => {
                    if (error) return connection.rollback(() => reject(error));
                    const columns2 = Object.keys(data2.data);
                    let values2 = Object.values(data2.data);
                    data2.where.values.map(value => {
                        values2.push(value);
                    });
                    const query2 = `UPDATE ${data2.table} SET ${columns2.map(column => (`${column} = ?`))} WHERE ${data2.where.query || ''};`;
                    connection.query(query2, values2, (error, results2) => {
                        if (error) return connection.rollback(() => reject(error));
                        connection.commit(error => {
                            if (error) return connection.rollback(() => reject(error));
                            resolve([results1, results2]);
                        });
                    });
                });
            });
        });
    }

    /**
     * Elimina un elemento de la base de datos.
     * @param {String} table Nombre de la tabla.
     * @param {Object} options Objeto que contiene parejas de valores con los datos que serán
     * utilizados para el where del query. Se deberá definir con el formato { "column" : "value" }.
     * @example
     * var table = 'table';
     * var options = {
     *     'col1' : 'foo',
     *     'col2' : 0,
     * ...
     * }
     * new BasicCRUD().delete(table, options);
     */
    delete(table, options) {
        return new Promise((resolve, reject) => {
            let objWhere = GenerateDeleteQuery(options);
            if (!objWhere) reject('Invalid where');
            const query = `DELETE FROM ${table} WHERE ${objWhere.where};`;
            connection.query(query, objWhere.values, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
    }
}

module.exports = BasicCRUD;