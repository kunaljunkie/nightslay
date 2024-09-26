const mongoose = require('mongoose');

// Event Schema
const EventSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'restaurants',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    offers: { type: String, required: true },
    guests: { type: String, required: true },
    tagline: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
      },
    ],
    isActive: { type: Boolean, default: true },
    isCancele: { type: Boolean, default: false},
    canceleReason: { type: String },
    isPublish:{type:Boolean,default:false},
    tagline: { type: String, required: true },
    deletedAt:{type: Date, default:null}
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('event', EventSchema);

module.exports = Event;
