const express = require('express');
const router = express.Router();
const asanas = require('../bin/yoga_api.json')
const Asana = require('../models/Asana')

router.get('/', (req, res, next) => {
  Asana.find()
  .then((response)=> {
    res.json(response)
  })
  .catch(err => {
    console.log(err);
  })
});

router.get('/:id', (req, res, next) => {
  Asana.findById( req.params.id)
  .then(oneAsana=>{
    res.json(oneAsana)
  })
  .catch(err=> {
    console.log(err);
  })
});

router.post('/data/seed/asanas', (req, res, next) => {
  if(req.body.key == "coolboy55") {
    Asana.create(asanas)
    .then((response)=> {
      res.json(`Database seeded successfully`)
    })
    .catch(err=> {
      res.json(err)
    })
  } else {
    res.status(403).json('Invalid credentials')
  }
})




module.exports = router;