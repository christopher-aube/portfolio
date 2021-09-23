const fs = require('fs-extra');
const path = require('path');
const { print } = require('./messager');

function createLocalPath(file) {
    return path.normalize(
        path.join(
            process.cwd(),
            file
        )
    );
};
fs.createLocalPath = createLocalPath;

function getLocalStats(path) {
    var localPath = createLocalPath(path);

    return fs.statSync(localPath);
}
fs.getLocalStats =getLocalStats;

function localExists(path) {
    var localPath = createLocalPath(path);

    return fs.existsSync(localPath);
}
fs.localExists = localExists;

function getLocalFile(file, media) {
    var localPath = createLocalPath(file);

    try {

        if (!fs.pathExistsSync(localPath)) {
            print('path does not exist: ' + localPath, 'warn');
            return;
        }
    } catch (err) {
        print(err.stack, 'error');
        return;
    }

    if (media === undefined || media === null) {
        media = 'utf8'
    }

    try {
        
        if (file.indexOf('.json') !== -1) {
            return JSON.parse(fs.readFileSync(localPath, media));
        } else {
            return fs.readFileSync(localPath, media);
        }
    } catch (err) {
        print(err.stack, 'error');
        return;
    }
}
fs.getLocalFile = getLocalFile;

function writeLocalFile(file, contents) {
    var localPath = createLocalPath(file);

    try {
        
        if (file.indexOf('.json') !== -1) {
            fs.outputFileSync(localPath, JSON.stringify(contents, null, 4));
        } else {
            fs.outputFileSync(localPath, contents);
        }    
    } catch (err) {
        print(err.stack, 'error');
    }
    
}
fs.writeLocalFile = writeLocalFile;

function drainLocalPaths(dest) {
    var parts;
    var completePaths = [];
    var localPath = createLocalPath(dest);
    var paths = fs.readdirSync(localPath);

    for (var i = 0, ii = paths.length; i < ii; i++) {
        parts = path.parse(paths[i]);
        
        if (parts.name !== '.git') {
            
            if (parts.ext.length === 0 && parts.name !== '.gitignore' && parts.name !== '.gitkeep') {
                completePaths = completePaths.concat(drainLocalPaths(dest + '/' + paths[i]));
            } else {
                completePaths.push(dest + '/' + paths[i]);
            }
        }
    }

    return completePaths;
}
fs.drainLocalPaths = drainLocalPaths;

function drainLocalUpdates(dest, from) {
    var modifiedAt, compareAt;
    var paths = drainLocalPaths(dest);

    try {
        compareAt = from !== undefined ? new Date(from).valueOf() : new Date().valueOf();
    } catch (err) {
        print('failed to convert time: ' + form + ', using current time\n' + err.stack, 'warn');
        compareAt = new Date().valueOf();
    }

    return paths.filter(function (path) {
        modifiedAt = fs.statSync(path).mtime;
        return new Date(modifiedAt).valueOf() > compareAt;
    });
}
fs.drainLocalUpdates = drainLocalUpdates;

Object.assign(exports, fs);