const express = require('express');
const ServiceTreatment = require('../services/ServiceTreatment');

const router = express.Router();

router.post('/treatment', (req, res) => {
    try {
        new ServiceTreatment(req.headers.authorization).createTreatment(req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        console.log(error);
        res.status(409).json({ error });
    }
});

router.get('/treatment', (req, res) => {
    try {
        new ServiceTreatment(req.headers.authorization).searchTreatment(req.query)
        .then(results => {
            if (results.length > 0) {
                if (results.length > 1) res.status(200).json(results);
                else res.status(200).json(results);
            }
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.delete('/treatment', (req, res) => {
    try {
        new ServiceTreatment(req.headers.authorization).deleteTreatment(req.query)
        .then(results => {
            if (results.affectedRows > 0) res.sendStatus(200);
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.put('/treatment/:idTreatment', (req, res) => {
    try {
        new ServiceTreatment(req.headers.authorization).editTreatment(req.params.idTreatment, req.body)
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