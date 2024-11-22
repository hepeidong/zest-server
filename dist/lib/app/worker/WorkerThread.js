const { isMainThread, parentPort } = require("worker_threads");
const Fs = require("fs");
const { join, relative, posix } = require("path");
const OS = require("os");

const p = OS.platform();
function getRootPath() {
    //E:\游戏服务器\node\MyServer\dist\lib\app\worker
    let rootPath = "";
    if (p === "darwin") {
        const result = __dirname.split("/");
        //目录只保留从根目录到dist的目录
        result.pop();
        result.pop();
        result.pop();
        rootPath = result.join("/");
    }
    else if (p === "win32") {
        const result = __dirname.split("\\");
        //目录只保留从根目录到dist的目录
        result.pop();
        result.pop();
        result.pop();
        rootPath = result.join("\\");
    }
    return rootPath;
}

function parsePath(path, filename) {
    const pathInfo = Fs.readdirSync(path);
    for (const info of pathInfo) {
        const filePath = join(path, info);
        const stat = Fs.statSync(filePath);
        if (stat.isDirectory()) {
            parsePath(filePath, filename);
        }
        else if (stat.isFile()) {
            if (info == filename) {
                return filePath;
            }
        }
    }
    return undefined;
}


if (!isMainThread) {

    function handleThread(data) {
        const rootPath = getRootPath();
        const configPath = join(rootPath, "config/config.json");
        const buffer = Fs.readFileSync(configPath);
        const config = JSON.parse(buffer.toString());
        const threadPath = parsePath(join(rootPath, config.thread), data.name + ".js")
        if (threadPath) {
            let relativePath = relative(__dirname, threadPath);//线程脚本的相对路径
            if (p === "win32") {
                relativePath = posix.join(...relativePath.split("\\"));
            }
            const thread = require(threadPath);
            const result = thread[data.name](...data.args);
            const packet = {
                id: data.id,
                args: result
            }
            parentPort.postMessage(packet);
        }
        else {
            console.error(new Error(`找不到执行脚本=>${data.name}.js，请检查是否存在该文件，或者配置是否正确！`))
            parentPort.postMessage("no-threadFile");
        }
    }

    parentPort.on('message', handleThread);
}