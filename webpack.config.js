"use strict";

const webpack = require("webpack");
const path = require('path');

const config = {
    entry: __dirname + '/src/mr-client.js',
    output: {
        path: __dirname,
        filename: 'mr-client.min.js',
        library: "MRClient",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.join(__dirname, 'src'),
            query: {
                plugins: ["transform-class-properties", "transform-flow-strip-types", "transform-object-assign"],
                presets: ['es2015']
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.browser": true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        }),
    ]
};

module.exports = config;
