const restaurants_model = require("../models/restaurant");
const cloudinary = require("./cloudinary");
const ErrorHandling = require("../servives/service");
const restaurantMenu = require("../models/restaurant_menu");
const restaurant_review = require("../models/restaurant_review");
const ActivityPost = require("../models/restaurant_activity");
const restaurant_Event = require("../models/restaurant_events");

//////////// ******** TODO: remove this code from here **********//////////////////

exports.submitReview = ErrorHandling(async (req, res) => {
  const {
    restaurantId,
    userId,
    serviceRating,
    foodRating,
    beveragesRating,
    ambienceRating,
    staffBehaviorRating,
    overallRating,
    comment,
  } = req.body;

  const imageFiles = req.files;

  let images = [];

  for (const file of imageFiles) {
    try {
      const base64String = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64String}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "restaurant_reviews",
      });

      images.push({ url: result.secure_url });
    } catch (error) {
      console.error("Cloudinary Upload Error:", error.message);
      return res
        .status(500)
        .json({ error: "Failed to upload image", details: error.message });
    }
  }
  const review = new restaurant_review({
    restaurantId,
    userId,
    serviceRating,
    foodRating,
    beveragesRating,
    ambienceRating,
    staffBehaviorRating,
    overallRating,
    comment,
    images,
  });

  await review.save();
  res.status(201).json({ message: "Review submitted successfully.", review }); // Sending the review object as JSON
});

//////////// ******** TODO: remove this code from here **********//////////////////

exports.insertRestaurant = ErrorHandling(async (req, res) => {
  let {
    headline,
    tagline,
    operations_status,
    banner_cover,
    descripotion,
    address,
    state,
    city,
    location,
    location_url,
    timings,
    longitude,
    latitude,
    owner,
  } = req.body;
  const imageFiles = req.files;
  const uploadPromises = imageFiles.map(
    (file) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(file.buffer);
      })
  );

  const uploadResults = await Promise.all(uploadPromises);

  banner_cover = uploadResults.map((result) => ({
    url: result.secure_url,
    public_id: result.public_id,
  }));
  longitude = parseFloat(longitude);
  latitude = parseFloat(latitude);
  location = {
    type: "Point",
    coordinates: [longitude, latitude],
  };

  let finalobje = {
    headline: headline,
    tagline: tagline,
    operations_status: operations_status,
    banner_cover: banner_cover,
    descripotion: descripotion,
    address: address,
    state: state,
    city: city,
    location: location,
    location_url: location_url,
    timings: timings,
    owner: owner,
  };

  const charts = await restaurants_model.create(finalobje);
  if (charts) {
    res.status(200).json({ data: charts, message: "Data Saved" });
  } else {
    res.status(400).json({ data: charts, message: "error occur" });
  }
});

exports.getUserRestaurant = ErrorHandling(async (req, res) => {
  const { owner } = req.query;

  if (owner) {
    const data = await restaurants_model.find({
      owner: owner,
      deletedAt: null,
    });
    if (data.length) {
      res.status(200).json({ data: data, message: "Data found" });
    } else {
      res.status(400).json({
        data: data,
        message: "Data not found by this owner",
      });
    }
  } else {
    res
      .status(400)
      .json({ data: charts, message: "user or restaurant missing" });
  }
});

exports.getUserRestaurantbyid = ErrorHandling(async (req, res) => {
  const { restaurantId } = req.query;
  if (restaurantId) {
    const data = await restaurants_model.findOne({
      _id: restaurantId,
      deletedAt: null,
    });
    if (data) {
      res.status(200).json({ data: data, message: "Data found" });
    } else {
      res.status(400).json({
        data: data,
        message: "Data not found by this restaurant id",
      });
    }
  } else {
    res
      .status(400)
      .json({ data: charts, message: "user or restaurant missing" });
  }
});

exports.updateUSerRestaurant = ErrorHandling(async (req, res) => {
  let {
    headline,
    tagline,
    operations_status,
    banner_cover,
    descripotion,
    address,
    state,
    city,
    location,
    location_url,
    timings,
    longitude,
    latitude,
    owner,
  } = req.body;
  const { restaurantId } = req.query;
  if (restaurantId) {
    const check = await restaurants_model.findOne({
      _id: restaurantId,
      deletedAt: null,
    });
    if (check) {
      const imageFiles = req.files;
      if (imageFiles && imageFiles.length) {
        const uploadPromises = imageFiles.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ resource_type: "image" }, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(result);
                  }
                })
                .end(file.buffer);
            })
        );

        const uploadResults = await Promise.all(uploadPromises);

        banner_cover = uploadResults.map((result) => ({
          url: result.secure_url,
          public_id: result.public_id,
        }));
      }

      if (longitude && latitude) {
        longitude = parseFloat(longitude);
        latitude = parseFloat(latitude);
        location = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
      }

      let finalobje = {
        headline: headline,
        tagline: tagline,
        operations_status: operations_status,
        banner_cover: banner_cover,
        descripotion: descripotion,
        address: address,
        state: state,
        city: city,
        location: location,
        location_url: location_url,
        timings: timings,
        owner: owner,
      };

      const data = await restaurants_model.updateOne(
        { _id: restaurantId, deletedAt: null },
        finalobje,
        { new: true }
      );
      if (data) {
        res.status(200).json({ data: data, message: "Data Updated" });
      } else {
        res
          .status(400)
          .json({ data: data, message: "Data not updated of this restaurant" });
      }
    } else {
      res
        .status(400)
        .json({ data: check, message: "Data not found by this id" });
    }
  } else {
    res.status(400).json({ message: "restaurant missing" });
  }
});
exports.deleteRestaurant = ErrorHandling(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ message: "id missing", event });
  }
  const data = await restaurants_model.findByIdAndUpdate(
    id,
    { deletedAt: Date.now() },
    { new: true }
  );
  if (!data) {
    res.status(400).json({ message: "restaurnat not found" });
  } else {
    res.status(400).json({ message: "restaurnat delted succesfully" });
  }
});