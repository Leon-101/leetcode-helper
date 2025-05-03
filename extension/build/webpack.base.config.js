const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const manifest = require("../src/manifest.js");


module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		"content_scripts/main": "./src/content_scripts/main.js",
		"background/background": "./src/background/main.js",
		"options/options": "./src/options/main.js",
		"popup/popup": "./src/popup/main.js",
		"web_accessible_resources/inject": "./src/web_accessible_resources/main",
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: "[name].js"
	},
	resolve: {
		extensions: [".ts", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new GenerateJsonPlugin("manifest.json", manifest),
		new HtmlWebPackPlugin({
			template: "./src/popup/popup.html",
			filename: "popup/popup.html",
			chunks: ["popup/popup"],
		}),
		new HtmlWebPackPlugin({
			template: "./src/options/options.html",
			filename: "options/options.html",
			chunks: ["options/options"],
		}),
	],
}