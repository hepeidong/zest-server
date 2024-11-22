import Fs from "fs";
import Path from "path";
import OS from "os";

export class ScriptLoader {
    private _rootPath: string;
    constructor() {
        this._rootPath = this.getRootPath();
    }

    private static _instance: ScriptLoader;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new ScriptLoader();
        }
        return this._instance;
    }

    public loadScript() {
        const srcPath = Path.join(this._rootPath, "src");
        this.requireScript(srcPath, "server.js")
    }

    private requireScript(path: string, exclude: string) {
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

    private getRootPath() {
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