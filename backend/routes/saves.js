const pool = require('../db');
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
    const query = promisify(pool.query).bind(pool);

    // GET /posts/:id/saves (get saves on a post)
    app.get("/posts/:id/saves",
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
                const saves = await query("SELECT users.id, users.username, users.displayname FROM saves JOIN users ON saves.user = users.id WHERE post = ?", [id]);
                res.status(200).send({
                    message: "Saves fetched",
                    success: true,
                    saves,
                })
            } catch (e) {
                logger.error("Error in GET /posts/:id/saves: ", e);
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

    // POST /posts/:id/saves (save post)
    app.post("/posts/:id/saves",
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
                    throw new Error("Cannot save your own post");
                const saveResult = await query("SELECT id FROM db.saves WHERE post = ? AND user = ?", [id, user.id]);
                if (saveResult.length > 0)
                    throw new Error("Already saved");
                await query("INSERT INTO db.saves (user, post) VALUES (?, ?)", [user.id, id]);
                res.status(201).send({
                    message: "Post saved",
                    success: true,
                })
            } catch (e) {
                logger.error("Error in POST /posts/:id/save: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Cannot save your own post") {
                    res.status(403).send({
                        message: "Cannot save your own post",
                        success: false,
                    })
                } else if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    })
                } else if (e.message === "Already saved") {
                    res.status(409).send({
                        message: "Already saved",
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

    // DELETE /posts/:id/saves (unsave post)
    app.delete("/posts/:id/saves",
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
                await query("DELETE FROM db.saves WHERE user = ? AND post = ?", [user.id, id]);
                res.status(204).send();
            } catch (e) {
                logger.error("Error in DELETE /posts/:id/save: ", e);
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

    // PATCH /posts/:id/saves (save/unsave post)
    app.patch("/posts/:id/saves",
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
                    throw new Error("Cannot save your own post");
                const saveResult = await query("SELECT id FROM db.saves WHERE post = ? AND user = ?", [id, user.id]);
                if (saveResult.length > 0)
                {
                    await query("DELETE FROM db.saves WHERE user = ? AND post = ?", [user.id, id]);
                    res.status(200).send({
                        message: "Post unsaved",
                        success: true,
                    });
                }
                else
                {
                    await query("INSERT INTO db.saves (user, post) VALUES (?, ?)", [user.id, id]);
                    res.status(201).send({
                        message: "Post saved",
                        success: true,
                    })
                }
            }
            catch (e) {
                logger.error("Error in PATCH /posts/:id/save: ", e);
                if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    })
                } else if (e.message === "Cannot save your own post") {
                    res.status(403).send({
                        message: "Cannot save your own post",
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

    // GET /users/:id/saves (get saved posts of a user)
    app.get("/users/:id/saves",
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
                const saves = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM saves JOIN posts ON saves.post = posts.id JOIN users ON users.id = saves.user WHERE users.id = ?", [id]);
                res.status(200).send({
                    message: "Saves fetched",
                    success: true,
                    saves,
                })
            } catch (e) {
                logger.error("Error in GET /users/:id/saves: ", e);
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

    // GET /users/saves (get saved posts of current user)
    app.get("/users/saves",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const user = await jwt.verifyToken(req);
                const saves = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM saves JOIN posts ON saves.post = posts.id JOIN users ON users.id = saves.user WHERE users.id = ?", [user.id]);
                res.status(200).send({
                    message: "Saves fetched",
                    success: true,
                    saves,
                })
            } catch (e) {
                logger.error("Error in GET /users/saves: ", e);
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
