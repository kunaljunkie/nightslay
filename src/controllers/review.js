const restaurants_model = require("../models/restaurant");
const cloudinary = require("./cloudinary");
const ErrorHandling = require("../servives/service");
const restaurantMenu = require("../models/restaurant_menu");
const restaurant_review = require("../models/restaurant_review");
const ActivityPost = require("../models/restaurant_activity");
const restaurant_Event = require("../models/restaurant_events");


exports.respondToReview = ErrorHandling(async (req, res) => {
    const { reviewId } = req.query;
    const { responder, message } = req.body;
    if (reviewId) {
      if (responder) {
        const review = await restaurant_review.findById(reviewId);
  
        if (!review) {
          return res.status(404).send("Review not found.");
        }
  
        review.response = {
          responder,
          message,
        };
  
        const data = await review.save();
        if (data) {
          res.status(200).json({ data: data, message: "response added" });
        } else {
          res.status(200).json({ data: data, message: "unable to add response" });
        }
      } else {
        res.status(400).json({ message: "responder missing" });
      }
    } else {
      res.status(400).json({ message: "review id is missing" });
    }
  });
  
  exports.restaurantReviews = ErrorHandling(async (req, res) => {
    const { restaurantId } = req.query;
    if (restaurantId) {
      const review = await restaurant_review.find({ restaurantId: restaurantId });
      if (!review) {
        res.status(400).json({ data: review, message: "reviews not found" });
      } else {
        res.status(200).json({ data: review, message: "reviews found" });
      }
    } else {
      res.status(400).json({ message: "restaurant missing" });
    }
  });
  
  exports.updateReviewResposne = ErrorHandling(async (req, res) => {
    const { reviewId } = req.query;
    const { responder, message } = req.body;
  
    if (reviewId) {
      if (responder) {
        if (!responder || !message) {
          return res
            .status(400)
            .json({ error: "Responder name and message are required" });
        }
        const review = await restaurant_review.findById(reviewId);
  
        if (!review) {
          return res.status(404).json({ error: "Review not found" });
        }
        review.response = {
          responder,
          message,
          date: new Date(),
        };
  
        const data = await review.save();
        if (data) {
          res.status(200).json({ data: data, message: "response updated" });
        } else {
          res
            .status(200)
            .json({ data: data, message: "unable to update response" });
        }
      } else {
        res.status(400).json({ message: "responder is missing" });
      }
    } else {
      res.status(400).json({ message: "review id missing" });
    }
  });
  
  exports.deleteReview = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ message: "id missing", event });
    }
    const data = await restaurant_review.findByIdAndUpdate(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );
    if (!data) {
      res.status(400).json({ message: "review not found", event });
    } else {
      res.status(400).json({ message: " delted succesfully", event });
    }
  });
  