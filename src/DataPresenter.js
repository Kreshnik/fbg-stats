import _ from "../node_modules/lodash";
import fs from "fs";
import BabyParse from "../node_modules/babyparse";
import Ora from "../node_modules/ora";
const spinner = Ora();
import Table from "../node_modules/cli-table";

export default class DataPresenter {
  static getColumns() {
    return ["Id", "URL", "Name", "Post Count", "Is Admin"];
  }

  static getUserRow(user) {
    return [
      user.id,
      `https://facebook.com/${user.id}`,
      user.name,
      user.numberOfPost(),
      user.isAdmin
    ];
  }

  static generateUsersTable(users) {
    spinner.text = "Generating user table.";
    spinner.start();

    let userTable = new Table({
      head: this.getColumns(),
      colWidths: [20, 40, 20, 13, 10]
    });

    const _users = _.orderBy(users, "posts", "desc");

    _.forEach(
      _users,
      function(user) {
        userTable.push(this.getUserRow(user));
      }.bind(this)
    );

    spinner.stop();
    console.log(userTable.toString());
  }

  static generateUsersCSV(users, fileName) {
    spinner.text = "Saving data to csv.";
    spinner.start();

    let _users = _.orderBy(users, "posts", "desc");
    _users = _.map(
      _users,
      function(user) {
        return this.getUserRow(user);
      }.bind(this)
    );
    _users.unshift(this.getColumns());
    const csv = BabyParse.unparse(_users);

    fs.writeFile(`${fileName}.csv`, csv, function(err) {
      spinner.stop();
    });
  }
}
