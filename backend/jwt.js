const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

module.exports.makeJWT = (id) => {
    return jwt.sign(id, JWT_KEY);
}

const checkJWT = (token) => {
    return new Promise((res, rej) => {
        const decoded = jwt.verify(token, JWT_KEY);
        if (!decoded) {
            rej("Invalid token");
            return;
        }

        pool.query(
            "SELECT * FROM db.users WHERE id = ?",
            [decoded],
            (err, result) => {
                if (err) {
                    rej(err);
                }
                else if (result.length > 0)
                    res(result[0]);
            }
        )
    })
}

module.exports.verifyToken = (req) => {
    const header = req.headers["authorization"];

    return new Promise((res, rej) => {
        if (header) {
            const bearer = header.split(" ");
            const token = bearer[1];
            return res(checkJWT(token));
        }
        else  return rej();
    })
}