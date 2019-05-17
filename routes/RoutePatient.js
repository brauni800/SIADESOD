const express = require('express');
const ServicePatient = require('../services/ServicePatient');

const router = express.Router();

/**
 * Registrar un paciente en la base de datos
 */
router.post('/patient', (req, res) => {
    try {
        new ServicePatient().ceratePatient(req.body).then(() => {
            res.sendStatus(201);
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtener la lista de todos los pacientes en la base de datos
 */
router.get('/patient', (req, res) => {
    try {
        new ServicePatient().getAllPatients().then(results => {
            res.status(200).json(results);
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtiene a un paciente en la base datos con base a su ID.
 */
router.get('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient().getPatient(req.params.idPatient).then(results => {
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.sendStatus(204);
            }
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        })
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Elimina a un paciente de la base de datos con base a su ID.
 */
router.delete('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient().deletePatient(req.params.idPatient).then(results => {
            if (results.affectedRows > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(204);
            }
        }).catch(error => {
            res.status(409).json({ error });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Actualiza un paciente en la base de datos con base a su ID.
 * Se pasan únicamente los datos del paciente que se desean actualizar.
 */
router.put('/patient/:idPatient',  (req, res) => {
    try {
        new ServicePatient().editPatient(req.params.idPatient, req.body).then(() => {
            res.sendStatus(200);
        }).catch(error => {
            res.json({ error });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

module.exports = router;