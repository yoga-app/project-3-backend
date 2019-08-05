const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const galleryItemSchema = new Schema ({
    picture: {type: String, default: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=220&h=200&fit=crop&ixid=eyJhcHBfaWQiOjF9'}, //url to claudinary 
    video: String,
    title: String,
    text: String,
    category: [{type: String}],
    likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
})


const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);



module.exports = GalleryItem;