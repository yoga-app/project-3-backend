const express = require('express');
const router  = express.Router();
const FAQ     = require('../models/QandA')
const faqList = require('../bin/faq.json')

/* GET home page */
router.get('/getall', (req, res, next) => {
  FAQ.find()
  .then((response)=> {
    response.reverse()
    res.json(response)
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong getting all FAQs'})
  })
});

router.post('/create', (req, res, next) => {
  FAQ.create(req.body)
  .then((newFAQ)=> {
    res.json({message: 'FAQ created successfully', newFAQ: newFAQ})
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong creating FAQ'})
  })
})

router.post('/data/seed/faq', (req, res, next) => {
  if(req.body.key == "coolboy55") {
    FAQ.create(faqList)
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

router.post('/deletebyid/:id', (req, res, next) => {
  FAQ.findByIdAndRemove(req.params.id)
  .then(()=> {
    res.json({message: 'Deleted successfully'})
  })
  .catch(err=> {
    res.status(500).json({message: "Something went wrong deleting FAQ"})
  })
})

router.post('/updatebyid/:id', (req, res, next) => {
  FAQ.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then((updated) => {
    res.json({message: "Updated successfully", updated: updated})
  })
  .catch(err => {
    res.status(500).json({message: 'Something went wrong updating FAQ'})
  })
})

module.exports = router;
