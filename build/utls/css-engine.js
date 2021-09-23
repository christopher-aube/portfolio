const sass = require('sass');
const diff = require('diff');
const md5 = require('md5');
const pathing = require('path');
const fs = require('./file-system');
const { print } = require('./messager');

function hasChanged(data, file) {
    var oldFile = fs.readFileSync(data.destOld, 'utf8');
    var changes = diff.diffCss(oldFile, file);
    var updated = false;
    
    for (var i = 0, ii = changes.length; i < ii; i++) {

        if (changes[i].added || changes[i].removed) {
            updated = true;
            break;
        }
    }
    
    return updated;
}

function compile(data, manifest) {
    var res, file;

    try {
        print('compiling: ' + data.source);
        res = sass.renderSync({
            file: data.source,
            outputStyle: 'expanded',
            sourceMap: false
        });
    } catch (err) {
        print('failed to compile: \n' + err.stack, 'error');
        return false;
    }

    try {
        print('formatting file: ' + data.source);
        file = res
            .css
            .toString('utf8')
            .replace(/(@charset[^;]*;)/g, function () {
                return '';
            })
            .trim();
    } catch (err) {
        print('failed to create file: \n' + err.stack, 'error');
        return false;
    }

    try {
        print('updating file: ' + data.dest);
        var hasOld = data.hasOwnProperty('destOld');
        var updated = hasOld ? hasChanged(data, file) : true;

        if (updated) {
            print('writting changes to file: ' + data.dest);
            fs.outputFileSync(data.dest, file);

            if (hasOld) {
                fs.removeSync(data.destOld);
            }

            manifest.styles[data.name] = {
                dest: data.dest,
                url: '/public/styles/' + pathing.parse(data.dest).base
            };
        } else {
            print('no changes detected for: ' + data.dest);
        }
    } catch (err) {
        print('failed to update file: \n' + err.stack);
        return false;
    }
    
    return file;
};

function compileMany(files, manifest) {

    for (var i = 0, ii = files.length; i < ii; i++) {
        files[i].contents = compile(files[i], manifest);
    }

    return files;
};

exports.build = function build(manifest) {
    const stylesPaths = {
        main: {
            name: 'main',
            source: './site/styles/main.scss',
            dest: 'functions/public/styles/main.css'
        }
    };
    
    if (!manifest.hasOwnProperty('styles')) {
        manifest.styles = {};
    }

    try {
        let file;
        let files = [];

        for (style in stylesPaths) {
            stylesPaths[style].dest = stylesPaths[style].dest.replace(style, style + '.' + md5(stylesPaths[style].dest + '-' + new Date().valueOf()));
            file = {
                name: stylesPaths[style].name,
                source: fs.createLocalPath(stylesPaths[style].source),
                dest: fs.createLocalPath(stylesPaths[style].dest)
            };
            
            if (manifest.styles.hasOwnProperty(file.name)) {
                file.destOld = manifest.styles[file.name].dest;
            }
            
            files.push(file);
        }

        return compileMany(files, manifest);
    } catch (err) {
        print('failed to compile local files \n' + err.stack, 'error');
        return;
    }
};