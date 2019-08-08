
/* global require, module, __dirname */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const baseConfig = require('./base.webpack.config.js');
const baseConfigRules = require('./base.webpack.rules.js');
const { config: webpackConfig, plugins } = config({
    rootFolder: resolve(__dirname, '../')
});

module.exports = {
    ...webpackConfig,
    plugins,

    ...baseConfig,
    module: {
        ...webpackConfig.module,
        rules: [
            ...webpackConfig.module.rules,
            ...baseConfigRules.module.rules
        ]
    }
};
