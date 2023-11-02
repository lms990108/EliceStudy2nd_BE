import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import logger from "./batch/logger";
import cookieParser from "cookie-parser";

import pingRouter from "./routers/pingRouter";
import postRouter from "./routers/postRouter";
import promotionRouter from "./routers/promotionRouter";
import commentRouter from "./routers/commentRouter";
import showRouter from "./routers/showRouter";
import userRouter from "./routers/userRouter";

dotenv.config();

const app = express();
const port: string = process.env.PORT;
const mongoURI: string = process.env.MONGO_DB_PATH;

mongoose
  .connect(mongoURI as string)
  .then(() => logger.info("mongoose connected"))
  .catch((err: Error) => logger.error("DB connection fail", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// log directory check
const logDir = path.join(__dirname, "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: morganStream }));
} else {
  app.use(morgan("dev", { stream: morganStream }));
}

app.use("/api/ping", pingRouter);
app.use("/api/board", postRouter);
app.use("/api/promotion", promotionRouter);
app.use("/api/comment", commentRouter);
app.use("/api/show", showRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  logger.info(`server is running on ${port}`);
});
