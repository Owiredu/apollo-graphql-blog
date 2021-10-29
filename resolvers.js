const sqlite3 = require('sqlite3').verbose();

//create a database if no exists
const database = new sqlite3.Database("blog.db");

const resolvers = {
    Query: {
        getPost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const title = args.title;
                database.get("SELECT * FROM posts WHERE title=?;", [title], function (err, postRow) {
                    if (err) {
                        resolve({});
                    }
                    if (postRow) {
                        database.get("SELECT name as author_name, email as author_email FROM users WHERE id=?;", [postRow.author_id], function (err, userRow) {
                            if (err) {
                                resolve({});
                            }
                            let finalData = {...postRow, ...userRow};
                            resolve(finalData);
                        });
                    } else {
                        resolve({});
                    }
                });
            });
        },

    },

    Mutation: {
        createPost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("INSERT INTO posts(title, body, image, author_id, create_date) VALUES(?,?,?,?,?);", [content.title, content.body, content.image, content.authorId, content.createDate], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${content.title}) saved successfully!` });
                });
            });
        },

        updatePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("UPDATE posts SET title=?, body=?, image=?, author_id=? WHERE id=?;", [content.title, content.body, content.image, content.authorId, content.id], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Post (${content.title}) updated successfully!` });
                });
            });
        },

        deletePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                // raw SQLite query to select from table
                database.get("SELECT title FROM posts WHERE id=?;", [content.id], function (err, row) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const postTitle = row.title;
                        database.run("DELETE FROM posts WHERE id=?;", [content.id], function (err, rows) {
                            if (err) {
                                // reject([]);
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({ status: 200, message: `Post (${postTitle}) deleted successfully!` });
                        });
                    } else {
                        resolve({ status: 400, message: "Post not found!" });
                    }
                });
            });
        },

        likePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.get("SELECT title, likes_count, unlikes_count FROM posts WHERE id=?;", [content.id], function (err, row) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const title = row.title;
                        const unlikesCount = row.unlikes_count;
                        const likesCount = row.likes_count + 1;
                        database.run("UPDATE posts SET likes_count=? WHERE id=?;", [likesCount, content.id], function (err, rows) {
                            if (err) {
                                // reject([]);
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({
                                status: 200,
                                message: `Post (${title}) has been liked successfully!`,
                                likesCount: likesCount,
                                unlikesCount: unlikesCount
                            });
                        });
                    } else {
                        resolve({ status: 400, message: "Post not found!" });
                    }
                });
            });
        },

        unlikePost: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.get("SELECT title, likes_count, unlikes_count FROM posts WHERE id=?;", [content.id], function (err, row) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        const title = row.title;
                        const likesCount = row.likes_count;
                        const unlikesCount = row.unlikes_count + 1;
                        database.run("UPDATE posts SET unlikes_count=? WHERE id=?;", [unlikesCount, content.id], function (err, rows) {
                            if (err) {
                                // reject([]);
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({
                                status: 200,
                                message: `Post (${title}) has been unliked successfully!`,
                                likesCount: likesCount,
                                unlikesCount: unlikesCount
                            });
                        });
                    } else {
                        resolve({ status: 400, message: "Post not found!" });
                    }
                });
            });
        },

        createComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("INSERT INTO comments(body, user_id, post_id, create_date) VALUES(?,?,?,?);", [content.body, content.userId, content.postId, content.createDate], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Comment saved successfully!` });
                });
            });
        },

        deleteComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                // raw SQLite query to select from table
                database.get("SELECT id FROM comments WHERE id=?;", [content.id], function (err, row) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    if (row) {
                        database.run("DELETE FROM comments WHERE id=?;", [content.id], function (err, rows) {
                            if (err) {
                                // reject([]);
                                resolve({ status: 400, message: err.message });
                            }
                            resolve({ status: 200, message: `Comment deleted successfully!` });
                        });
                    } else {
                        resolve({ status: 400, message: "Comment not found!" });
                    }
                });
            });
        },

        replyComment: (root, args, context, info) => {
            return new Promise((resolve, reject) => {
                // raw SQLite query to select from table
                const content = args.content;
                database.run("INSERT INTO comment_replies(body, user_id, comment_id, create_date) VALUES(?,?,?,?);", [content.body, content.userId, content.commentId, content.createDate], function (err, rows) {
                    if (err) {
                        // reject([]);
                        resolve({ status: 400, message: err.message });
                    }
                    resolve({ status: 200, message: `Comment reply saved successfully!` });
                });
            });
        },
    }
};

module.exports = resolvers;