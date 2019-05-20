const express = require('express');
const ServiceAppointment = require('../services/ServiceAppointment');

const router = express.Router();

router.post('/appointment', (req, res) => {
    try {
        new ServiceAppointment(req.headers.authorization).createAppointment(req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.get('/appointment', (req, res) => {
    try {
        new ServiceAppointment(req.headers.authorization).searchAppointment(req.query)
        .then(results => {
            if (results.length > 0) {
                if (results.length > 1) res.status(200).json(results);
                else res.status(200).json(results[0]);
            }
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.delete('/appointment', (req, res) => {
    try {
        new ServiceAppointment(req.headers.authorization).deleteAppointment(req.query)
        .then(results => {
            if (results.affectedRows > 0) res.sendStatus(200);
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.put('/appointment/:idAppointment', (req, res) => {
    try {
        new ServiceAppointment(req.headers.authorization).editAppointment(req.params.idAppointment, req.body)
        .then(results => {
            if (results.affectedRows > 0 && results.changedRows > 0) res.sendStatus(200);
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

module.exports = router;