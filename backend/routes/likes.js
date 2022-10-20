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
          reason: e,
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
        pool.query(
          "SELECT author FROM db.posts WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              logger.error("Error in POST /posts/:id/like: ", err);
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
                  message: "You cannot like your own post",
                  success: false,
                })
              } else {
                pool.query("SELECT id FROM db.likes WHERE user = ? AND post = ?", [user.id, id], (err, result) => {
                  if (err) {
                    logger.error("Error in POST /posts/:id/like: ", err);
                    res.status(400).send({
                      message: "Error getting post",
                      success: false,
                    })
                  }
                  else {
                    if (result.length > 0) {
                      res.status(400).send({
                        message: "You have already liked this post",
                        success: false,
                      })
                    } else {
                      pool.query(
                        "INSERT INTO db.likes (post, user) VALUES (?, ?)",
                        [id, user.id],
                        (err, result) => {
                          if (err) {
                            logger.error("Error in POST /posts/:id/like: ", err);
                            res.status(400).send({
                              message: "Error liking post",
                              success: false,
                            })
                          }
                          else {
                            res.status(201).send({
                              message: "Post liked successfully",
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
        logger.error("Error in POST /posts/:id/like: ", e);
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
        pool.query(
          "SELECT author FROM db.posts WHERE id = ?",
          [id],
          (err, result) => {
            if (err) {
              logger.error("Error in DELETE /posts/:id/like: ", err);
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
                  message: "You cannot unlike your own post",
                  success: false,
                })
              } else {
                pool.query(
                  "DELETE FROM db.likes WHERE post = ? AND user = ?",
                  [id, user.id],
                  (err, result) => {
                    if (err) {
                      logger.error("Error in DELETE /posts/:id/like: ", err);
                      res.status(400).send({
                        message: "Error unliking post",
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
        logger.error("Error in DELETE /posts/:id/like: ", e);
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
