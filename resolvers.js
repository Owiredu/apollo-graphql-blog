const sqlite3 = require('sqlite3').verbose();

//create a database if no exists
const database = new sqlite3.Database("blog.db");

const resolvers = {
    Query: {
        getAllPosts: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                database.all("SELECT * FROM posts;", function (err, rows) {
                    if (err) {
                        reject([]);
                    }
                    resolve(rows);
                });
            });
        }
    },

    Mutation: {
        createPost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("INSERT INTO posts(title, body, image, author_id, create_date) VALUES(?,?,?,?,?);", [content.title, content.body, content.image, content.author_id, content.createDate], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${content.title}) saved successful!` });
                });
            });
        },

        updatePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("UPDATE posts SET title=?, body=?, image=?, author_id=? WHERE id=?;", [content.title, content.body, content.image, content.author_id, content.id], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${content.title}) updated successful!` });
                });
            });
        }
    }
};

module.exports = resolvers;