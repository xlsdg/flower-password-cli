#!/usr/bin/env node

'use strict';


const Chalk = require('chalk');
const Yargs = require('yargs');
const Inquirer = require('inquirer');
const FpCode = require('node-flower-password');


let gArgv = null;
let arrLength = [];

const inputPassword = {
    'type': 'password',
    'name': 'password',
    'message': 'Password:',
    'validate': function(input) {
        if (!input) {
            return 'Enter your password';
        }
        return true;
    }
};

const inputKey = {
    type: 'input',
    name: 'key',
    message: 'Key:',
    'validate': function(input) {
        if (!input) {
            return 'Enter your key';
        }
        return true;
    }
};

const inputLength = {
    type: 'list',
    name: 'length',
    message: 'Length:',
    default: '16',
    choices: []
};

main();

function initArrLength() {
    for (let i = 2; i < 33; i++) {
        inputLength.choices.push('' + i);
    }
}

function init() {
    initArrLength();
    gArgv = Yargs
        .option('p', {
            alias: 'password',
            describe: 'your password',
            demand: false,
            type: 'string'
        })
        .option('k', {
            alias: 'key',
            describe: 'your key',
            demand: false,
            type: 'string'
        })
        .option('l', {
            alias: 'length',
            describe: 'code length',
            choices: inputLength.choices.map(n => parseInt(n, 10)),
            demand: false,
            default: 16,
            type: 'number'
        })
        .usage('Usage: $0 [-p \"password\"] [-k \"key\"] [-l \"length\"]')
        .example('$0 -p 123 -k 456 -l 32', 'KD06E9f528be13dc03fc7879e4ca11cB')
        .help('h')
        .alias('h', 'help')
        .epilog('Copyright 2012 - 2016 xLsDg')
        .argv;
}

function main() {
    init();

    let arrInput = [];
    arrInput.push(gArgv.password);
    arrInput.push(gArgv.key);
    arrInput.push(gArgv.length);

    if (!gArgv.password) {
        arrInput.push(inputPassword);
    }
    if (!gArgv.key) {
        arrInput.push(inputKey);
    }
    if (!gArgv.length) {
        arrInput.push(inputLength);
    }

    if (arrInput.length > 3) {
        return menuMain.apply(this, arrInput).then(procAws);
    } else {
        return showCode(gArgv.password, gArgv.key, gArgv.length);
    }
}

function procAws(aws) {
    return showCode(aws.password, aws.key, aws.length);
}

function showMenu() {
    return menuMain(null, null, null, inputPassword, inputKey, inputLength).then(procAws);
}

function showCode(password, key, length) {
    return console.log('\r\n' + Chalk.white.bold(`Code: `) + Chalk.cyan(FpCode(password, key, length)) + '\r\n');
}

function menuMain(password, key, length) {
    return Inquirer.prompt(Array.prototype.slice.call(arguments, 3)).then(function(aws) {
        aws['password'] = aws.password || password;
        aws['key'] = aws.key || key;
        aws['length'] = aws.length ? parseInt(aws.length, 10) : (length || 16);
        return aws;
    });
}
