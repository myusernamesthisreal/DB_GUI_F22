const pool = require("../db");
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
    const query = promisify(pool.query).bind(pool);

    // GET /posts/:id/comments (get comments on a post)
    app.get("/posts/:id/comments",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const { id } = req.params;
                const queryResult = await query("SELECT id FROM db.posts WHERE id = ?", [id]);
                if (queryResult.length === 0)
                    throw new Error("Post not found");
                const comments = await query("SELECT users.id, users.username AS authorname, users.displayname AS authordisplayname, comments.* FROM comments JOIN users ON comments.author = users.id WHERE parent = ?", [id]);
                res.status(200).send({
                    message: "Comments fetched",
                    success: true,
                    comments,
                })
            } catch (e) {
                logger.error("Error in GET /posts/:id/comments: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    })
                } else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e.message,
                        success: false,
                    })
            }
        }
    )

    // POST /posts/:id/comments (comment on post)
    app.post("/posts/:id/comments",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const user = await jwt.verifyToken(req);
                const { id } = req.params;
                const queryResult = await query("SELECT author FROM db.posts WHERE id = ?", [id]);
                if (queryResult.length === 0)
                    throw new Error("Post not found");
                if (queryResult[0].author === user.id)
                    throw new Error("Cannot comment on your own post");
                const { comment } = req.body;
                if (!comment)
                    throw new Error("Comment cannot be empty");
                const newComment = await query("INSERT INTO db.comments (author, parent, body) VALUES (?, ?, ?)", [user.id, id, comment]);
                const commentResult = await query("SELECT users.id, users.username AS authorname, users.displayname AS authordisplayname, comments.* FROM comments JOIN users ON comments.author = users.id WHERE comments.id = ?", [newComment.insertId]);
                res.status(201).send({
                    message: "Comment posted",
                    success: true,
                    comment: commentResult[0],
                })
            } catch (e) {
                logger.error("Error in POST /posts/:id/comments: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    })
                } else if (e.message === "Comment cannot be empty") {
                    res.status(400).send({
                        message: "Comment cannot be empty",
                        success: false,
                    })
                } else if (e.message === "Cannot comment on your own post") {
                    res.status(403).send({
                        message: "Cannot comment on your own post",
                        success: false,
                    })
                } else if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "You must be logged in to comment",
                        success: false,
                    })
                } 
                else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e.message,
                        success: false,
                    })
            }
        }
    )
}