import express from "express";
import path from "path";
import logger from "morgan";
import globalRouter from "./routers";

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(globalRouter);

const config = require('config-lite')(__dirname);
const port = process.env.PORT || config.port || 3000;
app.listen(port, () => {
	console.log("listening on " + port);
})
