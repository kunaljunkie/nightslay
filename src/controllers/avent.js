const restaurants_model = require("../models/restaurant");
const cloudinary = require("./cloudinary");
const ErrorHandling = require("../servives/service");
const restaurantMenu = require("../models/restaurant_menu");
const restaurant_review = require("../models/restaurant_review");
const ActivityPost = require("../models/restaurant_activity");
const restaurant_Event = require("../models/restaurant_events");


exports.CreateRestaurantEvent = ErrorHandling(async (req, res) => {
    const { restaurantId, title, description, date, location } = req.body;
    if (!restaurantId || !title || !description || !date || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }
    let images = [];
    for (const file of req.files) {
      try {
        const base64String = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64String}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "restaurant_events",
        });
        images.push({ url: result.secure_url });
      } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        return res
          .status(500)
          .json({ error: "Failed to upload image", details: error.message });
      }
    }
    req.body.images = images;
    const event = new restaurant_Event(req.body);
  
    const data = await event.save();
    if (data) {
      res.status(201).json({ message: "Event created successfully", data });
    } else {
      res.status(400).json({ message: "failed to created event" });
    }
  });
  
  exports.getallRestaurantEvent = ErrorHandling(async (req, res) => {
    const { restaurantId } = req.query;
    if (restaurantId) {
      const events = await restaurant_Event
        .find({ restaurantId: restaurantId, deletedAt: null })
        .sort({ createdAt: -1 });
      if (!events) {
        return res.status(200).json({ message: "no event found" });
      }
      res.status(200).json(events);
    } else {
      res.status(200).json({ message: "restaurant missing" });
    }
  });
  exports.getallRestaurantEventbyid = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (id) {
      const events = await restaurant_Event.findOne({ _id: id, deletedAt: null });
      if (!events) {
        return res.status(200).json({ message: "no event found" });
      }
      res.status(200).json({ message: "no event found", data: events });
    } else {
      res.status(200).json({ message: "id missing" });
    }
  });
  exports.DeleteRestaurantEvent = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    const events = await restaurant_Event.findByIdAndUpdate(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(events);
  });
  exports.updateRestaurantEvent = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (id) {
      const { title, description, date, location, isActive, restaurantId } =
        req.body;
      const event = await restaurant_Event.findById(id);
  
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = new Date(date);
      if (location) event.location = location;
      if (typeof isActive === "boolean") event.isActive = isActive;
  
      if (req.files && req.files.length > 0) {
        event.images = [];
        for (const file of req.files) {
          try {
            const base64String = file.buffer.toString("base64");
            const dataUri = `data:${file.mimetype};base64,${base64String}`;
            const result = await cloudinary.uploader.upload(dataUri, {
              folder: "restaurant_events",
            });
            event.images.push({ url: result.secure_url });
          } catch (error) {
            console.error("Cloudinary Upload Error:", error.message);
            return res
              .status(500)
              .json({ error: "Failed to upload image", details: error.message });
          }
        }
      }
  
      const data = await event.updateOne(
        { _id: id, restaurantId: restaurantId, deletedAt: null },
        event,
        { new: true }
      );
      if (data) {
        res.status(200).json({ message: "Event updated successfully", event });
      } else {
        res.status(400).json({ message: "unable to Event updated", event });
      }
    } else {
      res.status(200).json({ message: "id missing" });
    }
  });
  