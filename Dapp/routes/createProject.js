const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let sidebar = false
  let roll
  if(req.session.user) {
    sidebar = true
    roll = req.session.roll
  }
  res.render('createProject', { sidebar: sidebar, roll: roll });
});

module.exports = router;
