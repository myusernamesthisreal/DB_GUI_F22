const pool = require("../db");
const { promisify } = require("util");
const jwt = require("../jwt");

module.exports = function routes(app, logger) {
    const query = promisify(pool.query).bind(pool);

    // GET /categories (get all categories)
    app.get("/categories",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const queryResult = await query("SELECT categoryname AS name, COUNT(*) AS num_posts FROM categories GROUP BY categoryname ORDER BY num_posts DESC");
                res.status(200).send({
                    success: true,
                    categories: queryResult.map((row) => {
                        return {
                            name: row.name,
                            num_posts: row.num_posts
                        }
                    }),
                })
            } catch (e) {
                logger.error("Error in GET /categories: ", e);
                res.status(500).send({
                    message: "Something went wrong",
                    reason: e.message,
                    success: false,
                })
            }
        });

    // PATCH /posts/:id/categories (modify categories on post)
    app.patch("/posts/:id/categories",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const user = await jwt.verifyToken(req);
                const { id } = req.params;
                const { categories } = req.body;
                if (!categories) {
                    throw new Error("No categories provided");
                }
                if (!Array.isArray(categories)) {
                    throw new Error("Categories must be an array");
                }
                const validatedCategories = categories.map((category) => {
                    if (typeof category !== "string") {
                        throw new Error("Categories must be strings");
                    }
                    return category.toLowerCase();
                });
                const queryResult = await query("SELECT author FROM db.posts WHERE id = ?", [id]);
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                else if (queryResult[0].author !== user.id) {
                    throw new Error("Forbidden");
                }
                else {
                    const currentCategories = await query("SELECT categoryname FROM db.categories WHERE post = ?", [id]);
                    const currentCategoriesArray = currentCategories.map((category) => category.categoryname);
                    const categoriesToAdd = validatedCategories.filter((category) => !currentCategoriesArray.includes(category));
                    const categoriesToRemove = currentCategoriesArray.filter((category) => validatedCategories.includes(category));
                    logger.info("Categories to add: ", { message: categoriesToAdd });
                    logger.info("Categories to remove: ", { message: categoriesToRemove });
                    if (categoriesToAdd.length) await query("INSERT INTO db.categories (post, categoryname) VALUES ?",
                        [categoriesToAdd.map((category) => [id, category])]);
                    if (categoriesToRemove.length) await query("DELETE FROM db.categories WHERE post = ? AND categoryname IN (?)",
                        [id, categoriesToRemove]);
                    const newCategories = await query("SELECT categoryname FROM db.categories WHERE post = ?", [id]);
                    res.status(200).send({
                        success: true,
                        message: "Categories updated",
                        categories: newCategories.map((category) => category.categoryname),
                    });

                }
            } catch (e) {
                logger.error("Error in PATCH /posts/:id/categories: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    });
                }
                else if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    });
                }
                else if (e.message === "Forbidden") {
                    res.status(403).send({
                        message: "Forbidden",
                        success: false,
                    });
                } else if (e.message === "No categories provided" || e.message === "Categories must be an array" || e.message === "Categories must be strings") {
                    res.status(400).send({
                        message: e.message,
                        success: false,
                    });
                } else {
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e.message,
                        success: false,
                    })
                }
            }
        });

    //PUT /posts/:id/categories (modify categories on post)
    app.put("/posts/:id/categories",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const { id } = req.params;
                const user = await jwt.verifyToken(req);
                const { categories } = req.body;
                if (!categories) {
                    throw new Error("No categories provided");
                }
                if (!Array.isArray(categories)) {
                    throw new Error("Categories must be an array");
                }
                const validatedCategories = categories.map((category) => {
                    if (typeof category !== "string") {
                        throw new Error("Categories must be strings");
                    }
                    return category.toLowerCase();
                });
                const queryResult = await query("SELECT author FROM db.posts WHERE id = ?", [id]);
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                else if (queryResult[0].author !== user.id) {
                    throw new Error("Forbidden");
                }
                else {
                    await query("DELETE FROM db.categories WHERE post = ?", [id]);
                    await query("INSERT INTO db.categories (post, categoryname) VALUES ?",
                        [validatedCategories.map((category) => [id, category])]);
                    const newCategories = await query("SELECT categoryname FROM db.categories WHERE post = ?", [id]);
                    res.status(200).send({
                        success: true,
                        message: "Categories updated",
                        categories: newCategories.map((category) => category.categoryname),
                    });
                }
            } catch (e) {
                logger.error("Error in PATCH /posts/:id/categories: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    });
                } else if (e.message === "Forbidden") {
                    res.status(403).send({
                        message: "Forbidden",
                        success: false,
                    });
                }
                else if (e.message === "Invalid token") {
                    res.status(401).send({
                        message: "Unauthorized",
                        success: false,
                    });
                }
            }
        });

    // GET /posts/:id/categories (get categories on post)
    app.get("/posts/:id/categories",
        /**
         * @param {import('express').Request} req
         * @param {import('express').Response} res
         */
        async (req, res) => {
            try {
                const { id } = req.params;
                const queryResult = await query("SELECT categoryname FROM db.categories WHERE post = ?", [id]);
                if (queryResult.length === 0) {
                    throw new Error("Post not found");
                }
                res.status(200).send({
                    success: true,
                    categories: queryResult.map((category) => category.categoryname),
                })
            } catch (e) {
                logger.error("Error in GET /posts/:id/categories: ", e);
                if (e.message === "Post not found") {
                    res.status(404).send({
                        message: "Post not found",
                        success: false,
                    });
                } else {
                    res.status(500).send({
                        message: "Something went wrong",
                        reason: e.message,
                        success: false,
                    })
                }
            }
        });
}
