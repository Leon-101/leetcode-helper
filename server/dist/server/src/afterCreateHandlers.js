"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openvscode = openvscode;
const child_process_1 = require("child_process");
function openvscode(basePath, filePath) {
    (0, child_process_1.execSync)(`code ${basePath}`);
    (0, child_process_1.execSync)(`code ${filePath}`);
}
