const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String, //email
  password: String,
  level: {type: String, enum:['yogi', 'guruji'], default: 'yogi'},
  firstName: String,
  lastName: String,
  picture: {type: String, default: 'https://res.cloudinary.com/ironhack55/image/upload/v1564588169/default-profile_tlj5l0.png'}, //url to claudinary 
  subscription: {
                  startedDate: Date,
                  endDate: Date,
                  },  
  package: {
            classesLeft: Number,
            type: {type: String, enum: ['beginner', 'medium', 'advanced']}
            }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;