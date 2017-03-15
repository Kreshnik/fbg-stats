import _ from "../node_modules/lodash";
import fs from "fs";
import BabyParse from "../node_modules/babyparse";
import Ora from "../node_modules/ora";
const spinner = Ora();
import Table from "../node_modules/cli-table";

export default class DataPresenter {

    static generateUsersTable(users) {
        spinner.text = "Generating user table.";
        spinner.start();

        let userTable = new Table({
            head: ['Name', 'Post Count']
            , colWidths: [20, 15]
        });

        const _users = _.orderBy(users, 'posts', 'desc');
        _.forEach(_users, function (user) {
            userTable.push([user.name, user.numberOfPost()]);
        });

        spinner.stop();
        console.log(userTable.toString());
    }

    static generateUsersCSV(users, fileName) {

        spinner.text = "Saving data to csv.";
        spinner.start();

        let _users = _.orderBy(users, 'posts', 'desc');
        _users = _.map(_users, function (user) {
            return [user.name, user.numberOfPost()];
        });

        const csv = BabyParse.unparse(_users);

        fs.writeFile(`${fileName}.csv`, csv, function (err) {
            spinner.stop();
        });

    }
}