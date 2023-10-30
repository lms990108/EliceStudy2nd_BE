import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import postRouter from "./routers/postRouter";

dotenv.config();

const app = express();
const port: string = process.env.PORT;
const mongoURI: string = process.env.MONGO_DB_PATH;

mongoose
  .connect(mongoURI as string)
  .then(() => console.log("mongoose connected"))
  .catch((err: Error) => console.error("DB connection fail", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // morgan: 로그를 찍어주는 미들웨어, 서버에 요청이 어떻게 들어오는지 보기 편하고 로그를 남겨서 디버깅에 용이

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use("/api/board", postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
