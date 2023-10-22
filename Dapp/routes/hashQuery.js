const express = require('express');
const router = express.Router();

/* GET Hash Query page. */
router.get('/', function(req, res, next) {
    let sidebar = false
    let roll
    if (req.session.user) {
        sidebar = true
        console.log(req.session.roll)
        roll = req.session.roll
    }
    res.render('hashQuery', { title: 'Block E Design', sidebar: sidebar, roll: roll });
});

module.exports = router;