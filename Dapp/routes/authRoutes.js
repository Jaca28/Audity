const express = require('express');
const app = express();

app.post('/login', (req, res, next) => {
    const { addr, roll  } = req.body;
    // session variables
    req.session.id = addr
    req.session.user = addr
    req.session.roll = roll
    res.status('200').send({
        roll: req.session.roll
    });
});

app.post('/logout', (req, res, next) => {
    req.session.id = false
    req.session.user = false
    res.status('200').send({
        path: '/',
    });
    res.locals.session = false;
	res.locals.active = false;
	req.session.destroy();
});

module.exports = app;