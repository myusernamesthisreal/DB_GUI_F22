const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("../jwt");

module.exports =
  /**
   * @param {import("express").Application} app 
   * @param {import("winston").Logger} logger 
   */
  (app, logger) => {

    // POST /users (create user)
    app.post("/users",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      (req, res) => {
        const { username, password } = req.body;
        const saltRounds = 10;
        const error =
          /**
           * @param {import("mysql").MysqlError} e 
           */
          (e) => {
            logger.error("Error in POST /users: ", e);
            if (e?.code === "ER_DUP_ENTRY") {
              res.status(409).send({
                message: "Username already exists",
                success: false,
              });
            } else
              res.status(400).send({
                message: "Error creating user",
                success: false,
              })
          }
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) {
            error(err);
            return;
          }
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              error(err);
              return;
            }
            pool.query(
              "INSERT INTO db.users (username, displayname, password) VALUES (?, ?, ?) ",
              [username, username, hash],
              (err, result) => {
                if (err) {
                  error(err);
                  return;
                }
                const JWT = jwt.makeJWT(result.insertId);
                res.status(201).cookie("session", JWT, { httpOnly: true, path: "/", maxAge: 604800000 }).send({
                  message: "User created successfully",
                  success: true,
                  token: JWT,
                  username,
                });
              }
            )
          })
        })
      })

    // POST /login (login user)
    app.post("/login",
      /**
       * @param {import('express').Request} req
       * @param {import('express').Response} res
       */
      (req, res) => {
        const { username, password } = req.body;

        pool.query(
          "SELECT * FROM db.users WHERE username = ?",
          [username],
          (err, result) => {
            if (err || result.length === 0) {
              logger.error("Error in POST /login: ", err);
              res.status(400).send({
                message: "Error logging in: Invalid username or password",
                success: false,
              })
              return;
            }
            else {
              const storedPassword = result[0]["password"];
              bcrypt.compare(password, storedPassword, (err, result2) => {
                if (result2 && !err) {
                  const { username, id } = result[0];
                  const JWT = jwt.makeJWT(result[0].id);
                  res.status(200).cookie("session", JWT, { httpOnly: true, path: "/", maxAge: 604800000 }).send({
                    message: "Login successful",
                    success: true,
                    username,
                    token: JWT,
                  });
                }
                else {
                  logger.error("Error in POST /login: ", err);
                  res.status(400).send({
                    message: "Error logging in: Invalid username or password",
                    success: false,
                  })
                }
              })
            }
          }
        )
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
          console.log("User: ", user);
          if (user) {
            res.status(200).send({
              message: "Token is valid",
              success: true,
              username: user.username,
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
          res.status(400).send({
            message: "Something went wrong",
            error: e,
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
          if (user.is_admin) {
            res.status(200).send({
              admin: true,
              message: "User is admin",
              success: true,
              username: user.username,
            })
          }
          else {
            res.status(200).send({
              admin: false,
              message: "User is not admin",
              success: true,
              username: user.username,
            })
          }
        } catch (e) {
          logger.error("Error in GET /users/admin: ", e);
          res.status(400).send({
            message: "Something went wrong",
            reason: e,
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
          pool.query(
            "UPDATE db.users SET displayname = ? WHERE id = ?",
            [displayName, user.id],
            (err, result) => {
              if (err) {
                logger.error("Error in POST /displayname: ", err);
                res.status(400).send({
                  message: "Error changing displayname",
                  success: false,
                })
              }
              else {
                res.status(200).send({
                  message: "Displayname changed successfully",
                  success: true,
                })
              }
            }
          )
        } catch (e) {
          logger.error("Error in POST /displayname: ", e);
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