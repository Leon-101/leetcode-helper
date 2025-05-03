"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openVscode = exports.doNothing = void 0;
const child_process_1 = require("child_process");
const config = require('config-lite')(__dirname);
const lcBasePath = config["lcBasePath"];
const doNothing = (results) => { };
exports.doNothing = doNothing;
const openVscode = (results) => {
    console.log("open VSCode");
    (0, child_process_1.execSync)(`code "${lcBasePath}"`);
    (0, child_process_1.execSync)(`code "${results[0].filePath}"`);
};
exports.openVscode = openVscode;
