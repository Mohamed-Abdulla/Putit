import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { createError } from "../handlers/error.js";
import jwt from "jsonwebtoken";

//~Register

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      username: `${req.body.firstName} ${req.body.lastName}`,
      password: hash,
    });

    const user = await newUser.save();
    // console.log(savedUser);
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "5d",
    });
    // res.status(201).json({ message: "User created successfully" });
    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json(savedUser._doc);

    res.status(201).json({ user: user._doc, access_token: token });
  } catch (error) {
    next(error);
  }
};

//~Login

export const login = async (req, res, next) => {
  try {
    //checking user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found"));

    //checking password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(401, "Password is incorrect"));
    }
    //if correct, create token
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "5d" }
    );
    //setting token in to cookies using cookie-parser
    const { password, isAdmin, ...otherDetails } = user._doc;
    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({
    //     details: { ...otherDetails },
    //     isAdmin,
    //   });

    res.status(200).json({ ...otherDetails, access_token: token });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY);
      // res
      //   .cookie("access_token", token, {
      //     httpOnly: true,
      //   })
      //   .status(200)
      //   .json(user._doc);

      res.status(200).json({ user: user._doc, access_token: token });
    } else {
      const password = req.body.email + process.env.PASSWORD_SECRET_KEY;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = new User({ ...req.body, password: hash });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.TOKEN_SECRET_KEY);
      // res
      //   .cookie("access_token", token, {
      //     httpOnly: true,
      //   })
      //   .status(200)
      //   .json(savedUser._doc);

      res.status(200).json({ user: savedUser._doc, access_token: token });
    }
  } catch (err) {
    next(err);
  }
};
