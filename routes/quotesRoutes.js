const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote')

router.get('/randomQuote', (req, res, next) => {
  Quote.count().exec(function (err, count) {
    // Get a random entry
    let random = Math.floor(Math.random() * count)
    // Again query all users but only fetch one offset by our random #
    Quote.findOne().skip(random).exec(
      function (err, result) {
        // Tada! random user
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
    res.status(200).json('ok')
  })
  .catch(err=> {
    res.json(err)
  })
})



module.exports = router;