const express = require('express');
const router  = express.Router();
const Testimonial = require('../models/Testimonial');
const uploadMagic = require('../config/cloudinary');
const goodies = require('../bin/testimonials.json');


/* GET home page */
router.get('/getall', (req, res, next) => {
  Testimonial.find()
  .then(response => {
    response.reverse();
    res.json(response);
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong getting all testimonials'})
  })
});

router.post('/create', uploadMagic.single('picture'), (req, res, next) => {
  if(req.file) {req.body.picture = req.file.url}
  Testimonial.create(req.body)
  .then((newTestimonial) => {
    res.json({message: 'Created testimonial successfully', newTestimonial: newTestimonial})
  })
  .catch(err => {
    res.status(500).json({message: 'Something went wrong creating testimonial'})
  })
})

router.post('/deletebyid/:id', (req, res, next) => {
  Testimonial.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.json({message: 'Deleted successfully'})
  })
  .catch(err=>{
    res.status(500).json({message: 'Something went wrong deleting testimonial'})
  })
})


router.post('/updatebyid/:id', uploadMagic.single('picture'), (req, res, next) => {
  if(req.file) {req.body.picture = req.file.url}
  Testimonial.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(response => {
    res.json({message: 'Updated successfully', updatedTestimonial: response})
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong updating testimonial'})
  })
})


router.post('/data/seed/testimonials', (req, res, next) => {
  if(req.body.key == "coolboy55") {
    Testimonial.create(goodies)
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