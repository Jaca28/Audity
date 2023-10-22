const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    let sidebar = false
    let roll
    if(req.session.user) {
    sidebar = true
    roll = req.session.roll
    }
    console.log(roll)
    res.render('projects', { title: 'Block E Design', sidebar: sidebar, roll: roll });

});

module.exports = router;