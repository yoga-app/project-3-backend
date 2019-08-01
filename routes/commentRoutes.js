const express = require('express');
const router  = express.Router();
const Comment = require('../models/Comment')

/* GET home page */
router.get('/getbyid/:id', (req, res, next) => {
  Comment.findById(req.params.id).populate('author')
  .then((comment) => {
    res.json(comment)
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong fetching comment by ID'})
  })
});

router.post('/create', (req, res, next) => {
  if(req.body.liked) {}
  Comment.create(req.body)
  .then(newComment=> {
    res.json({message: 'New comment created successfully', newComment: newComment})
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong creating new comment'})
  })
})

router.post('/deletebyid/:id', (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id)
  .then(()=> {
    res.json({message: 'Comment deleted'})
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong deleting the comment'})
  })
})

router.post('/updatebyid/:id', (req, res, next)=> {
  req.body.edited = true;
  Comment.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then((updatedComment)=> {
    res.json({message: 'Comment successfully updated', updatedComment: updatedComment})
  })
  .catch(err=> {
    res.status(500).json({message: 'Something went wrong updating comment'})
  })
})

router.get('/getall', (req, res, next) => {
  Comment.find().populate('author')
  .then(allComments => {
    res.json(allComments)
  })
  .catch(err=> {
    res.status(500).json({message: "Something went wrong getting all the comments"})
  })
})

module.exports = router;
