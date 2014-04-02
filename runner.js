#! /usr/bin/env node
var childProcess = require('child_process'),
    children = [],
    exitCode = 0;

process.stdin.on('data', function(data){
    var args = data.toString().split(' ');

    processCommand(args);
});

function run(command, cwd, done){
    var proc = childProcess.spawn('npm', ['run-script', command], {
        cwd: cwd
    });

    children.push(proc);

    proc.stdout.on('data', function (data) {
        console.log(cwd + ': ' + data);
    });

    proc.stderr.on('data', function (data) {
        console.log(cwd + ': ' + data);
    });

    proc.on('error', function (error) {
        console.log(cwd + ': ' + error);
    });

    proc.on('close', function(code){
        done && done();

        console.log(cwd + ' exited with: ' + code);

        if(code){
            exitCode = 1;
        }

        children.splice(children.indexOf(proc), 1);

        if(!children.length){
            process.exit(exitCode);
        }
    });
}

function processCommand(args){
    var servers = args,
        command = args.shift();

    servers.forEach(function(server){
        run(command, server);
    });
}

processCommand(process.argv.slice(2));