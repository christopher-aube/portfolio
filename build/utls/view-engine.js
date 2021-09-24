const engine = require('handlebars');
const beautify = require('js-beautify').html;
const { print } = require('./messager');
const fs = require('./file-system');
const pathing = require('path');

exports.render = function (contents, data) {
    var file;
    
    try {
        file = engine.compile(contents)(data);
    } catch (err) {
        print(err.stack, 'error');
    }

    return file;
};

exports.beautify = function (contents) {
    return beautify(contents);
};

function getViewContents(source) {
    var filePaths = fs.drainLocalPaths(source);
    var contents = {};

    filePaths.forEach(function (path) {
        var parts = pathing.parse(path);

        contents[parts.name] = fs.getLocalFile(path);
    });

    return contents;
}

function getPartials() {
    var source = './site/partials';

    return getViewContents(source);
}

function getPages() {
    var source = './site/pages';

    return getViewContents(source);
}

exports.build = function (manifest) {
    var contents, filename, fileDest;
    var destBase = 'functions/public';
    var pages = getPages();
    var config = {
            styles: manifest.styles,
            scripts: manifest.scripts,
            partials: getPartials()
        };

    for (page in pages) {
        contents = exports.beautify(exports.render(pages[page], config));
        filename = page + '.html';
        fileDest = destBase + '/' + filename;
        fs.outputFileSync(fileDest, contents);
    }
};