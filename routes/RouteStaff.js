const express = require('express');
const ServiceStaff = require('../services/ServiceStaff');

const router = express.Router();

/**
 * Registra un empleado en la base de datos.
 */
router.post('/staff', (req, res) => {
    try {
        new ServiceStaff(req.headers.authorization).createStaff(req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtener la lista de todos los empleados en la base de datos.
 */
router.get('/staff', (req, res) => {
    try {
        new ServiceStaff(req.headers.authorization).getAllStaff()
        .then(results => res.status(200).json(results))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    } 
});

/**
 * Obtiene a un empleado en la base datos con base a su id.
 */
router.get('/staff/:idStaff', (req, res) => {
    try {
        new ServiceStaff(req.headers.authorization).getStaff(req.params.idStaff)
        .then(results => {
            if (results.length > 0) res.status(200).json(results[0]);
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Elimina a un empleado de la base de datos con base a su id.
 */
router.delete('/staff/:idStaff', (req, res) => {
    try {
        new ServiceStaff(req.headers.authorization).deleteStaff(req.params.idStaff)
        .then(results => {
            if (results.affectedRows > 0) res.sendStatus(200);
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Actualiza un staff en la base de datos con base a su ID.
 * Se pasan únicamente los datos del staff que se desean actualizar.
 */
router.put('/staff/:idStaff', (req, res) => {
    try {
        new ServiceStaff(req.headers.authorization).editStaff(req.params.idStaff, req.body)
        .then(results => {
            if (Array.isArray(results)) {
                if (results[0].affectedRows > 0 && results[1].affectedRows > 0) {
                    if (results[0].changedRows > 0 || results[1].changedRows > 0) res.sendStatus(200);
                    else res.sendStatus(204);
                }
                else res.sendStatus(204);
            } else {
                if (results.affectedRows > 0 && results.changedRows > 0) res.sendStatus(200);
                else res.sendStatus(204);
            }
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

module.exports = router;