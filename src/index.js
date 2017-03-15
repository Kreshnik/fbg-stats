require('dotenv').config();
import _ from "../node_modules/lodash";

import DataPresenter from "./DataPresenter";
import FacebookGraphService from "./FacebookGraphService";

const GROUP_ID = process.env.GROUP_ID;

const userPromise = FacebookGraphService.getUsers(`/${GROUP_ID}/members`);
userPromise.then(function (users) {
    const postPromise = FacebookGraphService.getPosts(`/${GROUP_ID}/feed`);
    postPromise.then(function (posts) {

        _.forEach(users, function (user) {
            user.posts = _.filter(posts, function (post) {
                return post.story.includes(user.name);
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