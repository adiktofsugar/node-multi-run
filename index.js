#!/usr/bin/env node
var child_process = require('child_process');

var argv = require('minimist')(process.argv.slice(2), {
    boolean: 'h'
});
var usage = ['',
'multi-run [-h] [start|stop|log] [cmd]...',
' -h help',
'run cmds and output to stdout',
''].join("\n");

if (argv.h) {
    console.log(usage);
    process.exit();
}

function start(cmds) {
    var pids = [];
    cmds.forEach((cmd) => {
        var cmdParts = [];
        var cmdString = '';
        var cmdQuoteOn = false;
        var i = 0;
        var char;
        for (; i < cmd.length; i++) {
            char = cmd.substring(i, i+1);
            if (char == '"' || char == "'") {
                cmdQuoteOn = !cmdQuoteOn;
            }
            if (char.match(/\s/) && !cmdQuoteOn) {
                cmdParts.push(cmdString);
                cmdString = '';
            } else {
                cmdString += char;
            }
        }
        cmdParts.push(cmdString);
        console.log('cmdparts', cmdParts);
        var cmdName = cmdParts[0];
        var cmdArgs = cmdParts.slice(1);
        var proc = child_process.spawn(cmdName, cmdArgs, {
            cwd: process.cwd(),
            stdio: ['ignore', process.stdout, process.stderr]
        });
        console.log('..spawned ' + cmdName + ' with pid ' + proc.pid);
    });
}

start(argv._);
