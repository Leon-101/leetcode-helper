"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./api"));
const router = express_1.default.Router();
// 允许来自leetcode.cn的cors请求
router.use((0, cors_1.default)({
    origin: 'https://leetcode.cn',
    optionsSuccessStatus: 200 // 一些浏览器需要在预检请求中返回200
}));
router.get('/', function (req, res, next) {
    res.json({ message: "Hi~" });
});
router.use("/api", api_1.default);
exports.default = router;
