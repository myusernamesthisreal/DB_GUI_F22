const pool = require('../db');
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
  // POST /posts/:id/like (like post)
  app.post("/posts/:id/like",
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
            if (err) {
              logger.error("Error in POST /posts/:id/like: ", err);
              res.status(400).send({
                message: "Error getting post",
                success: false,
              })
            }
            else {
              if (result[0].author === user.id) {
                res.status(401).send({
                  message: "You cannot like your own post",
                  success: false,
                })
              } else {
                pool.query(
                  "SELECT * FROM db.likes WHERE post = ? AND user = ?",
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
                      if (result.length > 0) {
                        pool.query(
                          "DELETE FROM db.likes WHERE post = ? AND user = ?",
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
                              res.status(200).send({
                                message: "Post unliked successfully",
                                success: true,
                              })
                            }
                          }
                        )
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
}