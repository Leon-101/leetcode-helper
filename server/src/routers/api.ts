import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { FileCreationResult, ProblemInfo } from "../../../common/interfaces";
import * as generators from "../codeGenerators";
import * as creationSuccessHandlers from "../afterFileCreationSuccess";

const router = express.Router();
const config = require('config-lite')(__dirname);

// 本地作答
router.post('/solve-local', async (req, res) => {
  const prob: ProblemInfo = req.body;

  try {
    // 获取当前语言的代码生成器
    const langName = prob.langName as keyof typeof generators;
    let generateFiles = generators[langName]?.generateFiles;
    if (!generateFiles) {
      console.warn("使用默认的代码生成器");
      generateFiles = generators._default.generateFiles;
    }

    // 创建文件
    let success = true;
    const results: FileCreationResult[] = await Promise.all(generateFiles(prob).map(async ({ filePath, fileContent }) => {
      filePath = path.resolve(config.lcBasePath, filePath);
      const result = await createFile(filePath, fileContent);
      console.log(result);
      if (!result.success) success = false;
      return result;
    }));

    // 文件创建成功之后执行自定义操作
    if (success) {
      const handlerName = config["afterFileCreationSuccess"] as keyof typeof creationSuccessHandlers;
      creationSuccessHandlers[handlerName](results);
    }

    return res.status(success ? 200 : 400).json({ message: results });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

/**
 * 根据文件路径和内容创建文件
 * 若文件已存在则忽略
 */
async function createFile(filePath: string, fileContent: string): Promise<FileCreationResult> {
  if (!filePath) {
    return { filePath, success: false, message: "文件路径为空" };
  }

  // 文件已存在
  try {
    await fs.promises.access(filePath);
    return { filePath, success: true, message: "文件已存在" };
  } catch (err) { }

  // 文件不存在，尝试创建文件以及目录并写入内容
  try {
    const dirPath = path.dirname(filePath);
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.writeFile(filePath, fileContent);
  } catch (err: any) {
    console.error(err);
    return { filePath, success: false, message: "文件创建失败：" + err.message };

  }
  return { filePath, success: true, message: "文件创建成功" };
}


/**
 * 检查文件路径是否合法
 * @param {string} userPath - 用户提供的文件路径
 * @param {string} allowedDir - 允许的目录路径
 * @returns {boolean} 如果路径合法，则返回 true；否则返回 false
 */
function isValidPath(userPath: string, allowedDir: string) {
  const basePath = path.resolve(allowedDir);
  const resolvedPath = path.resolve(basePath, userPath);

  // 检查路径是否在允许的目录内
  return resolvedPath.startsWith(basePath);
}

export default router;
