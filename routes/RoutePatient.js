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

router.get('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient().getPatient(req.params.idPatient).then(results => {
            res.status(200).json(results);
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        })
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.delete('/patient/:idPatient', (req, res) => {
    try {
        new ServicePatient().deletePatient(req.params.idPatient).then(() => {
            res.sendStatus(200);
        }).catch(error => {
            res.status(409).json({ error });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

module.exports = router;