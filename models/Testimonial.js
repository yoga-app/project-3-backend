const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const testimonialSchema = new Schema ({
    picture: {type: String, default: 'https://res.cloudinary.com/ironhack55/image/upload/v1564588169/default-profile_tlj5l0.png'}, //url to claudinary 
    text: String,
    author: String,
    attended: String,
    rating: String,
})


const Testimonial = mongoose.model('Testimonial', testimonialSchema);



module.exports = Testimonial;