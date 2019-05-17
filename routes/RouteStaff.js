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

router.get('/staff/:idStaff', (req, res) => {
    try {
        new ServiceStaff().getStaff(req.params.idStaff).then(results => {
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

router.delete('/staff/:idStaff', (req, res) => {
    try {
        new ServiceStaff().deleteStaff(req.params.idStaff).then(results => {
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

module.exports = router;