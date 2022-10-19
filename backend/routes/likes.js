const pool = require('../db');
const jwt = require("../jwt");

module.exports = function routes(app, logger) {

  // GET /posts/:id/likes (get likes on a post)
  app.get("/posts/:id/likes",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const { id } = req.params;
        pool.query("SELECT id FROM db.posts WHERE id = ?", [id], (err, result) => {
          if (err) {
            logger.error("Error in GET /posts/:id/likes: ", err);
            res.status(500).send({
              message: "Error getting likes",
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
            "SELECT users.username, users.displayname, users.id FROM db.likes JOIN users ON users.id=likes.user WHERE post = ?",
            [id],
            (err, result) => {
              if (err) {
                logger.error("Error in GET /posts/:id/likes: ", err);
                res.status(500).send({
                  message: "Error getting post likes",
                  success: false,
                })
              }
              else {
                res.status(200).send({
                  success: true,
                  likes: result,
                })
              }
            }
          )
        })
      } catch (e) {
        logger.error("Error in GET /posts/:id/likes: ", e);
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
