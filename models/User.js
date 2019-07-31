const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String, //email
  password: String,
  level: {type: String, enum:['yogi', 'guruji']},
  firstName: String,
  lastName: String,
  picture: String, //url to claudinary 
  subscription: {
                  startedDate: Date,
                  endDate: Date,
                  },  
  package: {
            classesLeft: Number,
            type: {type: String, enum: ['beginner', 'medium', 'advanced']}
            },
});


const User = mongoose.model('User', userSchema);

module.exports = User;