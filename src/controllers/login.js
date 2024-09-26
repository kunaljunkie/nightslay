const ErrorHandling = require("../servives/service");
const userModel = require("../models/restaurant_owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = ErrorHandling(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        token: token,
        refreshToken: refreshToken,
        message: "Login Successfull",
        user: user,
        reseller: user.reseller,
      });
    } else {
      res
        .status(400)
        .json({ message: "Invalid credentials or Wrong Password" });
    }
  } else {
    res.status(400).json({ message: `User not found by this email: ${email}` });
  }
});

exports.findByIduser = ErrorHandling(async (req, res) => {
  const { userid } = req.query;
  if (userid) {
    const userdata = await userModel.findById(userid);
    if (userdata) {
      res.status(200).json({ data: userdata, message: `User found` });
    } else {
      res.status(400).json({ message: `User not found` });
    }
  } else {
  }
});

exports.createuser = ErrorHandling(async (req, res) => {
  const { name, email, password } = req.body;
  if (email && name && password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = await userModel.create(req.body);
    if (user) {
      res.status(200).json({ data: user, message: "Data Saved" });
    } else {
      res.status(400).json({ data: user, message: "error occur" });
    }
  }
});

exports.getResellerbyUserid = ErrorHandling(async (req, res) => {
  const { userid } = req.query;
  if (userid) {
    const user = await userModel.findById(userid).populate("reseller");
    if (user) {
      if (user.reseller) {
        res
          .status(200)
          .json({ reseller: user.reseller, message: "Data found" });
      } else {
        res.status(200).json({ reseller: user.reseller, message: "Data found" });
      }
    } else {
      res.status(400).json({ data: reseller, message: "user is missing" });
    }
  } else {
    res.status(400).json({ data: reseller, message: "user Id is missing" });
  }
});

exports.createNewtokenByrefresh = ErrorHandling(async (req, res) => {
  let { userid } = req.query;
  const user = await userModel.findById(userid);
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    token: token,
    message: "new session successfull",
  });
});
