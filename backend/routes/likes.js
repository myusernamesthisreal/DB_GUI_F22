const pool = require('../db');
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
  const query = promisify(pool.query).bind(pool);

  // GET /posts/:id/likes (get likes on a post)
  app.get("/posts/:id/likes",
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
        const likes = await query("SELECT users.id, users.username, users.displayname FROM likes JOIN users ON likes.user = users.id WHERE post = ?", [id]);
        res.status(200).send({
          message: "Likes fetched",
          success: true,
          likes,
        })
      } catch (e) {
        logger.error("Error in GET /posts/:id/likes: ", e);
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

  // POST /posts/:id/likes (like post)
  app.post("/posts/:id/likes",
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
          throw new Error("Cannot like your own post");
        await query("INSERT INTO db.likes (user, post) VALUES (?, ?)", [user.id, id]);
        res.status(200).send({
          message: "Post liked",
          success: true,
        })
      } catch (e) {
        logger.error("Error in POST /posts/:id/like: ", e);
        if (e.message === "Invalid token" || e.message === "Cannot like your own post") {
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
            reason: e,
            success: false,
          })
      }
    })

  // DELETE /posts/:id/likes (unlike post)
  app.delete("/posts/:id/likes",
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
        await query("DELETE FROM db.likes WHERE user = ? AND post = ?", [user.id, id]);
        res.status(204).send();
      } catch (e) {
        logger.error("Error in DELETE /posts/:id/like: ", e);
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

  // GET /users/:id/likes (get liked posts of a user)
  app.get("/users/:id/likes",
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
        const likes = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM likes JOIN posts ON likes.post = posts.id JOIN users ON users.id = likes.user WHERE users.id = ?", [id]);
        res.status(200).send({
          message: "Likes fetched",
          success: true,
          likes,
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/likes: ", e);
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

  // GET /users/likes (get liked posts of current user)
  app.get("/users/likes",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const likes = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname FROM likes JOIN posts ON likes.post = posts.id JOIN users ON users.id = likes.user WHERE users.id = ?", [user.id]);
        res.status(200).send({
          message: "Likes fetched",
          success: true,
          likes,
        })
      } catch (e) {
        logger.error("Error in GET /users/likes: ", e);
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
