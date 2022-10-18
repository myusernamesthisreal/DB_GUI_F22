const pool = require("../db");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {

  //POST /posts (create post)
  app.post("/posts",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { body } = req.body;
        pool.query(
          "INSERT INTO db.posts (body, author) VALUES (?, ?)",
          [body, user.id],
          (err, result) => {
            if (err) {
              logger.error("Error in POST /posts: ", err);
              res.status(400).send({
                message: "Error creating post",
                success: false,
              })
            }
            else {
              res.status(200).send({
                message: "Post created successfully",
                success: true,
              })
            }
          }
        )
      } catch (e) {
        logger.error("Error in POST /posts: ", e);
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

  //GET /posts (get all posts)
  app.get("/posts",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        pool.query(
          "SELECT *, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts",
          (err, result) => {
            if (err) {
              logger.error("Error in GET /posts: ", err);
              res.status(500).send({
                message: "Error getting posts",
                success: false,
              })
            }
            else {
              res.status(200).send({
                success: true,
                posts: result,
              })
            }
          }
        )
      } catch (e) {
        logger.error("Error in GET /posts: ", e);
        res.status(500).send({
          message: "Something went wrong",
          reason: e,
          success: false,
        })
      }
    })

  //GET /posts/:id (get post by id)
  app.get("/posts/:id",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const { id } = req.params;
        pool.query(
          "SELECT *, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              logger.error("Error in GET /posts/:id: ", err);
              res.status(500).send({
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
              res.status(200).send({
                success: true,
                post: result[0],
              })
            }
          }
        )
      } catch (e) {
        logger.error("Error in GET /posts/:id: ", e);
        res.status(500).send({
          message: "Something went wrong",
          reason: e,
          success: false,
        })
      }
    })

  //GET /users/:id/posts (get posts by user id)
  app.get("/users/:id/posts",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const { id } = req.params;
        pool.query(
          "SELECT *, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts WHERE author = ?",
          [id],
          (err, result) => {
            if (err) {
              logger.error("Error in GET /users/:id/posts: ", err);
              res.status(400).send({
                message: "Error getting posts",
                success: false,
              })
            }
            else {
              res.status(200).send({
                success: true,
                posts: result,
              })
            }
          }
        )
      } catch (e) {
        logger.error("Error in GET /users/:id/posts: ", e);
        res.status(500).send({
          message: "Something went wrong",
          reason: e,
          success: false,
        })
      }
    })

  //PUT /posts/:id (edit post)
  app.put("/posts/:id",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { id } = req.params;
        const { body } = req.body;
        pool.query(
          "SELECT * FROM db.posts WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              logger.error("Error in PUT /posts/:id: ", err);
              res.status(400).send({
                message: "Error getting post",
                success: false,
              })
            }
            else if (result.length === 0) {
              res.status(404).send({
                message: "Post not found",
                success: false,
              })
            }
            else {
              if (result[0].author !== user.id) {
                res.status(401).send({
                  message: "You do not have permission to edit this post",
                  success: false,
                })
              } else {
                pool.query(
                  "UPDATE db.posts SET body = ?, edited = 1 WHERE id = ?",
                  [body, id],
                  (err, result) => {
                    if (err) {
                      logger.error("Error in PUT /posts/:id: ", err);
                      res.status(400).send({
                        message: "Error editing post",
                        success: false,
                      })
                    }
                    else {
                      res.status(200).send({
                        message: "Post edited successfully",
                        success: true,
                      })
                    }
                  }
                )
              }
            }
          }
        )
      } catch (e) {
        logger.error("Error in PUT /posts/:id: ", e);
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

  //DELETE /posts/:id (delete post)
  app.delete("/posts/:id",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { id } = req.params;
        pool.query(
          "SELECT * FROM db.posts WHERE id = ?",
          [id],
          (err, result) => {
            if (err || result.length === 0) {
              logger.error("Error in DELETE /posts/:id: ", err);
              res.status(400).send({
                message: "Error getting post",
                success: false,
              })
            }
            else {
              if (result[0].author !== user.id) {
                res.status(401).send({
                  message: "You do not have permission to delete this post",
                  success: false,
                })
              } else {
                pool.query(
                  "DELETE FROM db.posts WHERE id = ?",
                  [id],
                  (err, result) => {
                    if (err) {
                      logger.error("Error in DELETE /posts/:id: ", err);
                      res.status(400).send({
                        message: "Error deleting post",
                        success: false,
                      })
                    }
                    else {
                      res.status(204).send({
                        message: "Post deleted successfully",
                        success: true,
                      })
                    }
                  }
                )
              }
            }
          }
        )
      } catch (e) {
        logger.error("Error in DELETE /posts/:id: ", e);
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