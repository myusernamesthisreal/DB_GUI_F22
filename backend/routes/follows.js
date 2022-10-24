const pool = require('../db');
const jwt = require("../jwt");

module.exports = function routes(app, logger) {

  // GET /users/:id/follows (get users this user is following)
  app.get("/users/following",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        pool.query("SELECT id FROM db.users WHERE id = ?", [src.id], (err, result) => {
          if (err) {
            logger.error("Error in GET /users/:id/following: ", err);
            res.status(500).send({
              message: "Error getting users followed",
              success: false,
            })
          }
          else if (result.length === 0) {
            res.status(404).send({
              message: "User not found",
              success: false,
            });
          }
          else pool.query(
            "SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.dst WHERE src = ?",
            (err, result) => {
              if (err) {
                logger.error("Error in GET /users/:id/following: ", err);
                res.status(500).send({
                  message: "Error getting users followed",
                  success: false,
                })
              }
              else {
                res.status(200).send({
                  success: true,
                  follows: result,
                })
              }
            }
          )
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/following: ", e);
        res.status(500).send({
          message: "Something went wrong",
          reason: e,
          success: false,
        })
      }
    })

    app.get("/users/followers",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        pool.query("SELECT id FROM db.users WHERE id = ?", [src.id], (err, result) => {
          if (err) {
            logger.error("Error in GET /users/:id/following: ", err);
            res.status(500).send({
              message: "Error getting users followed",
              success: false,
            })
          }
          else if (result.length === 0) {
            res.status(404).send({
              message: "User not found",
              success: false,
            });
          }
          else pool.query(
            "SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.src WHERE dst = ?",
            [src.id],
            (err, result) => {
              if (err) {
                logger.error("Error in GET /users/:id/following: ", err);
                res.status(500).send({
                  message: "Error getting users followed",
                  success: false,
                })
              }
              else {
                res.status(200).send({
                  success: true,
                  follows: result,
                })
              }
            }
          )
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/following: ", e);
        res.status(500).send({
          message: "Something went wrong",
          reason: e,
          success: false,
        })
      }
    })

  // POST /users/:id/follows (follows user)
  app.post("/users/:id/follows",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        const { id: dstid } = req.params;
        pool.query(
          "SELECT id FROM db.users WHERE id = ?",
          [dstid],
          (err, result) => {
            if (err) {
              logger.error("Error in POST /user/:id/follows: ", err);
              res.status(400).send({
                message: "Error following user",
                success: false,
              })
            }
            else if (result.length === 0) {
              res.status(404).send({
                message: "User not found",
                success: false,
              });
            }
            else {
              if (result[0].id === src.id) {
                res.status(401).send({
                  message: "You cannot follow yourself",
                  success: false,
                })
              } else {
                pool.query("SELECT id FROM db.follows WHERE src = ? AND dst = ?", [src.id, dstid], (err, result) => {
                  if (err) {
                    logger.error("Error in POST /users/:id/follows: ", err);
                    res.status(400).send({
                      message: "Error following user",
                      success: false,
                    })
                  }
                  else {
                    if (result.length > 0) {
                      res.status(400).send({
                        message: "You have already followed this user",
                        success: false,
                      })
                    } else {
                      pool.query(
                        "INSERT INTO db.follows (src, dst) VALUES (?, ?)",
                        [src.id, dstid],
                        (err, result) => {
                          if (err) {
                            logger.error("Error in POST /users/:id/follows: ", err);
                            res.status(400).send({
                              message: "Error following user",
                              success: false,
                            })
                          }
                          else {
                            res.status(201).send({
                              message: "User followed successfully",
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
        logger.error("Error in POST /users/:id/follows: ", e);
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

  // DELETE /users/:id/unfollow (unfollow user)
  app.delete("/users/:id/unfollow",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        const { id: dstid } = req.params;
        pool.query(
          "SELECT dst FROM db.follows WHERE id = ?",
          [dstid],
          (err, result) => {
            if (err) {
              logger.error("Error in DELETE /users/:id/unfollow: ", err);
              res.status(400).send({
                message: "Error unfollowing user",
                success: false,
              })
            }
            else if (result.length === 0) {
              res.status(404).send({
                message: "user not found",
                success: false,
              });
            }
            else {
              if (result[0].id === src.id) {
                res.status(401).send({
                  message: "How did you even follow yourself?",
                  success: false,
                })
              } else {
                pool.query(
                  "DELETE FROM db.follows WHERE src = ? AND dst = ?",
                  [src.id, dstid],
                  (err, result) => {
                    if (err) {
                      logger.error("Error in DELETE /users/:id/unfollow: ", err);
                      res.status(400).send({
                        message: "Error unfollowing user",
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
        logger.error("Error in DELETE /users/:id/unfollow: ", e);
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
