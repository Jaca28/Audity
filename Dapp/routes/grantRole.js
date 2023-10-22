var express = require('express');
var router = express.Router();


/* GET grantRole page. */
router.get('/', function (req, res, next) {
    let sidebar = false
    let roll
    if (req.session.user) {
        sidebar = true
        roll = req.session.roll
    }
    res.render('grantRole', { title: 'Block E Design', sidebar: sidebar, roll: roll });
});

module.exports = router;