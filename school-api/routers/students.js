const express = require ('express');
const router = express.Router();

module.exports = (pool) => {
    router.post("/", async(req, res) => {
        const {name, birth_date, gender, class_id, enrolled_at} = req.body;

        if(!name || !birth_date || !gender || !class_id || !enrolled_at) {
            return res.status(400).json({message: "Some required fields are empty"});
        }

        try {
            let classCheck = await pool.query(
                "SELECT id FROM classes WHERE id = $1",
                [class_id]
            );

            if (classCheck.rows.length === 0) {
                return res.status(400).json({message: "Class does not exist."});
            }

            let result = await pool.query(
                "INSERT INTO students (name, birth_date, gender, class_id, enrolled_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [name, birth_date, gender, class_id, enrolled_at]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error."});
        }
    });

    router.get("/", async(req, res) => {

    });

    router.get("/:id", async(req, res) => {

    });
    return router;
}