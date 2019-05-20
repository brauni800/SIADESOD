const express = require('express');
const ServiceDentist = require('../services/ServiceDentist');

const router = express.Router();

/**
 * Registra un dentista en la base de datos.
 */
router.post('/dentist', (req, res) => {
    try {
        new ServiceDentist(req.headers.authorization).createDentist(req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtiene una lista de todos los dentistas en la base de datos.
 */
router.get('/dentist', (req, res) => {
    try {
        new ServiceDentist(req.headers.authorization).getAllDentists()
        .then(results => res.status(200).json(results))
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Obtiene a un dentista de la base de datos con base a su id.
 */
router.get('/dentist/:idDentist', (req, res) => {
    try {
        new ServiceDentist(req.headers.authorization).getDentist(req.params.idDentist)
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
 * Elimina un dentista de la base de datos con base a su id.
 */
router.delete('/dentist/:idDentist', (req, res) => {
    try {
        new ServiceDentist(req.headers.authorization).deleteDentist(req.params.idDentist)
        .then(results => {
            if (results.affectedRows > 0) res.sendStatus(200);
            else res.sendStatus(204);
        })
    } catch (error) {
        res.status(409).json({ error });
    }
});

/**
 * Actualiza un dentista en la base de datos con base a su id.
 * Se pasan únicamente los datos del paciente que se desean actualizar.
 */
router.put('/dentist/:idDentist', (req, res) => {
    try {
        new ServiceDentist(req.headers.authorization).editDentist(req.params.idDentist, req.body)
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