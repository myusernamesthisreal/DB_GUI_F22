const pool = require('./db')
const bcrypt = require('bcryptjs')
const jwt = require("./jwt")

module.exports = function routes(app, logger) {
  // GET /
  app.get('/', (req, res) => {
    res.status(200).send('Go to 0.0.0.0:3000.');
  });

  // POST /users (create user)

  app.post("/users", (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;
    const error = (e) => {
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
          "INSERT INTO db.users (username, password) VALUES (?, ?) ",
          [username, hash],
          (err, result) => {
            if (err) {
              error(err);
              return;
            }

            const JWT = jwt.makeJWT(result.insertId);
            res.status(201).send({
              message: "User created successfully",
              success: true,
              token: JWT,
              username,
            })
          }
        )
      })
    })
  })

  // POST /login (login user)

  app.post("/login", (req, res) => {
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
              res.status(200).send({
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

  // GET /users/check (check if user is logged in)

  app.get("/users/check", async (req, res) => {
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

  app.get("/users/admin", async (req, res) => {
    try {
      const user = await jwt.verifyToken(req);
      if (user.is_admin) {
        res.status(200).send({
          message: "User is admin",
          success: true,
        })
      }
      else {
        res.status(200).send({
          message: "User is not admin",
          success: false,
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
}