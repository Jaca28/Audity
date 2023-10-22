const express = require('express');
const router = express.Router();

/* GET Set user page. */
router.get('/', function(req, res, next) {
    let sidebar = false
    let roll
    if (req.session.user) {
        sidebar = true
        roll = req.session.roll
    }
    res.render('setUser', { title: 'Block E Design', sidebar: sidebar, roll: roll });
});

module.exports = router;