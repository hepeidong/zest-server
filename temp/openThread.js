const Fs = require("fs");
const OS = require("os");
const { join } = require("path");

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

const toPath = join(rootPath, "dist/lib/app/worker/WorkerThread.js");
const fromPath = join(__dirname, "WorkerThread.js");
Fs.copyFileSync(fromPath, toPath);

const buffer = Fs.readFileSync(join(__dirname, "set.config.json"));
const config = JSON.parse(buffer.toString());
config.thread = true;
Fs.writeFileSync(join(__dirname, "set.config.json"), JSON.stringify(config, null, 4));

console.log("已经打开多线成功能！");