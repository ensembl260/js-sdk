"use strict";

const webpack = require("webpack");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
    mode: 'production',
    entry: __dirname + '/src/mr-client.js',
    output: {
        path: __dirname  + '/dist',
        filename: 'index.js',
        library: "MRClient",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            use: [
                {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                            "@babel/plugin-transform-flow-strip-types",
                            "@babel/plugin-transform-object-assign"
                        ],
                    },
                }
            ],
        }]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
            })
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.browser": true
        }),
    ],
    resolve: {
        modules: ['node_modules'],
    }
};

module.exports = config;
