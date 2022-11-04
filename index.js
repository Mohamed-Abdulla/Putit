import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./src/v1/routes/auth.js";
import boardRoute from "./src/v1/routes/board.js";
import sectionRoute from "./src/v1/routes/section.js";
import taskRoute from "./src/v1/routes/task.js";

const app = express();
dotenv.config();
//~Db connection
const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connection Successfull !"))
    .catch((err) => {
      throw err;
    });
};

//if it disconnects, it will reconnect
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//~routes
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/boards", boardRoute);
app.use("/api/v1/boards/sec", sectionRoute);
app.use("/api/v1/boards/task", taskRoute);

//HANDLE ERRORS
app.use((err, req, res, next) => {
  //follow the same order of parameters
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack, //gives extra information abt err
  });
});

//~app is running
app.listen(process.env.PORT, () => {
  connect();
  console.log("Backend is listening on port " + process.env.PORT);
});
