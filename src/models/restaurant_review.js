const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
});

const ResponseSchema = new mongoose.Schema({
  responder: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const ReviewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "restaurants",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "restaurant_owner",
    },
    serviceRating: { type: Number, min: 1, max: 5 },
    foodRating: { type: Number, min: 1, max: 5 },
    beveragesRating: { type: Number, min: 1, max: 5 },
    ambienceRating: { type: Number, min: 1, max: 5 },
    staffBehaviorRating: { type: Number, min: 1, max: 5 },
    overallRating: { type: Number, min: 1, max: 5 },
    eventRating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      default: null,
    },
    comment: { type: String, required: true },
    images: [ImageSchema],
    response: ResponseSchema,
    date: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
