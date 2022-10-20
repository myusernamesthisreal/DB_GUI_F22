const pool = require('../db');
const jwt = require("../jwt");

module.exports = function routes(app, logger) {

    // GET /posts/:id/reposts (get reposts on a post)
    app.get("/posts/:id/reposts",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const { id } = req.params;
                pool.query("SELECT id FROM db.posts WHERE id = ?", [id], (err, result) => {
                    if (err) {
                        logger.error("Error in GET /posts/:id/reposts: ", err);
                        res.status(500).send({
                            message: "Error getting reposts",
                            success: false,
                        })
                    }
                    else if (result.length === 0) {
                        res.status(404).send({
                            message: "Post not found",
                            success: false,
                        });
                    }
                    else pool.query(
                            "SELECT users.username, users.displayname, users.id FROM db.reposts JOIN users ON users.id=reposts.user WHERE post = ?",
                            [id],
                            (err, result) => {
                                if (err) {
                                    logger.error("Error in GET /posts/:id/reposts: ", err);
                                    res.status(500).send({
                                        message: "Error getting post reposts",
                                        success: false,
                                    })
                                }
                                else {
                                    res.status(200).send({
                                        success: true,
                                        reposts: result,
                                    })
                                }
                            }
                        )
                })
            } catch (e) {
                logger.error("Error in GET /posts/:id/reposts: ", e);
                res.status(500).send({
                    message: "Something went wrong",
                    reason: e,
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
                pool.query(
                    "SELECT author FROM db.posts WHERE id = ?",
                    [id],
                    (err, result) => {
                        if (err) {
                            logger.error("Error in POST /posts/:id/repost: ", err);
                            res.status(400).send({
                                message: "Error getting post",
                                success: false,
                            })
                        }
                        else if (result.length === 0) {
                            res.status(404).send({
                                message: "Post not found",
                                success: false,
                            });
                        }
                        else {
                            if (result[0].author === user.id) {
                                res.status(401).send({
                                    message: "You cannot repost your own post",
                                    success: false,
                                })
                            } else {
                                pool.query("SELECT id FROM db.reposts WHERE user = ? AND post = ?", [user.id, id], (err, result) => {
                                        if (err) {
                                            logger.error("Error in POST /posts/:id/repost: ", err);
                                            res.status(400).send({
                                                message: "Error getting post",
                                                success: false,
                                            })
                                        }
                                        else {
                                            if (result.length > 0) {
                                                res.status(400).send({
                                                    message: "You have already reposted this post",
                                                    success: false,
                                                })
                                            } else {
                                                pool.query(
                                                    "INSERT INTO db.reposts (post, user) VALUES (?, ?)",
                                                    [id, user.id],
                                                    (err, result) => {
                                                        if (err) {
                                                            logger.error("Error in POST /posts/:id/repost: ", err);
                                                            res.status(400).send({
                                                                message: "Error liking post",
                                                                success: false,
                                                            })
                                                        }
                                                        else {
                                                            res.status(201).send({
                                                                message: "Post reposted successfully",
                                                                success: true,
                                                            })
                                                        }
                                                    }
                                                )
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    }
                )
            } catch (e) {
                logger.error("Error in POST /posts/:id/repost: ", e);
                if (e === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
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
                pool.query(
                    "SELECT author FROM db.posts WHERE id = ?",
                    [id],
                    (err, result) => {
                        if (err) {
                            logger.error("Error in DELETE /posts/:id/repost: ", err);
                            res.status(400).send({
                                message: "Error getting post",
                                success: false,
                            })
                        }
                        else if (result.length === 0) {
                            res.status(404).send({
                                message: "Post not found",
                                success: false,
                            });
                        }
                        else {
                            if (result[0].author === user.id) {
                                res.status(401).send({
                                    message: "You cannot unrepost your own post",
                                    success: false,
                                })
                            } else {
                                pool.query(
                                    "DELETE FROM db.reposts WHERE post = ? AND user = ?",
                                    [id, user.id],
                                    (err, result) => {
                                        if (err) {
                                            logger.error("Error in DELETE /posts/:id/repost: ", err);
                                            res.status(400).send({
                                                message: "Error unreposting post",
                                                success: false,
                                            })
                                        }
                                        else {
                                            res.status(204).send();
                                        }
                                    }
                                )
                            }
                        }
                    }
                )
            } catch (e) {
                logger.error("Error in DELETE /posts/:id/repost: ", e);
                if (e === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
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