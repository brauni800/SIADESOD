const express = require('express');
const ServiceStaff = require('../services/ServiceStaff');

const router = express.Router();

/**
 * Registra un empleado en la base de datos.
 */
router.post('/staff', (req, res) => {
    try {
        new ServiceStaff().createStaff(req.body).then(() => {
            res.sendStatus(201);
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        });
    } catch (error) {
        res.status(409).json({ error });
    }
});

router.get('/staff', (req, res) => {
    try {
        new ServiceStaff().getAllStaff().then(results => {
            res.status(200).json(results);
        }).catch(error => {
            res.status(409).json({ error: error.sqlMessage });
        });
    } catch (error) {
        res.status(409).json({ error });
    } 
});

module.exports = router;