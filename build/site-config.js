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
    
    const cssRes = cssEninge.build(manifest);
    const scriptRes = await scriptEninge.build(manifest);
    // const viewRes = viewEninge.build(manifest, cssRes);
    fs.writeLocalFile(manifestPath, manifest);
}

build();