"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const routers_1 = __importDefault(require("./routers"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(routers_1.default);
const config = require('config-lite')(__dirname);
const port = process.env.PORT || config.port || 3000;
app.listen(port, () => {
    console.log("listening on " + port);
});
