const express = require('express');
const router = express.Router();
const asanas = require('../yoga_api.json')

router.get('/', (req, res, next) => {
  res.json(asanas)
});



module.exports = router;