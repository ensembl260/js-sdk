
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.production');

const baseConfig = function(config) {
    config.set({
        files: [
          'tests.webpack.js'
        ],
        frameworks: ['mocha'],
        plugins: [
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack'
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap']
        },
        reporters: ['dots'],
        singleRun: true,
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        }
    })
};

let karmaConfig;
if (process.env.NODE_ENV === 'ci') {

} else {
    const browsers = ['Chrome', 'Firefox', 'Safari'];
    const plugins =  [
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-safari-launcher'
    ];

    karmaConfig = Object.assign({}, baseConfig, {
        browsers,
        plugins: [].concat(baseConfig.plugins, plugins)
    });
}

module.exports = function(config) {
    config.set(karmaConfig);
};
