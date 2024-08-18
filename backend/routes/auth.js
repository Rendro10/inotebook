const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "arkaisagoodb$oy";

// ROUTE 1->creat a user using : POST "/api/auth/createuser". it doesn't require login
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name->").isLength({ min: 3 }),
    body("email", "Enter a valid email->").isEmail(),
    body("password", "Enter a valid password->").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check wheather the user email exits already or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry user with this email already exists" });
      }

      // generating salt for hash->
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //creating a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//ROUTE 2-> creat a user using : POST "/api/auth/createuser". it doesn't require login
router.post(
  "/login",
  [
    body("email", "Enter a valid email->").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    // if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({
            error: "Please try to login with right usename and password",
          });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            error: "Please try to login with right usename and password",
          });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//ROUTE 2-> get logged in user details using : POST "/api/auth/getuser".require login.
router.post(
  "/getuser",fetchuser ,async (req, res) => {
    try {
      userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  })
module.exports = router;
