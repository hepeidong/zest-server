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

const threadPath = join(rootPath, "dist/lib/app/worker/WorkerThread.js");
Fs.rmSync(threadPath);

const buffer = Fs.readFileSync(join(__dirname, "set.config.json"));
const config = JSON.parse(buffer.toString());
config.thread = false;
Fs.writeFileSync(join(__dirname, "set.config.json"), JSON.stringify(config, null, 4));

console.log("已经关闭多线成功能！");