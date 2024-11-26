import { Model, tssclass, tssql } from "@tsss";


@tssclass("user")
@tssql("userAll", "SELECT * FROM user")
@tssql("insertData", `INSERT INTO user(userId, userName, userLevel, exp) VALUE(%s, "%s", %s, %s)`)
export class UserModel extends Model<{userAll: string, insertData: string}> {

    public getUserAll() {
        return this.query(this.sql.userAll);
    }

    public insertUserData(...args: any[]) {
        return this.query(this.formatSql(this.sql.insertData, ...args));
    }
}