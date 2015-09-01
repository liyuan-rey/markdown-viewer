// main.js

console.log(process.argv);

var resultfile = 'translated.html';
var mdpath = '.\\readme.md';//process.argv[2];

var fs = require('fs');

if (!fs.existsSync(mdpath)) {
    console.log('File not exist: ' + mdpath);
    resultfile = 'index.html';
}
else {
    var watcher = fs.watch(mdpath);

    watcher.on('rename', function (event, filename) {
        watcher.close();
    });

    watcher.on('change', function (event, filename) {
        fs.readFile(filename, function (error, data) {
            if (error) throw error;

            console.log(typeof data);
            var marked = require('marked');
            marked(data.toString(), function (err, content) {
                if (err) {
                    console.log('marked error, data: \r\n' + data + '\r\n' + 'content:' + '\r\n' + content);
                    throw err;
                }

                fs.writeFile(__dirname + '/' + resultfile, content, function (e) {
                    if (e) throw e;

                    if (mainWindow) mainWindow.loadUrl('file://' + __dirname + '/' + resultfile);
                })
            })
        })

    });

    watcher.on('error', function (err) {
        throw err;
    });
}

var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/' + resultfile);

    // Open the devtools.
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });


});

///
/*
 var remote = require('remote');
 document.addEventListener("keydown", function (e) {
 if (e.keyCode === 123) { // F12
 var window = remote.getCurrentWindow();
 window.toggleDevTools();
 }
 });
 */