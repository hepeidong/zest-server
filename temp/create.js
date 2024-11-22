const readline = require('readline');
const rl = readline.createInterface({input: process.stdin,output: process.stdout});
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

/**
 * 
 * @param {String} query 
 * @param {(answer: string) => void} callback 
 */
function question(query, callback) {
    rl.question(query, (answer) =>{
        callback(answer);
    });
}

function isChinese(str) {
    let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    if (!patrn.exec(str)) {
        return false;
    } else {
        return true;
    }
}

function create() {
    question('游戏项目名称（必须是英文名）：', (name) => {
        if (name.length > 0) {
            if (!isChinese(name)) {
                name = name.replace(new RegExp("-", "g"), "_");
                const buffer = Fs.readFileSync(join(__dirname, "temp.txt"));
                let str = buffer.toString();
                str  = str.replace(new RegExp("@name", "g"), name);
                const path = join(rootPath, "src/server.ts");
                Fs.writeFileSync(path, str);

                const configPath = join(__dirname, "set.config.json");
                const set_buffer = Fs.readFileSync(configPath);
                const config = JSON.parse(set_buffer.toString());
                config.created = true;
                Fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

                console.log("项目设置完成！");
                process.exit();
            }
            else {
                console.log('游戏项目名称必须是英文字符');
            }
        }
    });
}


const set_buffer = Fs.readFileSync(join(__dirname, "set.config.json"));
const config = JSON.parse(set_buffer.toString());
if (config.created) {
    console.log("项目已经设置过了，请不要重复设置！");
    process.exit();
}
else {
    create();
}
