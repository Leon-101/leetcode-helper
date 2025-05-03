import { execSync } from "child_process";
import { afterFileCreationSuccess, FileCreationResult } from "../../common/interfaces";
const config = require('config-lite')(__dirname);
const lcBasePath = config["lcBasePath"];

export const doNothing: afterFileCreationSuccess = (results: FileCreationResult[]) => { }

export const openVscode: afterFileCreationSuccess = (results: FileCreationResult[]) => {
	console.log("open VSCode");
	execSync(`code "${lcBasePath}"`);
	execSync(`code "${results[0].filePath}"`);
}
