const mongoose = require('mongoose');

// Image Schema
const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String }
});

// Activity Post Schema
const ActivityPostSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Restaurant',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [ImageSchema],
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    deletedAt: {type:Date,default:null}
  },
  {
    timestamps: true,
  }
);

const ActivityPost = mongoose.model('ActivityPost', ActivityPostSchema);

module.exports = ActivityPost;