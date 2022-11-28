const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("../jwt");
const promisify = require("util").promisify;

module.exports =
  /**
   * @param {import("express").Application} app
   * @param {import("winston").Logger} logger
   */
  (app, logger) => {
    const query = promisify(pool.query).bind(pool);
    const genSalt = promisify(bcrypt.genSalt).bind(bcrypt);
    const hash = promisify(bcrypt.hash).bind(bcrypt);
    const compare = promisify(bcrypt.compare).bind(bcrypt);
    // POST /users (create user)
    app.post("/users",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      async (req, res) => {
        try {
          const { username, password } = req.body;
          if (!username || !password) throw new Error("Missing username or password");
          const checkExisting = await query("SELECT id FROM users WHERE username = ?", [username]);
          if (checkExisting.length > 0) throw new Error("Username already exists");
          const saltRounds = 10;
          const salt = await genSalt(saltRounds);
          const hashedPassword = await hash(password, salt);
          const result = await query("INSERT INTO users (username, displayname, password) VALUES (?, ?, ?)", [username, username, hashedPassword]);
          const token = jwt.makeJWT(result.insertId);
          res.status(201).cookie("session", token, { httpOnly: true, path: "/", maxAge: 604800000, sameSite: "lax", secure: process.env.PRODUCTION }).send({
            message: "User created successfully",
            success: true,
            username,
            id: result.insertId,
          });
        } catch (err) {
          if (err.message === "Username already exists") {
            res.status(409).send({
              message: err.message,
              success: false,
            });
          } else if (err.message === "Missing username or password") {
            res.status(400).send({
              message: err.message,
              success: false,
            });
          } else {
            logger.error(err);
            console.log(err.message);
            res.status(500).send({ message: "Internal Server Error" });
          }
        }

      })

    // POST /login (login user)
    app.post("/login",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      async (req, res) => {
        try {
          const { username, password } = req.body;
          if (!username || !password) throw new Error("Missing username or password");
          const existingUser = await query("SELECT id, password FROM users WHERE username = ?", [username]);
          if (existingUser.length === 0) throw new Error("User does not exist");
          const match = await compare(password, existingUser[0].password);
          if (!match) throw new Error("Incorrect password");
          const token = jwt.makeJWT(existingUser[0].id);
          res.status(200).cookie("session", token, { httpOnly: true, path: "/", maxAge: 604800000, sameSite: "lax", secure: process.env.PRODUCTION }).send({
            message: "Logged in successfully",
            success: true,
            username,
            id: existingUser[0].id,
          });
        } catch (err) {
          logger.error(err);
          console.log(err.message);
          if (err.message === "User does not exist" || err.message === "Incorrect password") {
            res.status(401).send({
              message: err.message,
              success: false,
            });
          } else if (err.message === "Missing username or password") {
            res.status(400).send({
              message: err.message,
              success: false,
            });
          } else
            res.status(500).send({ message: "Internal Server Error" });
        }
      })

    //POST /logout (logout user)
    app.post("/logout",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      (req, res) => {
        if (req.cookies?.session) {
          res.status(200).clearCookie("session").send({
            message: "Logout successful",
            success: true,
          });
        } else res.status(400).send({
          message: "You are not logged in",
          success: false,
        })
      })

    // GET /users/check (check if user is logged in)
    app.get("/users/check",
      /**
        * @param {import('express').Request} req
        * @param {import('express').Response} res
        */
      async (req, res) => {
        try {
          const user = await jwt.verifyToken(req);
          delete user.password;
          if (user) {
            res.status(200).send({
              message: "Token is valid",
              success: true,
              username: user.username,
              id: user.id,
              user,
            })
          }
          else {
            res.status(400).send({
              message: "Token is invalid",
              success: false,
            })
          }
        } catch (e) {
          logger.error("Error in GET /users/check: ", e);
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
      })

    // GET /users/admin (check if user is admin)
    app.get("/users/admin",
      /**
        * @param {import('express').Request} req
        * @param {import('express').Response} res
        */
      async (req, res) => {
        try {
          const user = await jwt.verifyToken(req);
          delete user.password;
          if (user.is_admin) {
            res.status(200).send({
              admin: true,
              message: "User is admin",
              success: true,
              username: user.username,
              id: user.id,
              user,
            })
          }
          else {
            res.status(200).send({
              admin: false,
              message: "User is not admin",
              success: true,
              username: user.username,
              id: user.id,
              user,
            })
          }
        } catch (e) {
          logger.error("Error in GET /users/admin: ", e);
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
      })

    //PUT /displayname (change displayname)
    app.put("/displayname",
      /**
        * @param {import('express').Request} req
        * @param {import('express').Response} res
        */
      async (req, res) => {
        try {
          const user = await jwt.verifyToken(req);
          const { displayName } = req.body;
          if (!displayName) throw new Error("Display name cannot be empty");
          const queryResult = await query(
            "UPDATE db.users SET displayname = ? WHERE id = ?",
            [displayName, user.id]
          )
          if (queryResult.affectedRows !== 1) throw new Error("Something went wrong");
          res.status(200).send({
            message: "Displayname changed successfully",
            success: true,
          })
        } catch (e) {
          logger.error("Error in POST /displayname: ", e);
          if (e.message === "Invalid token") {
            res.status(401).send({
              message: "Unauthorized",
              success: false,
            })
          } else if (e.message === "Display name cannot be empty") {
            res.status(400).send({
              message: e.message,
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

    //GET /users (get all users)
    app.get("/users",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      async (req, res) => {
        try {
          const queryResult = await query("SELECT id, username, displayname, is_admin FROM db.users");
          res.status(200).send({
            message: "Users fetched successfully",
            success: true,
            users: queryResult,
          });
        } catch (e) {
          logger.error("Error in GET /users: ", e);
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
        }
      })

    //GET /users/:id (get user by id)
    app.get("/users/:id",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      async (req, res) => {
        let authenticated = false;
        try {
          const user = await jwt.verifyToken(req);
          authenticated = user.id;
        } catch (e) { }
        try {
          const queryResult = await query("SELECT id, username, displayname, is_admin FROM db.users WHERE id = ?", [req.params.id]);
          if (queryResult.length === 0) throw new Error("User not found");

          if (authenticated && authenticated !== req.params.id) {
            const followsQueryResult = await query("SELECT follows.* FROM db.follows WHERE src = ? AND dst = ?", [authenticated, req.params.id]);
            if (followsQueryResult.length > 0) {
              queryResult[0].following = true;
            }
            else {
              queryResult[0].following = false;
            }
          } else {
            queryResult[0].following = false;
          }

          res.status(200).send({
            message: "User fetched successfully",
            success: true,
            user: queryResult[0],
          });
        } catch (e) {
          logger.error("Error in GET /users/:id: ", e);
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
      })
  }
