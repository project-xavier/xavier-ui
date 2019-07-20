/* global require, module, __dirname */

const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackConfig = {
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../tsconfig.json')
            })
        ],
        symlinks: false,
        cacheWithContext: false
    }
};

module.exports = webpackConfig;
