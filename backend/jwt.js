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
    const token = req.headers["authorization"].split(" ")?.[1];
    return new Promise((res, rej) => {
        if (token) {
            return res(checkJWT(token));
        }
        else return rej();
    })
}

module.exports.isAdmin = (req) => {
    return new Promise((res, rej) => {
        this.verifyToken(req).then((result) => {
            if (result.is_admin) {
                res(true);
            }
            else {
                res(false);
            }
        }).catch((err) => {
            rej(err);
        })
    })
}