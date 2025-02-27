const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.post("/", async (req, res) => {
        const {name, description} = req.body;

        if (!name || !description) {
            return res.status(400).json({message: "Some required fields are empty."});
        }

        try {
            let result = await pool.query(
                "INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *",
                [name, description]
            );

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json("Internal error occured");
        }
    });

    router.get("/", async (req, res) => {
        let page = req.query.page;
        if (isNaN(page) || page < 1) page = 1;
        let pageSize = 5;
        let offset = (page - 1) * pageSize;

        try {
            let result = await pool.query(
                "SELECT * FROM subjects ORDER BY id LIMIT $1 OFFSET $2",
                [pageSize, offset]
            );

            let countSubjects = await pool.query ("SELECT COUNT (*) FROM subjects");
            let subjectsAmount = parseInt(countSubjects.rows[0].count);
            let pagesAmount = Math.ceil (subjectsAmount/pageSize);

            if(page > pagesAmount) {
                return res.status(404).json({message: "Page not found"});
            }

            res.json({
                subjects: result.rows,
                currentPage: page,
                subjectsAmount,
                pagesAmount
            });
        } catch (error) {
            res.status(500).json("Internal error occured");
        }
    });

    router.get("/:id", async (req, res) => {
        let subjectId = req.params.id;

        if (isNaN(subjectId)) {
            return res.status(400).json("Invalid subject id");
        }

        try {
            let result = await pool.query(
                "SELECT * FROM subjects WHERE id = $1",
                [subjectId]
            );

            if (result.rows.length === 0) {
                return res.status(400).json("Subject was not found");
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });

    router.get("/:id/classes", async (req, res) => {
        let subjectId = parseInt(req.params.id);

        if (isNaN(subjectId)) {
            return res.status(400).json("Invalid subject id");
        }

        try {
            let result = await pool.query(
                `SELECT c.id, c.name, c.school_id, c.year 
                FROM classes c JOIN class_subjects cs ON c.id = cs.class_id 
                WHERE cs.subject_id = $1`,
                [subjectId]
            );

            res.json(result.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });

    router.post("/classes", async (req, res) => {
        const {class_id, subject_id} = req.body;

        try {
            let classCheck = await pool.query("SELECT id FROM classes WHERE id = $1", [class_id]);
            let subjectCheck = await pool.query("SELECT id FROM subjects WHERE id = $1", [subject_id]);

            if(classCheck.rows.length === 0 || subjectCheck.rows.length === 0 ) {
                return res.status(400).json({message: "Class or subject does not exist."}); 
            }

            let result = await pool.query(
                `INSERT INTO class_subjects (class_id, subject_id) VALUES ($1, $2) RETURNING *`,
                [class_id, subject_id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal error occured"});
        }
    });
    return router;
}