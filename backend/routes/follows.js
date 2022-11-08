const pool = require('../db');
const {promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
  const query = promisify(pool.query).bind(pool);

  // GET /users/following (get users the current user is following)
  app.get("/users/following",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", [src.id]);
        if (queryResult.length == 0)
          throw new Error("Following not found");
        const following = await query("SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.dst WHERE src = ?", [src.id]);
        res.status(200).send({
          message: "Following fetched",
          success: true,
          following,
        })
      } catch (e) {
        logger.error("Error in GET /users/following: ", e);
        if (e.message === "Following not found") {
          res.status(404).send({
            message: "Following not found",
            success: false,
          })
        } else {
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
        }
      }
    }
  );

  // GET /users/:id/following (get users that a given user is following)
  app.get("/users/:id/following",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const { id: srcid } = req.params;
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", srcid);
        if (queryResult.length == 0)
          throw new Error("Following not found");
        const following = await query("SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.dst WHERE src = ?", srcid);
        res.status(200).send({
          message: "Following fetched",
          success: true,
          following,
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/following: ", e);
        if (e.message === "Following not found") {
          res.status(404).send({
            message: "Following not found",
            success: false,
          })
        } else {
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
        }
      }
    }
  );

  // GET /users/followers (get users following the current user)
  app.get("/users/followers",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const dst = await jwt.verifyToken(req);
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", [dst.id]);
        if (queryResult.length === 0)
          throw new Error("Followers not found");
        const followers = await query("SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.src WHERE dst = ?", [dst.id]);
        res.status(200).send({
          message: "Followers",
          success: true,
          followers,
        })
      } catch (e) {
        logger.error("Error in GET /users/following: ", e);
        if (e.message === "Followers not found") {
          res.status(404).send({
            message: "Followers not found",
            success: false,
          })
        } else {
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
        }
      }
    }
  );

  // GET /users/:id/followers (get users following a given user)
  app.get("/users/:id/followers",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const { id: dstid } = req.params;
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", dstid);
        if (queryResult.length === 0)
          throw new Error("Followers not found");
        const followers = await query("SELECT users.username, users.displayname, users.id FROM db.follows JOIN users ON users.id = follows.src WHERE dst = ?", dstid);
        res.status(200).send({
          message: "Followers",
          success: true,
          followers,
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/following: ", e);
        if (e.message === "Followers not found") {
          res.status(404).send({
            message: "Followers not found",
            success: false,
          })
        } else {
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
        }
      }
    }
  );

  // POST /users/:id/follow (follow user)
  app.post("/users/:id/follow",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        const { id: dstid } = req.params;
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", [dstid]);
        if (queryResult.length === 0)
          throw new Error("User not found");
        if (queryResult[0].id === src.id)
          throw new Error("You cannot follow yourself");
        const followResult = await query("SELECT id FROM db.follows WHERE src = ? AND dst = ?", [src.id, dstid]);
        if (followResult.length > 0)
          throw new Error("Already followed");
        await query("INSERT INTO db.follows (src, dst) VALUES (?, ?)", [src.id, dstid]);
        res.status(201).send({
          message: "User followed",
          success: true,
        })
      } catch (e) {
        logger.error("Error in POST /users/:id/follows: ", e);
        if (e.message === "Invalid token") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "You cannot follow yourself") {
          res.status(403).send({
            message: "You cannot follow yourself",
            success: false,
          })
        } else if (e.message === "User not found") {
          res.status(404).send({
            message: "User not found",
            success: false,
          })
        } else if (e.message === "Already followed") {
          res.status(409).send({
            message: "Already followed",
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
  );

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
        const queryResult = await query("SELECT id FROM db.follows WHERE id = ?", [dstid]);
        if (queryResult.length === 0)
          throw new Error("User not found");
        if (queryResult[0].id === src.id)
          throw new Error("How did you even follow yourself?");
        await query("DELETE FROM db.follows WHERE src = ? AND dst = ?", [src.id, dstid]);
        res.status(204).send();
      } catch (e) {
        logger.error("Error in DELETE /users/:id/unfollow: ", e);
        if (e.message === "Invalid token") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "User not found") {
          res.status(404).send({
            message: "User not found",
            success: false,
          })
        } else if (e.message === "How did you even follow yourself?") {
          res.status(405).send({
            message: "How did you even follow yourself?",
            success: false,
          })
        } else
          res.status(500).setDefaultEncoding({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
      }
    }
  );

  // PATCH /users/:id/follows (follow/unfollow user)
  app.patch("/users/:id/follows",
  /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const src = await jwt.verifyToken(req);
        const { id: dstid } = req.params;
        const queryResult = await query("SELECT id FROM db.users WHERE id = ?", [dstid]);
        if (queryResult.length === 0)
          throw new Error("User not found");
        if (queryResult[0].id === src.id)
          throw new Error("Cannot follow yourself");
        const followResult = await query("SELECT id FROM db.follows WHERE src = ? AND dst = ?", [src.id, dstid]);
        if (followResult[0] === src.id)
          throw new Error("How did you even follow yourself?");
        if (followResult.length > 0) {
          await query("DELETE FROM db.follows WHERE src = ? AND dst = ?", [src.id, dstid]);
          res.status(200).send({
            message: "User unfollowed",
            success: true,
          })
        } else {
          await query("INSERT INTO db.follows (src, dst) VALUES (?,?)", [src.id, dstid]);
          res.status(201).send({
            message: "User followed",
            success: true,
          })
        }
      } catch (e) {
        logger.error("Error in PATCH /follows/:id/follows: ", e);
        if (e.message === "Invalid token") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "Cannot follow yourself") {
          res.status(403).send({
            message: "Cannot follow yourself",
            success: false,
          })
        } else if (e.message === "User not found") {
          res.status(404).send({
            message: "User not found",
            success: false,
          })
        } else if (e.message === "How did you even follow yourself?") {
          res.status(405).send({
            message: "How did you even follow yourself?",
            success: false,
          })
        } else {
          res.status(500).send({
            message: "Something went wrong",
            reason: e,
            success: false,
          })
        }
      }
    }
  );
}