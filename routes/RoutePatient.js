const express = require('express');
const ServicePatient = require('../services/ServicePatient');

const router = express.Router();

/**
 * Registrar un paciente en la base de datos.
 */
router.post('/patient', (req, res) => {
    try {
        new ServicePatient(req.headers.authorization).ceratePatient(req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtener la lista de todos los pacientes en la base de datos.
 */
router.get('/patient', (req, res) => {
    try {
        new ServicePatient(req.headers.authorization).getAllPatients()
        .then(results => res.status(200).json(results))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtiene a un paciente en la base datos con base a su id.
 */
router.get('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient(req.headers.authorization).getPatient(req.params.idPatient)
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
 * Elimina a un paciente de la base de datos con base a su id.
 */
router.delete('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient(req.headers.authorization).deletePatient(req.params.idPatient)
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
 * Actualiza un paciente en la base de datos con base a su id.
 * Se pasan únicamente los datos del paciente que se desean actualizar.
 */
router.put('/patient/:idPatient',  (req, res) => {
    try {
        new ServicePatient(req.headers.authorization).editPatient(req.params.idPatient, req.body)
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