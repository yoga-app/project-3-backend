const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote')

router.get('/randomQuote', (req, res, next) => {
  Quote.countDocuments().exec(function (err, count) {
    let random = Math.floor(Math.random() * count)
    Quote.findOne().skip(random).exec(
      function (err, result) {
        res.json(result) 
      })
  })
});

router.post('/addQuote', (req, res, next)=> {
  Quote.create({
    text: req.body.text,
    author: req.body.author
  })
  .then(()=> {
    res.status(200).json('Quote added successfully')
  })
  .catch(err=> {
    res.json(err)
  })
})



module.exports = router;