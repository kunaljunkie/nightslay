const mongoose = require("mongoose");
const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant_owner",
    },
    headline: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
    },
    operations_status: {
      type: String,
      required: true,
    },
    banner_cover: {
      type: Array,
      required: true,
    },
    descripotion: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    location: {
      type: {
        type: String, 
        enum: ['Point'], 
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    location_url: {
      type: String,
    },
    timings: {
      type: Array,
    },
    status: {
      type: Boolean,
      default:true
    },
    deletedAt: {
      type: Date,
      default: null
    },
  },
  {
    timestamps: true,
  }
);
restaurantSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("restaurants", restaurantSchema);
