import { Model, tssclass, tssql } from "@tsss";


@tssclass("user")
@tssql("userAll", "SELECT * FROM user")
@tssql("insertData", `INSERT INTO user(userId, userName, userLevel, exp) VALUE(1001, "张三", 20, 202400)`)
export class UserModel extends Model<{userAll: string, insertData: string}> {

    public getUserAll() {
        return this.query(this.sql.userAll);
    }
}