import Fs from "fs";
import Path from "path";
import OS from "os";
export class ScriptLoader {
    constructor() {
        this._rootPath = this.getRootPath();
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ScriptLoader();
        }
        return this._instance;
    }
    loadScript() {
        const srcPath = Path.join(this._rootPath, "src");
        this.requireScript(srcPath, "server.js");
    }
    requireScript(path, exclude) {
        const result = Fs.readdirSync(path);
        for (const fileOrDir of result) {
            if (fileOrDir !== exclude) {
                const currentPath = Path.join(path, fileOrDir);
                const stat = Fs.statSync(currentPath);
                if (stat.isDirectory()) {
                    this.requireScript(currentPath, exclude);
                }
                else {
                    require(currentPath);
                }
            }
        }
    }
    getRootPath() {
        //E:\游戏服务器\node\MyServer\dist\lib\app\util
        const p = OS.platform();
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
}
