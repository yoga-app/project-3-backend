const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new Schema ({

    title: String,
    text: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    edited: Boolean,
    liked: Number,


}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;