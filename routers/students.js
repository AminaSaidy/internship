// const express = require('express');
// const router = express.Router();

// module.exports = (pool) => {
    // router.post("/", async(req, res) => {
    //     const {name, birth_date, gender, class_id, enrolled_at} = req.body;

    //     if(!name || !birth_date || !gender || !class_id || !enrolled_at) {
    //         return res.status(400).json({message: "Some required fields are empty"});
    //     }

    //     try {
    //         let classCheck = await pool.query(
    //             "SELECT id FROM classes WHERE id = $1",
    //             [class_id]
    //         );

    //         if (classCheck.rows.length === 0) {
    //             return res.status(400).json({message: "Class does not exist."});
    //         }

    //         let result = await pool.query(
    //             "INSERT INTO students (name, birth_date, gender, class_id, enrolled_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    //             [name, birth_date, gender, class_id, enrolled_at]
    //         );
    //         res.status(201).json(result.rows[0]);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({message: "Internal error."});
    //     }
    // });

//     router.get("/", async(req, res) => {
//         let page = parseInt(req.query.page);
//         if (isNaN(page) || page < 1) page = 1;
//         let pageSize = 5;
//         let offset = (page - 1) * pageSize;

//         try {
//             let result = await pool.query(
//                 "SELECT * FROM students ORDER BY id LIMIT $1 OFFSET $2", 
//                 [pageSize, offset]
//             );

//             let countStudents = await pool.query("SELECT COUNT(*) FROM students");
//             let studentsAmount = parseInt(countStudents.rows[0].count);
//             let pagesAmount = Math.ceil(studentsAmount/pageSize);

//             if(page > pagesAmount) {
//                 return res.status(404).json({message: "Page not found"});
//             }
            
//             res.json({
//                 students: result.rows,
//                 currentPage: page,
//                 studentsAmount,
//                 pagesAmount
//             });
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error occured."});
//         }
//     });

//     router.get("/:id", async(req, res) => {
//         let studentId = parseInt(req.params.id);

//         if (isNaN(studentId)) {
//             return res.status(400).json({message: "Invalid student id."});
//         }

//         try {
//             let result = await pool.query(
//                 "SELECT * FROM students WHERE id = $1",
//                 [studentId]
//             );

//             if(result.rows.length === 0) {
//                 return res.status(400).json({message: "Student was not found."});
//             }

//             res.json(result.rows[0]);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({message: "Internal error occured."});
//         }
//     });
//     return router;
// }