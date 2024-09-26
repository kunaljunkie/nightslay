
const cloudinary = require("./cloudinary");
const ErrorHandling = require("../servives/service");
const ActivityPost = require("../models/restaurant_activity");
const { SetCache } = require("../db/redis");
const key = 'Activities'

exports.createActiveityPost = ErrorHandling(async (req, res) => {
    const { restaurantId, title, description } = req.body;
  
    if (!restaurantId || !title || !description) {
      return res
        .status(400)
        .json({ error: "restaurantId, title, and description are required" });
    }
  
    // try {
    let images = [];
    let imageFiles = req.files;
  
    // Upload images to Cloudinary
    for (const file of imageFiles) {
      try {
        const base64String = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64String}`;
  
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "restaurant_activity_posts",
        });
  
        images.push({ url: result.secure_url });
      } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        return res
          .status(500)
          .json({ error: "Failed to upload image", details: error.message });
      }
    }
  
    // Create new activity post
    const activityPost = new ActivityPost({
      restaurantId,
      title,
      description,
      images,
    });
  
    const data = await activityPost.save();
    await SetCache(key,data)
    if (data) {
      res
        .status(201)
        .json({ message: "Activity post created successfully", activityPost });
    } else {
      res
        .status(201)
        .json({ message: "unable to create activity post", activityPost });
    }
  });
  
  exports.getAllRestaurantActivityPost = ErrorHandling(async (req, res) => {
    const { restaurantId } = req.query;
    if (restaurantId) {
      const activityPosts = await ActivityPost.find({
        restaurantId: restaurantId,
        deletedAt: null,
      }).sort({ createdAt: -1 });
      if (activityPosts) {
        res.status(200).json(activityPosts);
      } else {
        res.status(400).json({ message: "no data found" });
      }
    } else {
      res.status(400).json({ message: "restaurant missing" });
    }
  });
  
  exports.getbyidPost = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    if (id) {
      const activityPost = await ActivityPost.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!activityPost) {
        return res.status(404).json({ error: "Activity post not found" });
      }
      res.status(200).json(activityPost);
    } else {
      res.status(400).json({ message: "id missing" });
    }
  });
  exports.updateRestaurantPost = ErrorHandling(async (req, res) => {
    const { id } = req.query;
    const { title, description } = req.body;
    if (id) {
      const activityPost = await ActivityPost.findById(id);
      if (!activityPost) {
        return res.status(404).json({ error: "Activity post not found" });
      }
      if (title) activityPost.title = title;
      if (description) activityPost.description = description;
  
      if (req.files && req.files.length > 0) {
        activityPost.images = [];
        for (const file of req.files) {
          try {
            const base64String = file.buffer.toString("base64");
            const dataUri = `data:${file.mimetype};base64,${base64String}`;
            const result = await cloudinary.uploader.upload(dataUri, {
              folder: "restaurant_activity_posts",
            });
            activityPost.images.push({ url: result.secure_url });
          } catch (error) {
            console.error("Cloudinary Upload Error:", error.message);
            return res
              .status(500)
              .json({ error: "Failed to upload image", details: error.message });
          }
        }
      }
      const data = await ActivityPost.updateOne(
        { _id: id, deletedAt: null },
        activityPost,
        { new: true }
      );
      await SetCache(key,activityPost)
      if (data) {
        res
          .status(201)
          .json({ message: "Activity post updated successfully", activityPost });
      } else {
        res
          .status(201)
          .json({ message: "unable to update activity post", activityPost });
      }
    } else {
      res.status(400).json({ message: "id missing" });
    }
  });
  
  exports.DeleteRestaurantPost = ErrorHandling(async (req, res) => {
    const { id } = req.query;
  
    const activityPost = await ActivityPost.findByIdAndUpdate(
      id,
      { deletedAt: Date.now() },
      { new: true }
    );
  
    if (!activityPost) {
      return res.status(404).json({ error: "Activity post not found" });
    }
  
    res.status(200).json({ message: "Activity post deleted successfully" });
  });
  