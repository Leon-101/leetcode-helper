const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
const webpack = require("webpack")

module.exports = merge(baseConfig, {
	mode: "development",
	// devtool: "eval-cheap-module-source-map",
	devtool: "source-map",
	watch: true,
	watchOptions: {
		aggregateTimeout: 200,  //文件发生变化后，延迟一段时间后再打包
		poll: 1000,  //轮询的间隔时间
		ignored: /node_modules/,  //忽略的文件和目录
	}
})
