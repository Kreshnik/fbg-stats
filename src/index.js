require('dotenv').config();
import _ from "../node_modules/lodash";

import DataPresenter from "./DataPresenter";
import FacebookGraphService from "./FacebookGraphService";

const GROUP_ID = process.env.GROUP_ID;
const LIMIT = process.env.LIMIT;

const userPromise = FacebookGraphService.getUsers(`/${GROUP_ID}/members?limit=${LIMIT}`);
userPromise.then(function (users) {
    const postPromise = FacebookGraphService.getPosts(`/${GROUP_ID}/feed?limit=${LIMIT}&fields=message,story,id,from,created_time`);
    postPromise.then(function (posts) {

        _.forEach(users, function (user) {
            user.posts = _.filter(posts, function (post) {
                return post.userId === user.id;
            });
        });

        if (process.env.EXPORT_TO_CSV.toLowerCase() === 'true') {
            const fileName = GROUP_ID + '-' + (new Date().getTime());
            DataPresenter.generateUsersCSV(users, fileName);
        }
        if (process.env.DISPLAY_CLI_TABLE.toLowerCase() === 'true')
            DataPresenter.generateUsersTable(users);

    }).catch(function (error) {
        console.log('Error:', error);
    });

}).catch(function (error) {
    console.log('Error:', error);
});