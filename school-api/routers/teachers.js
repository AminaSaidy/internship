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
            let teachersAmount = parseInt(countTeachers.rows[0].count);
            let pagesAmount = Math.ceil(teachersAmount/pageSize);

            if(page > pagesAmount) {
                return res.status(404).json({message: "Page not found"});
            }

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

    router.get("/:id/classes", async (req, res) => {
        let teacherId = parseInt(req.params.id);

        if (isNaN(teacherId)) {
            return res.status(400).json("Invalid teacher id");
        }

        try {
            let result = await pool.query(
                `SELECT c.id, c.name, c.school_id, c.year 
                FROM classes c JOINT class_teachers ct ON c.id = ct.class_id 
                WHERE ct.teacher_id = $1`,
                [teacherId]
            );

            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });

    router.post("/", async (req, res) => {
        const {class_id, teacher_id} = req.body;

        try {
            let classCheck = await pool.query("SELECT id FROM classes WHERE id = $1", [class_id]);
            let teacherCheck = await pool.query("SELECT id FROM teachers WHERE id = $1", [teacher_id]);

            if(classCheck.rows.length === 0 || teacherCheck.rows.length === 0 ) {
                return res.status(400).json({message: "Class or teacher does not exist."}); 
            }

            let result = await pool.query(
                `INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2) RETURNING *`,
                [class_id, teacher_id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });
    return router;
}