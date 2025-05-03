"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generators = __importStar(require("../codeGenerators"));
const creationSuccessHandlers = __importStar(require("../afterFileCreationSuccess"));
const router = express_1.default.Router();
const config = require('config-lite')(__dirname);
// 本地作答
router.post('/solve-local', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prob = req.body;
    try {
        // 获取当前语言的代码生成器
        const langName = prob.langName;
        let generateFiles = (_a = generators[langName]) === null || _a === void 0 ? void 0 : _a.generateFiles;
        if (!generateFiles) {
            console.warn("使用默认的代码生成器");
            generateFiles = generators._default.generateFiles;
        }
        // 创建文件
        let success = true;
        const results = yield Promise.all(generateFiles(prob).map((_a) => __awaiter(void 0, [_a], void 0, function* ({ filePath, fileContent }) {
            filePath = path_1.default.resolve(config.lcBasePath, filePath);
            const result = yield createFile(filePath, fileContent);
            console.log(result);
            if (!result.success)
                success = false;
            return result;
        })));
        // 文件创建成功之后执行自定义操作
        if (success) {
            const handlerName = config["afterFileCreationSuccess"];
            creationSuccessHandlers[handlerName](results);
        }
        return res.status(success ? 200 : 400).json({ message: results });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
}));
/**
 * 根据文件路径和内容创建文件
 * 若文件已存在则忽略
 */
function createFile(filePath, fileContent) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!filePath) {
            return { filePath, success: false, message: "文件路径为空" };
        }
        // 文件已存在
        try {
            yield fs_1.default.promises.access(filePath);
            return { filePath, success: true, message: "文件已存在" };
        }
        catch (err) { }
        // 文件不存在，尝试创建文件以及目录并写入内容
        try {
            const dirPath = path_1.default.dirname(filePath);
            yield fs_1.default.promises.mkdir(dirPath, { recursive: true });
            yield fs_1.default.promises.writeFile(filePath, fileContent);
        }
        catch (err) {
            console.error(err);
            return { filePath, success: false, message: "文件创建失败：" + err.message };
        }
        return { filePath, success: true, message: "文件创建成功" };
    });
}
/**
 * 检查文件路径是否合法
 * @param {string} userPath - 用户提供的文件路径
 * @param {string} allowedDir - 允许的目录路径
 * @returns {boolean} 如果路径合法，则返回 true；否则返回 false
 */
function isValidPath(userPath, allowedDir) {
    const basePath = path_1.default.resolve(allowedDir);
    const resolvedPath = path_1.default.resolve(basePath, userPath);
    // 检查路径是否在允许的目录内
    return resolvedPath.startsWith(basePath);
}
exports.default = router;
