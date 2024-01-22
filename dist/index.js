#! /usr/bin/env node
import express from 'express';
import { Command } from 'commander';
import fs from 'fs';
import * as path from 'path';
import readline from 'readline';
const app = express();
app.use(express.json());
import figlet from 'figlet';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
const program = new Command();
program
    .version("1.0.0")
    .description("A cli tool that helps you in your development process")
    .option("-v, --version", "Displays the version number")
    .option("-l, --ls  [value]", "List directory contents")
    .option("-m, --mkdir <value>", "Create a directory")
    .option("-t, --touch <value>", "Create a file")
    .option("-h --help", "Shows all the availaible options")
    .option("ctrl + l", "Clear the screen")
    .option("ctrl + C", " exit the current program")
    .option("-d, --rm <value>", "Delete a file")
    .option("--draw <name>", "Draw ASCII art for the specified name")
    .option("--show", "Display contents of the .env file")
    .parse(process.argv);
const options = program.opts();
//FUnction for Listing all the availaible file in the directory
async function listDirContents(filepath) {
    try {
        const files = await fs.promises.readdir(filepath);
        const detailedFilesPromises = files.map(async (file) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filepath, file));
            const { size, birthtime } = fileDetails;
            return { filename: file, "size(KB)": size, created_at: birthtime };
        });
        const fileDetail = await Promise.all(detailedFilesPromises);
        console.table(fileDetail);
        const commands = chalk.bold.black("ctrl + C");
        const exitCommand = chalk.bold.green('If you want to exit, press');
        console.log(`${exitCommand} ${commands}`);
    }
    catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}
//Function for creating the directory
function createDir(filepath) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log("Sucessfully created directiory");
        process.exit();
    }
}
//Function for creating the file
function createFile(filepath) {
    fs.openSync(filepath, "w");
    console.log(`Successfully created the file`);
    process.exit();
}
//Function for the file deletion
async function deleteFile(filepath) {
    try {
        await fs.promises.unlink(filepath);
        console.log(`Successfully deleted the file: ${filepath}`);
        process.exit();
    }
    catch (error) {
        console.error(`Error occurred while deleting the file.`);
    }
}
//This is for showing all the availaible files in the current directory
if (options.ls) {
    const __dirname = new URL('.', import.meta.url).pathname;
    const filepath = typeof options.ls === "string" ? options.ls : __dirname;
    listDirContents(filepath);
}
//This is for deleting the file
if (options.rm) {
    const __dirname = new URL('.', import.meta.url).pathname;
    const filePath = path.resolve(__dirname, options.rm);
    deleteFile(filePath);
}
//This is for creating the directory 
if (options.mkdir) {
    const __dirname = new URL('.', import.meta.url).pathname;
    createDir(path.resolve(__dirname, options.mkdir));
}
//This id for creating a file 
if (options.touch) {
    const __dirname = new URL('.', import.meta.url).pathname;
    createFile(path.resolve(__dirname, options.touch));
}
//This is for showing the help section to the user
if (options.help) {
    program.help();
}
//This is for showing the current version of the package to the user 
if (options.version) {
    process.argv;
}
//If the user does not input any field then the help section will be shown to the user 
if (!process.argv.slice(2).length) {
    program.help();
}
//To draw the input entered into the ascii format
if (options.draw) {
    console.log(figlet.textSync(options.draw));
    const commands = chalk.bold.black("ctrl + C");
    const exitCommand = chalk.bold.green('If you want to exit, press');
    console.log(`${exitCommand} ${commands}`);
}
//To show all the user secrets defined in .env during the development process
if (options.show) {
    const data = process.env;
    const excludedKeys = [
        'SHELL',
        'SESSION_MANAGER',
        'QT_ACCESSIBILITY',
        'COLORTERM',
        'XDG_CONFIG_DIRS',
        'XDG_SESSION_PATH',
        'HISTCONTROL',
        'TERM_PROGRAM_VERSION',
        'GNOME_DESKTOP_SESSION_ID',
        'HISTSIZE',
        'LANGUAGE',
        'LESS_TERMCAP_se',
        'LESS_TERMCAP_so',
        'SSH_AUTH_SOCK',
        'CINNAMON_VERSION',
        'DESKTOP_SESSION',
        'EDITOR',
        'GTK_MODULES',
        'XDG_SEAT',
        'PWD',
        'XDG_SESSION_DESKTOP',
        'LOGNAME',
        'QT_QPA_PLATFORMTHEME',
        'XDG_SESSION_TYPE',
        'GPG_AGENT_INFO',
        'XAUTHORITY',
        'VSCODE_GIT_ASKPASS_NODE',
        'XDG_GREETER_DATA_DIR',
        'GJS_DEBUG_TOPICS',
        'GDM_LANG',
        'HOME',
        'AUTOJUMP_ERROR_PATH',
        'LANG',
        'LS_COLORS',
        'XDG_CURRENT_DESKTOP',
        'STARSHIP_SHELL',
        'GIT_ASKPASS',
        'XDG_SEAT_PATH',
        'CLICOLOR',
        'CHROME_DESKTOP',
        'STARSHIP_SESSION_KEY',
        'GJS_DEBUG_OUTPUT',
        'VSCODE_GIT_ASKPASS_EXTRA_ARGS',
        'XDG_SESSION_CLASS',
        'TERM',
        'LESS_TERMCAP_mb',
        'LESS_TERMCAP_me',
        'LESS_TERMCAP_md',
        'USER',
        'VSCODE_GIT_IPC_HANDLE',
        'VISUAL',
        'AUTOJUMP_SOURCED',
        'DISPLAY',
        'LESS_TERMCAP_ue',
        'SHLVL',
        'LESS_TERMCAP_us',
        'XDG_VTNR',
        'XDG_SESSION_ID',
        'XDG_RUNTIME_DIR',
        'VSCODE_GIT_ASKPASS_MAIN',
        'GTK3_MODULES',
        'XDG_DATA_DIRS',
        'GDK_BACKEND',
        'PATH',
        'GDMSESSION',
        'HISTFILESIZE',
        'ORIGINAL_XDG_CURRENT_DESKTOP',
        'DBUS_SESSION_BUS_ADDRESS',
        'GIO_LAUNCHED_DESKTOP_FILE_PID',
        'GIO_LAUNCHED_DESKTOP_FILE',
        'TERM_PROGRAM',
        '_',
    ];
    const showData = {};
    for (const [key, value] of Object.entries(data)) {
        if (!excludedKeys.includes(key) && value !== undefined) {
            showData[key] = value;
        }
    }
    console.table(showData);
    const commands = chalk.bold.black("ctrl + C");
    const exitCommand = chalk.bold.green('If you want to exit, press');
    console.log(`${exitCommand} ${commands}`);
}
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'l') {
        console.clear();
    }
});
function setupExitHandler() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        }
    });
}
setupExitHandler();
//# sourceMappingURL=index.js.map