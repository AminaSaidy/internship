const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.post("/", async (req, res) => {
        const {name, birth_date, phone, email, hired_at} = req.body;
        
        if (!name || !birth_date || !phone || !email || !hired_at) {
            return res.status(400).json({message: "Some required fields are empty."});
        }

        try {
            let result = await pool.query(
                "INSERT INTO teachers (name, birth_date, phone, email, hired_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [name, birth_date, phone, email, hired_at] 
            );
            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });

    router.get("/", async (req, res) => {
        let page = parseInt(req.query.page);
        if(isNaN(page) || page < 1) page =1;
        let pageSize = 5;
        let offset = (page - 1) * pageSize;

        try {
            let result = await pool.query(
                "SELECT * FROM teachers ORDER BY id LIMIT $1 OFFSET $2",
                [pageSize, offset]
            );

            let countTeachers = await pool.query("SELECT COUNT(*) FROM teachers");
            let teachersAmount = parseInt(countTeachers.rows.length);
            let pagesAmount = Math.ceil(teachersAmount/pageSize);

            res.json({
                teachers: result.rows,
                currentPage: page,
                teachersAmount,
                pagesAmount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });

    router.get("/:id", async (req, res) => {
        let teacherId = parseInt(req.params.id);
         
        if (isNaN(teacherId)) {
            return res.status(400).json("Invalid teacher id");
        }

        try {
            let result = await pool.query(
                "SELECT * FROM teachers WHERE id = $1",
                [teacherId]
            );

            if (result.rows.length === 0) {
                return res.status(400).json("Teacher was not found");
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });
    return router;
}