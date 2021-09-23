const fs = require('fs-extra');
const moment = require('moment');
const colors = require('colors');
const colorTheme = {
        input: 'grey',
        verbose: 'cyan',
        prompt: 'white',
        success: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'brightYellow',
        debug: 'blue',
        error: 'red',
        info: 'brightMagenta'
    };

colors.setTheme(colorTheme);

const datetimePat = 'YYYY-M-D-HH-mm-ss';
var CONFIG = {
        dump: false,
        info: {
            dest: '',
            contents: ''
        },
        error: {
            dest: '',
            contents: ''
        }
    };

exports.config = function (options) {
    Object.assign(CONFIG, options);

    CONFIG.dump = true;
    CONFIG.info.dest += '-' + moment().format(datetimePat) + '.txt';
    CONFIG.info.contents = "";
    CONFIG.error.dest += '-' + moment().format(datetimePat) + '.txt';
    CONFIG.error.contents = "";

    return CONFIG;
};

function style(msg, clr, style) {
    clr = clr || 'data';

    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg, null, 4);
    }

    if (colorTheme.hasOwnProperty(clr) === false) {
        let warnMsg = 'color not supported: ' + clr;
        console.log(warnMsg.warn);
        clr = 'data';
    }

    if ((typeof clr === 'string') && (typeof style !== 'string')) {
        return msg[clr];
    } else if ((typeof clr !== 'string') && (typeof style === 'string')) {
        return msg[style];
    } else if ((typeof clr === 'string') && (typeof style === 'string')) {
        return msg[clr][style];
    }
}
exports.style = style;

function print(msg, clr, style) {
    clr = clr || 'data';

    if (typeof msg !== 'string') {
        msg = JSON.stringify(msg, null, 4);
    }

    if (colorTheme.hasOwnProperty(clr) === false) {
        let warnMsg = 'color not supported: ' + clr;
        console.log(warnMsg.warn);
        clr = 'data';
    }

    if ((typeof clr === 'string') && (typeof style !== 'string')) {
        console.log(msg[clr]);
    } else if ((typeof clr !== 'string') && (typeof style === 'string')) {
        console.log(msg[style]);
    } else if ((typeof clr === 'string') && (typeof style === 'string')) {
        console.log(msg[clr][style]);
    }
}
exports.print = print;

exports.log = function logger(msg, type, style) {
    print(msg, type, style);

    if (CONFIG.dump == true) {
        var datetime = moment().format(datetimePat+':SSS');
        var filemsg = datetime + ' - ' + msg + '\n';

        switch (type) {
            case 'error':
            case 'warn':
                CONFIG.error.contents += filemsg;
                fs.outputFileSync(CONFIG.error.dest, CONFIG.error.contents);
                break;
            default:
                CONFIG.info.contents += filemsg;
                fs.outputFileSync(CONFIG.info.dest, CONFIG.info.contents);
                break;
        }
    }
};

exports.clear = function () {
    process.stdout.write('\x1b[2J');
};