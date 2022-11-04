const pool = require("../db");
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
  const query = promisify(pool.query).bind(pool);
  //POST /posts (create post)
  app.post("/posts",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { body, categories } = req.body;
        if (!body)
          throw new Error("Post body cannot be empty");
        if (body.length > 150)
          throw new Error("Post is too long");
        const insertQuery = await query(
          "INSERT INTO db.posts (body, author) VALUES (?, ?)",
          [body, user.id]);
        const postId = insertQuery.insertId;
        if (categories) {
          if (!Array.isArray(categories)) 
            throw new Error("Categories must be an array of strings");
          categories.map(c => {
            if (typeof c !== "string")
              throw new Error("Categories must be an array of strings");
            return c.toLowerCase();
          })
          await query(
            "INSERT INTO db.categories (post, categoryname) VALUES ?",
            [categories.map(category => [postId, category])]);
        }
        const queryResult = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts JOIN users ON posts.author = users.id WHERE posts.id = ?", [postId]);
        const categoryResult = await query("SELECT posts.*, GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',') FROM posts JOIN categories ON posts.id = categories.post GROUP BY posts.id");
        categoryResult.map(post => {
          post.categories = post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"].split(",");
          delete post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"];
          queryResult[queryResult.findIndex(p => p.id === post.id)] = post;
        })
        queryResult.map(post => {
          post.categories = post.categories ? post.categories : []
        });
        res.status(201).send({
          message: "Post created",
          success: true,
          post: queryResult[0],
        })
      } catch (e) {
        logger.error("Error in POST /posts: ", e);
        if (e.message === "Invalid token") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "Post body cannot be empty" || e.message === "Post is too long" || e.message === "Categories must be an array of strings") {
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

  //GET /posts (get all posts)
  app.get("/posts",
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
        const { categories } = req.query;
        if (typeof categories === "string" && !categories) {
          throw new Error("Categories must be strings");
        }
        const queryResult = await query(
          "SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts JOIN users ON posts.author = users.id ORDER BY timestamp DESC");
        const categoryResult = await query("SELECT posts.*, GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',') FROM posts JOIN categories ON posts.id = categories.post GROUP BY posts.id");

        const likesResult = await query("SELECT post FROM likes WHERE user = ?", [authenticated]);
        const likes = likesResult.map(like => like.post);

        let postsWithLikes = queryResult;
        if (authenticated) {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = likes.includes(post.id);
            return post;
          })
        }
        else {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = false;
            return post;
          })
        }
        categoryResult.map(post => {
          postsWithLikes[postsWithLikes.findIndex(p => p.id === post.id)].categories = post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"].split(",");
        })
        postsWithLikes.map(post => {
          post.categories = post.categories ? post.categories : []
        });
        let filterResults = postsWithLikes;
        if (categories) {
          const catArray = categories.split(",").map(c => c.toLowerCase());
          const validCategories = catArray.map((category) => {
            if (typeof category !== "string") {
              throw new Error("Categories must be strings");
            }
            return category;
          });

          filterResults = postsWithLikes.filter(post => post.categories.some(cat => validCategories.includes(cat)));
        }
        res.status(200).send({
          message: "Posts fetched",
          success: true,
          posts: filterResults,
        })
      } catch (e) {
        logger.error("Error in GET /posts: ", e);
        if (e.message === "Categories must be strings") {
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

  //GET /posts/:id (get post by id)
  app.get("/posts/:id",
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
        const { id } = req.params;
        const queryResult = await query(
          "SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts JOIN users ON posts.author = users.id WHERE posts.id = ?",
          [id]);
        const categoryResult = await query("SELECT posts.*, GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',') FROM posts JOIN categories ON posts.id = categories.post GROUP BY posts.id");
        categoryResult.map(post => {
          post.categories = post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"].split(",");
          delete post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"];
          queryResult[queryResult.findIndex(p => p.id === post.id)] = post;
        })

        const likesResult = await query("SELECT post FROM likes WHERE user = ?", [authenticated]);
        const likes = likesResult.map(like => like.post);

        let postsWithLikes = queryResult;
        if (authenticated) {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = likes.includes(post.id);
            return post;
          })
        }
        else {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = false;
            return post;
          })
        }
        postsWithLikes.map(post => {
          post.categories = post.categories ? post.categories : []
        });
        if (queryResult.length === 0)
          throw new Error("Post not found");
        res.status(200).send({
          message: "Post fetched",
          success: true,
          post: postsWithLikes[0],
        })
      } catch (e) {
        logger.error("Error in GET /posts/:id: ", e);
        if (e.message === "Post not found") {
          res.status(404).send({
            message: "Post not found",
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

  //GET /users/:id/posts (get posts by user id)
  app.get("/users/:id/posts",
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
        const { id } = req.params;
        const userQuery = await query("SELECT * FROM users WHERE id = ?", [id]);
        if (userQuery.length === 0)
          throw new Error("User not found");
        const queryResult = await query(
          "SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts JOIN users ON posts.author = users.id WHERE author = ? ORDER BY timestamp DESC",
          [id]);
        const categoryResult = await query("SELECT posts.*, GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',') FROM posts JOIN categories ON posts.id = categories.post GROUP BY posts.id");
        categoryResult.map(post => {
          post.categories = post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"].split(",");
          delete post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"];
          queryResult[queryResult.findIndex(p => p.id === post.id)] = post;
        })
        const likesResult = await query("SELECT post FROM likes WHERE user = ?", [authenticated]);
        const likes = likesResult.map(like => like.post);

        let postsWithLikes = queryResult;
        if (authenticated) {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = likes.includes(post.id);
            return post;
          })
        } else {
          postsWithLikes = postsWithLikes.map(post => {
            post.liked = false;
            return post;
          })
        }
        postsWithLikes.map(post => {
          post.categories = post.categories ? post.categories : []
        });
        res.status(200).send({
          message: "Posts fetched",
          success: true,
          posts: postsWithLikes,
        })
      } catch (e) {
        logger.error("Error in GET /users/:id/posts: ", e);
        if (e.message === "User not found") {
          res.status(404).send({
            message: "User not found",
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

  //PUT /posts/:id (edit post)
  app.put("/posts/:id",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { id } = req.params;
        const { body } = req.body;

        if (body.length > 150)
          throw new Error("Post is too long");
        const findPostQuery = await query("SELECT * FROM db.posts WHERE id = ?", [id]);
        if (findPostQuery.length === 0)
          throw new Error("Post not found");
        if (findPostQuery[0].author !== user.id)
          throw new Error("Unauthorized");
        await query("UPDATE db.posts SET body = ?, edited = 1 WHERE id = ?", [body, id]);
        const queryResult = await query("SELECT posts.*, users.username AS authorname, users.displayname AS authordisplayname, (SELECT COUNT(*) FROM likes WHERE post = posts.id) AS likes FROM posts JOIN users ON posts.author = users.id WHERE posts.id = ?", [id]);
        const categoryResult = await query("SELECT posts.*, GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',') FROM posts JOIN categories ON posts.id = categories.post GROUP BY posts.id");
        categoryResult.map(post => {
          post.categories = post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"].split(",");
          delete post["GROUP_CONCAT(DISTINCT categoryname SEPARATOR ',')"];
          queryResult[queryResult.findIndex(p => p.id === post.id)] = post;
        })
        queryResult.map(post => {
          post.categories = post.categories ? post.categories : []
        });
        res.status(200).send({
          message: "Post edited",
          success: true,
          post: queryResult[0],
        })
      } catch (e) {
        logger.error("Error in PUT /posts/:id: ", e);
        if (e === "Invalid token" || e.message === "Unauthorized") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "Post is too long") {
          res.status(400).send({
            message: "Post is too long",
            success: false,
          })
        } else if (e.message === "Post not found") {
          res.status(404).send({
            message: "Post not found",
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

  //DELETE /posts/:id (delete post)
  app.delete("/posts/:id",
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    async (req, res) => {
      try {
        const user = await jwt.verifyToken(req);
        const { id } = req.params;
        const queryResult = await query("SELECT posts.* FROM db.posts WHERE id = ?", [id]);
        if (queryResult.length === 0)
          throw new Error("Post not found");
        if (queryResult[0].author !== user.id)
          throw new Error("Unauthorized");
        await query("DELETE FROM db.posts WHERE id = ?", [id]);
        res.status(204).send();
      } catch (e) {
        logger.error("Error in DELETE /posts/:id: ", e);
        if (e.message === "Post not found") {
          res.status(404).send({
            message: "Post not found",
            success: false,
          })
        } else if (e.message === "Invalid token") {
          res.status(401).send({
            message: "Unauthorized",
            success: false,
          })
        } else if (e.message === "Unauthorized") {
          res.status(403).send({
            message: "You can't delete other people's posts",
            success: false,
          })
        }
        else
          res.status(500).send({
            message: "Something went wrong",
            reason: e.message,
            success: false,
          })
      }
    }
  )
}