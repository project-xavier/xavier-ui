/* global require, module, __dirname */

const path = require('path');

const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ].filter(Boolean)
            }
        ]
    }
};

module.exports = webpackConfig;
