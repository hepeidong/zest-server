var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Model, tssclass, tssql } from "../../lib";
let UserModel = class UserModel extends Model {
    getUserAll() {
        return this.query(this.sql.userAll);
    }
    insertUserData(...args) {
        return this.query(this.formatSql(this.sql.insertData, ...args));
    }
};
UserModel = __decorate([
    tssclass("user"),
    tssql("userAll", "SELECT * FROM user"),
    tssql("insertData", `INSERT INTO user(userId, userName, userLevel, exp) VALUE(%s, "%s", %s, %s)`)
], UserModel);
export { UserModel };
