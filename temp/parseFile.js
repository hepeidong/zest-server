const OS = require("os");
const Fs = require("fs");
const { join, relative, posix } = require("path");

const p = OS.platform();
let rootPath = "";
if (p === "darwin") {
    const result = __dirname.split("/");
    result.pop();
    rootPath = result.join("/");
}
else if (p === "win32") {
    const result = __dirname.split("\\");
    result.pop();
    rootPath = result.join("\\");
}

function modified(path, callback) {
    let dirPath = path;
    const ddir = Fs.readdirSync(path);
    for (const fileOrDir of ddir) {
        const fileOrDirPath = join(path, fileOrDir);
        const stat = Fs.statSync(fileOrDirPath);
        if (stat.isDirectory()) {
            modified(fileOrDirPath, callback);
        }
        else if (stat.isFile()) {
            callback(fileOrDirPath, dirPath);
        }
        else {
            console.error("文件路径解析发生未知错误！");
        }
    }

}

const libPath = join(rootPath, "dist/lib");
const srcPath = join(rootPath, "dist/src");

function replace(path, dirPath) {
    console.log("正在解析文件：", path);
    const result = Fs.readFileSync(path);
    let relativePath = relative(dirPath, libPath);
    let str = result.toString();
    if (p === "win32") {
        relativePath = posix.join(...relativePath.split("\\"));
    }
    str = str.replace(new RegExp("@tsss", "g"), relativePath);
    Fs.writeFileSync(path, str);
}

function copyThreadFile(fromPath, destPath) {
    if (!Fs.existsSync(destPath)) {
        Fs.mkdirSync(destPath);
    }
    const pathInfo = Fs.readdirSync(fromPath);
    for (const info of pathInfo) {
        const path = join(fromPath, info);
        const stat = Fs.statSync(path);
        if (stat.isDirectory()) {
            copyThreadFile(path, join(destPath, info));
        }
        else if (stat.isFile()) {
            Fs.copyFileSync(path, join(destPath, info));
        }
    }
}

function modifiedImport() {
    const set_buffer = Fs.readFileSync(join(__dirname, "set.config.json"));
    const set_config = JSON.parse(set_buffer.toString());
    if (set_config.thread) {
        console.log("线程导入...");
        const buffer = Fs.readFileSync(join(rootPath, "config/config.json"));
        const config = JSON.parse(buffer.toString());
        const threadPath = join(rootPath, config.thread);
        const destPath = join(join(rootPath, "dist"), config.thread);
        copyThreadFile(threadPath, destPath);
    }
}


modifiedImport();
modified(srcPath, replace);
