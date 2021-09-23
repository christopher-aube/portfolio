const sass = require('sass');
const diff = require('diff');
const fs = require('./file-system');
const { print } = require('./messager');

exports.compile = function compileCss(data) {
    var res, file;
    var hasPath = false;

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
        print('checking if file exists: ' + data.dest);
        hasPath = fs.pathExistsSync(data.dest)
    } catch (err) {
        print('existance check failed: \n' + err.stack, 'error');
        return false;
    }

    if (!hasPath) {

        try {
            print('writting new file: ' + data.dest);
            fs.outputFileSync(data.dest, file);
        } catch (err) {
            print('failed to write new file: \n' + err.stack, 'error');
            return false;
        }

    } else {

        try {
            print('updating file: ' + data.dest);
            var oldFile = fs.readFileSync(data.dest, 'utf8');
            var changes = diff.diffCss(oldFile, file);
            var updated = false;

            for (var i = 0, ii = changes.length; i < ii; i++) {

                if (changes[i].added || changes[i].removed) {
                    updated = true;
                    break;
                }
            }
            
            if (updated) {
                print('writting changes to file: ' + data.dest);
                fs.outputFileSync(data.dest, file);
            } else {
                print('no changes detected for: ' + data.dest);
            }
        } catch (err) {
            print('failed to update file: \n' + err.stack);
            return false;
        }
    }
    
    return file;
};

exports.compileMany = function compileManyCss(files) {

    for (var i = 0, ii = files.length; i < ii; i++) {
        files[i].contents = exports.compile(files[i]);
    }

    return files;
};

exports.build = function build() {
    const stylesPaths = {
        main: {
            name: 'main',
            source: './site/styles/main.scss',
            dest: 'functions/public/styles/main.css'
        }
    };

    try {
        let files = [];

        for (style in stylesPaths) {
            files.push({
                name: stylesPaths[style].name,
                source: fs.createLocalPath(stylesPaths[style].source),
                dest: fs.createLocalPath(stylesPaths[style].dest)
            });
        }

        return exports.compileMany(files);
    } catch (err) {
        print('failed to compile local files \n' + err.stack, 'error');
        return;
    }
};