require("dotenv").config();
import Ora from "../node_modules/ora";
import Promise from "../node_modules/promise";
import FacebookGraph from "../node_modules/fbgraph";

import User from "./User";
import Post from "./Post";

const spinner = Ora();
FacebookGraph.setAccessToken(process.env.ACCESS_TOKEN);

let numberOfMembers = 0;
let numberOfPosts = 0;

export default class FacebookGraphService {
  static getUsers(url) {
    spinner.text = "Fetching members: " + numberOfMembers;
    spinner.start();
    return new Promise(
      function(resolve, reject) {
        let users = [];
        FacebookGraph.get(
          url,
          function(err, response) {
            if (err === null) {
              if (response.data.length) {
                numberOfMembers += response.data.length;
                spinner.text = "Fetching members: " + numberOfMembers;

                response.data.forEach(function(user) {
                  users.push(new User(user.id, user.name, user.administrator));
                });

                if (response.paging && response.paging.next) {
                  const promise = this.getUsers(response.paging.next);
                  promise
                    .then(function(response) {
                      users = _.concat(users, response);
                      spinner.stop();
                      resolve(users);
                    })
                    .catch(function(err) {
                      spinner.stop();
                      reject(err);
                    });
                } else {
                  spinner.stop();
                  resolve(users);
                }
              } else {
                spinner.stop();
                resolve(users);
              }
            } else {
              spinner.stop();
              reject(err);
            }
          }.bind(this)
        );
      }.bind(this)
    );
  }

  static getPosts(url) {
    spinner.text = "Fetching posts: " + numberOfPosts;
    spinner.start();
    return new Promise(
      function(resolve, reject) {
        let posts = [];
        FacebookGraph.get(
          url,
          function(err, response) {
            if (err === null) {
              if (response.data.length) {
                numberOfPosts += response.data.length;
                spinner.text = "Fetching posts: " + numberOfPosts;

                response.data.forEach(function(post) {
                  posts.push(new Post(post.from.id));
                });

                if (response.paging && response.paging.next) {
                  const promise = this.getPosts(response.paging.next);
                  promise
                    .then(function(response) {
                      posts = _.concat(posts, response);
                      spinner.stop();
                      resolve(posts);
                    })
                    .catch(function(err) {
                      spinner.stop();
                      reject(err);
                    });
                } else {
                  spinner.stop();
                  resolve(posts);
                }
              } else {
                spinner.stop();
                resolve(posts);
              }
            } else {
              spinner.stop();
              reject(err);
            }
          }.bind(this)
        );
      }.bind(this)
    );
  }
}
