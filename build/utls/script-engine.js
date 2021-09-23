const webpack = require('webpack');
const pathing = require('path');

exports.build = function build() {
    let config = {
            entry: './site/scripts/index.js',
            output: {
                path: pathing.resolve(__dirname, 'functions/public/scripts/'),
                filename: '[name].[contenthash].js'
            }
        };

    return new Promise(function (resolve, reject) {

        try {
            let chunkname;
            let manifest = {};
            let compiler = webpack(config);

            compiler.run(function (err, stats) {

                if (err) {
                    reject(err);
                    return;
                }

                stats.toJson().assets.forEach(function (asset) {
                    chunkName = asset.chunkNames.length ? asset.chunkNames[0] : Object.keys(options.entry)[0];
                    
                    if (!manifest.hasOwnProperty(chunkName)) {
                        manifest[chunkName] = [];
                    }
    
                    manifest[chunkName].push(asset.name);
                });

                resolve(manifest);
            });
        } catch (err) {
            reject(err);
        }
    });
};