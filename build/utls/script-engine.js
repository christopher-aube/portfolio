const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const pathing = require('path');
const fs = require('./file-system');

exports.build = function build(manifest) {
    let config = {
            entry: './site/scripts/index.js',
            plugins: [
                new CleanWebpackPlugin()
            ],
            output: {
                path: pathing.resolve(__dirname, '../../functions/public/scripts/'),
                filename: '[name].[contenthash].js'
            }
        };

    return new Promise(function (resolve, reject) {

        try {
            let chunkName;
            let compiler = webpack(config);

            if (!manifest.hasOwnProperty('scripts')) {
                manifest.scripts = {};
            }

            compiler.run(function (err, stats) {

                if (err) {
                    reject(err);
                    return;
                }

                stats.toJson().assets.forEach(function (asset) {
                    chunkName = asset.chunkNames.length ? asset.chunkNames[0] : Object.keys(options.entry)[0];
                    
                    if (!manifest.scripts.hasOwnProperty(chunkName)) {
                        manifest.scripts[chunkName] = {};
                    }

                    manifest.scripts[chunkName].url = '/public/scripts/' + asset.name;
                    manifest.scripts[chunkName].dest = pathing.normalize(config.output.path + '/' + asset.name);
                });

                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });
};