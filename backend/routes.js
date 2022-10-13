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
}