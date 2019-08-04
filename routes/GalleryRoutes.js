const express = require('express');
const router  = express.Router();
const GalleryItem = require('../models/GalleryItem');
const uploadMagic = require('../config/cloudinary');
const galleryItemStorage = require('../bin/galleryItemStorage.json');


/* GET home page */
router.get('/getall', (req, res, next) => {
  GalleryItem.find()
  .then(response => {
    res.json(response);
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong getting all Gallery Items'})
  })
});

router.get('/getbyid/:id', (req, res, next) => {
  GalleryItem.findById(req.params.id)
  .then(response => {
    res.json(response);
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong getting  Gallery Item by id'})
  })
});

router.post('/create', uploadMagic.single('picture'), (req, res, next) => {
  if(req.file) {req.body.picture = req.file.url}
  if(req.body.video) {
    let temp = req.body.video.replace('watch?v=', 'embed/')
    req.body.video = temp;
  }
  if(req.body.category) {
    let temp = req.body.category
    .split(',')
    .map(Function.prototype.call, String.prototype.trim)
    req.body.category = temp
  }
  GalleryItem.create(req.body)
  .then((newGalleryItem) => {
    res.json({message: 'Gallery Item created successfully', newGalleryItem: newGalleryItem})
  })
  .catch(err => {
    res.status(500).json({message: 'Something went wrong creating Gallery Item'})
  })
})

router.post('/deletebyid/:id', (req, res, next) => {
  GalleryItem.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.json({message: 'Deleted successfully'})
  })
  .catch(err=>{
    res.status(500).json({message: 'Something went wrong deleting Gallery Item'})
  })
})


router.post('/updatebyid/:id', uploadMagic.single('picture'), (req, res, next) => {
  if(req.file) {req.body.picture = req.file.url}
  if(req.body.video) {
    let temp = req.body.video.replace('watch?v=', 'embed/')
    req.body.video = temp;
  }
  if(req.body.category) {
    let temp = req.body.category
    .split(',')
    .map(Function.prototype.call, String.prototype.trim)
    req.body.category = temp
  }
  GalleryItem.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(response => {
    res.json({message: 'Updated successfully', updatedGalleryItem: response})
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong updating testimonial'})
  })
})


router.post('/data/seed/galleryitem', (req, res, next) => {
  if(req.body.key == "coolboy55") {
    GalleryItem.create(galleryItemStorage)
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