// Import Express and Router
var express = require('express');
var router = express.Router();

// Get
router.get('/', function (req, res) {
  res.render('index', {
    title: 'Come one, come all to my chatroom',
    lead: 'Insert your user name and start talk'
  });
});

module.exports = router;
