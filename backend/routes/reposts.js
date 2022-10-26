const pool = require('../db');
const jwt = require("../jwt");
const promisify = require("util").promisify;

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
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                else {
                    const queryResult2 = await query("SELECT users.username, users.displayname, users.id FROM db.reposts JOIN users ON users.id=reposts.user WHERE post = ?", [id]);
                    res.status(200).send({
                        success: true,
                        reposts: queryResult2,
                    })
                }
            } catch (e) {
                logger.error("Error in GET /posts/:id/reposts: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    });
                }
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
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                else {
                    const queryResult2 = await query("SELECT id FROM db.reposts WHERE user = ? AND post = ?", [user.id, id]);
                    if (queryResult2.length > 0) {
                        throw new Error("Already reposted");
                    }
                    else {
                        await query("INSERT INTO db.reposts (user, post) VALUES (?, ?)", [user.id, id]);
                        res.status(201).send({
                            success: true,
                            message: "Reposted successfully",
                        })
                    }
                }
            } catch (e) {
                logger.error("Error in POST /posts/:id/repost: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    });
                } else if (e.message === "Already reposted") {
                    res.status(403).send({
                        message: "Already reposted",
                        success: false,
                    });
                } else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e.message,
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
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                else {
                    const queryResult2 = await query("SELECT id FROM db.reposts WHERE user = ? AND post = ?", [user.id, id]);
                    if (queryResult2.length === 0) {
                        throw new Error("Not reposted");
                    }
                    else {
                        await query("DELETE FROM db.reposts WHERE user = ? AND post = ?", [user.id, id]);
                        res.status(204).send();
                    }
                }
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
                    });
                } else if (e.message === "Not reposted") {
                    res.status(403).send({
                        message: "Not reposted",
                        success: false,
                    });
                } else
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e,
                        success: false,
                    })
            }
        }
    )
}