const express = require('express');
const ServicePatient = require('../services/ServicePatient');

const router = express.Router();

router.post('/patient', (req, res) => {
    try {
        new ServicePatient().ceratePatient(req.body)
        .then(result => {
            console.log(result);
            res.sendStatus(201);
        })
        .catch(error => {
            console.error(error);
            res.status(409).json({ error: error.sqlMessage });
        });
    } catch (error) {
        console.error(error);
        res.status(409).json({ error });
    }
});

module.exports = router;