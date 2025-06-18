var fs = require("fs")

function getCallerFile() {
    var filename;
    var _pst = Error.prepareStackTrace
    Error.prepareStackTrace = function (err, stack) { return stack; };
    try {
        var err = new Error();
        var callerfile;
        var currentfile;
        currentfile = err.stack.shift().getFileName();
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            if(currentfile !== callerfile) {
                filename = callerfile;
                break;
            }
        }
    } catch (err) {}
    Error.prepareStackTrace = _pst;
    if (filename == "node:internal/modules/cjs/loader") {
        filename = process.mainModule.filename
    }
    if (filename == "internal/modules/cjs/loader.js") {
        filename = process.mainModule.filename
    }
    if (filename == "node:events") {
        filename = "EventHandler"
    }
    if (filename == "events.js") {
      filename = "EventHandler"
    }
    if (filename == undefined) {
        filename = "None"
    }
    return filename.split(".")[0].replace(__dirname, "").replace("\\","");
}

/**
 * 
 * @param {Date} date 
 * @param {String} pattern 
 * @returns {String}
 */
function dateToPattern(date, pattern) {
    var year = date.getFullYear()
    var month = date.getMonth()+1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return pattern.replace(/Y/g, year).replace(/M/g, month).replace(/D/g, day).replace(/h/g, hour).replace(/m/g, minute).replace(/s/, second)
}

var config = JSON.parse(fs.readFileSync("./logger.conf"))

/**
 * 
 * @param {String} inp 
 * @param {Object} table 
 * @returns {String}
 */
function processDesign(inp, table) {
    for (let i in table) {
        let regX = new RegExp("%"+i,"g")
        inp = inp.replace(regX, table[i])
    }
    return inp
}

function addLog(fname, data) {
    let pre = ""
    if (fs.existsSync(fname)) {
        pre = fs.readFileSync(fname, "utf8")
    }
    pre = pre + data + "\n"
    fs.writeFileSync(fname, pre)
}

if (!fs.existsSync(config.logFolder)) {
    fs.mkdirSync(config.logFolder)
}
let logfile = config.logFolder+dateToPattern(new Date(), config.logPattern)+".log"

class Logger {
    /**
     * 
     * @param {String} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * 
     * @param  {...any} data
     */
    info(...data) {
        let repl = {}
        repl.t = dateToPattern(new Date(), config.timePattern)
        repl.c = getCallerFile()
        repl.n = this.name
        repl.T = "INFO"
        repl.i = data.join("  ")
        let logged = processDesign(config.logDesign, repl)
        let consoled = "\x1b["+config.colors.info+"m"+processDesign(config.consoleDesign, repl)+"\x1b[0m"

        console.log(consoled);
        if (config.logLevels.info >= config.logLevel) {
            addLog(logfile, logged)
        }
    }
    
    /**
     * 
     * @param  {...any} data
     */
    debug(...data) {
        let repl = {}
        repl.t = dateToPattern(new Date(), config.timePattern)
        repl.c = getCallerFile()
        repl.n = this.name
        repl.T = "DEBUG"
        repl.i = data.join("  ")
        let logged = processDesign(config.logDesign, repl)
        let consoled = "\x1b["+config.colors.debug+"m"+processDesign(config.consoleDesign, repl)+"\x1b[0m"

        console.log(consoled);
        if (config.logLevels.debug >= config.logLevel) {
            addLog(logfile, logged)
        }
    }
    
    /**
     * 
     * @param  {...any} data
     */
    warn(...data) {
        let repl = {}
        repl.t = dateToPattern(new Date(), config.timePattern)
        repl.c = getCallerFile()
        repl.n = this.name
        repl.T = "WARN"
        repl.i = data.join("  ")
        let logged = processDesign(config.logDesign, repl)
        let consoled = "\x1b["+config.colors.warn+"m"+processDesign(config.consoleDesign, repl)+"\x1b[0m"

        console.log(consoled);
        if (config.logLevels.warn >= config.logLevel) {
            addLog(logfile, logged)
        }
    }

    /**
     * 
     * @param  {...any} data
     */
    error(...data) {
        let repl = {}
        repl.t = dateToPattern(new Date(), config.timePattern)
        repl.c = getCallerFile()
        repl.n = this.name
        repl.T = "ERROR"
        repl.i = data.join("  ")
        let logged = processDesign(config.logDesign, repl)
        let consoled = "\x1b["+config.colors.error+"m"+processDesign(config.consoleDesign, repl)+"\x1b[0m"

        console.log(consoled);
        if (config.logLevels.error >= config.logLevel) {
            addLog(logfile, logged)
        }
    }
}

var errorLogger = new Logger("ErrorCatcher")
process.on('SIGINT', function (code) {
    process.exit(0)
})
process.on('exit', function (code) {
    errorLogger.warn('Exited with code: '+code)
})
process.on('uncaughtException', function (err) {
    errorLogger.error('uncaughtException: '+err.stack)
    process.exit(1)
})

/*let test = new Logger("test")
test.info("Oi","Server","Oi","World")
test.debug("Oi","Server","Oi","World")
test.warn("Oi","Server","Oi","World")
test.error("Oi","Server","Oi","World")*/
module.exports = Logger
export default Logger