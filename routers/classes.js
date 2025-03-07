// const express = require('express');
// const router = express.Router();

// module.exports = (pool) => {
//     router.post("/", async (req, res) => {
//         const {name, school_id, year} = req.body;

//         if(!name || !school_id || !year) {
//             return res.status(400).json({message: "Some required fields are empty."});
//         }

//         try {
//             let schoolCheck = await pool.query(
//                 "SELECT id FROM schools WHERE id = $1", 
//                 [school_id]
//             );

//             if(schoolCheck.rows.length === 0) {
//                 return res.status(400).json({message: "School does not exist."}); 
//             }

//             let result = await pool.query(
//                 "INSERT INTO classes (name, school_id, year) VALUES ($1, $2, $3) RETURNING *",
//                 [name, school_id, year]
//             );
//             res.status(201).json(result.rows[0]);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Error occured."});
//         }
//     }); 

//     router.get("/", async (req, res) => {
//         let page = parseInt(req.query.page);
//         if(isNaN(page) || page < 1) page = 1;
//         let pageSize = 5;
//         let offset = (page - 1) * pageSize;

//         try {
//             let countClasses = await pool.query("SELECT COUNT(*) FROM classes");
//             let classesAmount = parseInt(countClasses.rows[0].count);
//             let pagesAmount = Math.ceil(classesAmount/pageSize);

//             if(page > pagesAmount) {
//                 return res.status(404).json({message: "Page not found"});
//             }
            
//             let result = await pool.query("SELECT * FROM classes ORDER BY id LIMIT $1 OFFSET $2",
//                 [pageSize, offset]
//             );

//             res.json({
//                 classes: result.rows,
//                 currentPage: page,
//                 classesAmount,
//                 pagesAmount
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error occured."});
//         }
//     });

//     router.get("/:id", async (req, res) => {
//         let classId = parseInt(req.params.id);

//         if(isNaN(classId)) {
//             return res.status(400).json({message: "Invalid class id."});
//         }

//         try{
//             let result = await pool.query(
//                 "SELECT * FROM classes WHERE id = $1",
//                 [classId]
//             );

//             if (result.rows.length === 0) {
//                 res.status(400).json({message: "Class was not found."});
//             }

//             res.json(result.rows[0]);
//         } catch(error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error."});
//         }
//     });

//     router.get("/:id/teachers", async (req, res) => {
//         let classId = parseInt(req.params.id);

//         if (isNaN(classId)) {
//             return res.status(400).json("Invalid class id");
//         }

//         try {
//             let result = await pool.query(
//                 `SELECT t.id, t.name, t.birth_date, t.phone, t.email, t.hired_at 
//                 FROM teachers t JOIN class_teachers ct ON t.id = ct.teacher_id 
//                 WHERE ct.class_id = $1`,
//                 [classId]
//             );

//             res.json(result.rows);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error occured"});
//         }
//     });

//     router.get("/:id/subjects", async (req, res) => {
//         let classId = parseInt(req.params.id);

//         if (isNaN(classId)) {
//             return res.status(400).json("Invalid class id");
//         }

//         try {
//             let result = await pool.query(
//                 `SELECT s.id, s.name, s.description
//                 FROM subjects s JOIN class_subjects cs ON s.id = cs.subject_id 
//                 WHERE cs.class_id = $1`,
//                 [classId]
//             );

//             res.json(result.rows);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error occured"});
//         }
//     });
//     return router;
// }