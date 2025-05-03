import express, { Request, Response } from "express";
import cors from "cors";
import apiRouter from "./api";

const router = express.Router();

// 允许来自leetcode.cn的cors请求
router.use(cors({
  origin: 'https://leetcode.cn',
  optionsSuccessStatus: 200 // 一些浏览器需要在预检请求中返回200
}));

router.get('/', function (req, res, next) {
  res.json({ message: "Hi~" });
});

router.use("/api", apiRouter);

export default router;
