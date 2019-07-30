const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const quotes = require('../bin/quotes.json');

router.get('/randomQuote', (req, res, next) => {
  Quote.countDocuments().exec(function (err, count) {
    let random = Math.floor(Math.random() * count)
    Quote.findOne().skip(random).exec(
      function (err, result) {
        res.json(result) 
      })
  })
});

router.get('/allQuotes', (req, res, next) => {
  Quote.find().exec(function (err, response) {
    if(err){res.status(500).json('Something went wrong getting all quotes')}
    res.json(response) 
      
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


router.post('/data/seed/quotes', (req, res, next) => {
  if(req.body.key == "coolboy55") {
    Quote.create(quotes)
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