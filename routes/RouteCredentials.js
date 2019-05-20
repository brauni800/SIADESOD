const express = require('express');
const jwt = require('jsonwebtoken');
const ServiceCredentials = require('../services/ServiceCredentials');
const secret = require('../config').secretKey;

const router = express.Router();

router.post('/login', (req, res) => {
    try {
        new ServiceCredentials().verifyUser(req.body)
        .then((/**@type {Object[]} */results) => {
            if (results.length > 0) {
                jwt.sign({
                    id: results[0].id,
                    email: results[0].email,
                    userType: results[0].userType,
                    admin: Boolean.apply(results[0].admin),
                }, secret, (err, token) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(409);
                    }
                    else res.status(202).json({ token });
                });
            }
            else res.sendStatus(204);
        })
        .catch(error => res.status(409).json({ error: error.sqlMessage }));
    } catch (error) {
        res.status(409).json({ error });
    }
});

module.exports = router;