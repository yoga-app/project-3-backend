const express = require('express');
const router  = express.Router();
const GalleryItem = require('../models/GalleryItem');
const uploadMagic = require('../config/cloudinary');
const galleryItemStorage = require('../bin/galleryItemStorage.json');


/* GET home page */
router.get('/getall', (req, res, next) => {
  GalleryItem.find()
  .then(response => {
    response.reverse();
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
  if(req.body.picture == '') {req.body.picture = 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=220&h=200&fit=crop&ixid=eyJhcHBfaWQiOjF9'}
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

router.post('/likebyid/:id', (req, res, next) => {
  if(req.body.direction == 'add') {
    GalleryItem.findByIdAndUpdate(req.params.id, {
      $push: {likedBy : req.body.userID}
    }, {new: true})
    .then(response => {
      res.json({message: 'Liked successfully', updatedGalleryItem: response})
    })
    .catch(err =>{
      res.status(500).json({message: 'Something went wrong updating gallery item'})
    })
}
else if (req.body.direction == 'remove') {
  GalleryItem.findByIdAndUpdate(req.params.id, {
    $pull: {likedBy : req.body.userID}
  }, {new: true})
  .then(response => {
    res.json({message: 'Like removed successfully', updatedGalleryItem: response})
  })
  .catch(err =>{
    res.status(500).json({message: 'Something went wrong updating gallery item'})
  })
}
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