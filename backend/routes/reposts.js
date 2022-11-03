const pool = require('../db');
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
    const query = promisify(pool.query).bind(pool);

    // GET /posts/:id/reposts (get reposts on a post)
    app.get("/posts/:id/reposts",
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
                const reposts = await query("SELECT users.id, users.username, users.displayname FROM reposts JOIN users ON reposts.user = users.id WHERE post = ?", [id]);
                res.status(200).send({
                    message: "Reposts fetched",
                    success: true,
                    reposts,
                })
            } catch (e) {
                logger.error("Error in GET /posts/:id/reposts: ", e);
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
        })

    // POST /posts/:id/reposts (repost post)
    app.post("/posts/:id/reposts",
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
                    throw new Error("Cannot repost your own post");
                const repostResult = await query("SELECT id FROM db.reposts WHERE post = ? AND user = ?", [id, user.id]);
                if (repostResult.length > 0)
                    throw new Error("Already reposted");
                await query("INSERT INTO db.reposts (user, post) VALUES (?, ?)", [user.id, id]);
                res.status(201).send({
                    message: "Post reposted",
                    success: true,
                })
            } catch (e) {
                logger.error("Error in POST /posts/:id/repost: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Cannot repost your own post") {
                    res.status(403).send({
                        message: "Cannot repost your own post",
                        success: false,
                    })
                } else if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    })
                } else if (e.message === "Already reposted") {
                    res.status(409).send({
                        message: "Already reposted",
                        success: false,
                    })
                } else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e,
                        success: false,
                    })
            }
        })

    // DELETE /posts/:id/reposts (unrepost post)
    app.delete("/posts/:id/reposts",
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
                await query("DELETE FROM db.reposts WHERE user = ? AND post = ?", [user.id, id]);
                res.status(204).send();
            } catch (e) {
                logger.error("Error in DELETE /posts/:id/repost: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
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

    // PATCH /posts/:id/reposts (repost/unrepost post)
    app.patch("/posts/:id/reposts",
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
                    throw new Error("Cannot repost your own post");
                const repostResult = await query("SELECT id FROM db.reposts WHERE post = ? AND user = ?", [id, user.id]);
                if (repostResult.length > 0)
                {
                    await query("DELETE FROM db.reposts WHERE user = ? AND post = ?", [user.id, id]);
                    res.status(200).send({
                        message: "Post unreposted",
                        success: true,
                    });
                }
                else
                {
                    await query("INSERT INTO db.reposts (user, post) VALUES (?, ?)", [user.id, id]);
                    res.status(201).send({
                        message: "Post reposted",
                        success: true,
                    })
                }
            }
            catch (e) {
                logger.error("Error in PATCH /posts/:id/reposts: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Cannot repost your own post") {
                    res.status(403).send({
                        message: "Cannot repost your own post",
                        success: false,
                    })
                } else if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    })
                } else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e,
                        success: false,
                    })
            }
        });

    // GET /users/:id/reposts (get reposted posts of a user)
    app.get("/users/:id/reposts",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const { id } = req.params;
                const queryResult = await query("SELECT id FROM db.users WHERE id = ?", [id]);
                if (queryResult.length === 0)
                    throw new Error("User not found");
                const reposts = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM reposts JOIN posts ON reposts.post = posts.id JOIN users ON users.id = reposts.user WHERE users.id = ?", [id]);
                res.status(200).send({
                    message: "Reposts fetched",
                    success: true,
                    reposts,
                })
            } catch (e) {
                logger.error("Error in GET /users/:id/reposts: ", e);
                if (e.message === "User not found") {
                    res.status(404).send({
                        message: "User not found",
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

    // GET /users/reposts (get reposted posts of current user)
    app.get("/users/reposts",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const user = await jwt.verifyToken(req);
                const reposts = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM reposts JOIN posts ON reposts.post = posts.id JOIN users ON users.id = reposts.user WHERE users.id = ?", [user.id]);
                res.status(200).send({
                    message: "Reposts fetched",
                    success: true,
                    reposts,
                })
            } catch (e) {
                logger.error("Error in GET /users/reposts: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
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
}