const fs = require('./utls/file-system');
const cssEninge = require('./utls/css-engine');
const viewEninge = require('./utls/view-engine');
const scriptEninge = require('./utls/script-engine');

async function build() {
    const manifestPath = 'build/manifest.json';
    let manifest = {};

    try {
        manifest = fs.getLocalFile(manifestPath);
    } catch (error) {
        
    } finally {

        if (manifest === undefined) {
            manifest = {};
        }
    }
    
    cssEninge.build(manifest);
    await scriptEninge.build(manifest);
    viewEninge.build(manifest);
    fs.writeLocalFile(manifestPath, manifest);
    fs.copySync('./site/assets', './functions/public/assets');
}

build();