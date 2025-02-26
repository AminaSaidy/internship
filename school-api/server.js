require('dotenv').config({ path: __dirname + '/.env' });

const {Pool} = require('pg');
const express = require('express');
const app = express();
const port = 3000;
const pageSize = 5;

app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

const classesRouter = require("./routers/classes")(pool);
const studentsRouter = require("./routers/students")(pool);
const teachersRouter = require("./routers/teachers")(pool);
const subjectRouter = reuire("./routers/subjects")(pool);
app.use("/api/classes", classesRouter);
app.use("/api/students", studentsRouter);
app.use("/api/teachers", teachersRouter);
app.use("/api/subjects", subjectsRouter);

class School {
    constructor(number, name, classesAmount, teachersAmount, status){
        this.number = number;
        this.name = name;
        this.classesAmount = classesAmount;
        this.teachersAmount = teachersAmount;
        this.status = status;
    }
}

app.get('/api/school', async (req, res) => {
    //получаем номер страницы. по умолчанию 1, а если превышает колво страниц - 404 ошибка
    let page = parseInt(req.query.page) || 1;
    if(page < 1) page = 1;
    
    try {
        let countSchools = await pool.query("SELECT COUNT(*) FROM schools");
        let schoolsAmount = parseInt(countSchools.rows[0].count);
        let pagesAmount = Math.ceil(schoolsAmount/pageSize);

        if(page > pagesAmount) {
            return res.status(404).json({message: "Page not found"});
        }

        //индексы школ, которые будут выведены на конкретной странице
        let startIndex = (page - 1) * pageSize;
        let result = await pool.query("SELECT * FROM schools ORDER BY id LIMIT $1 OFFSET $2",
            [pageSize, startIndex]
        );

        res.json({
            schools: result.rows,
            currentPage: page,
            schoolsAmount,
            pagesAmount
        });
    } catch (error) {
    console.error(error);
    res.status(500).json({message: "Internal error"});
}
});

app.get("/school/:id", async (req, res) => {
    let schoolId = parseInt(req.params.id);

    if (isNaN(schoolId)) {
        return res.status(400).json({message: "Invalid school ID"});
    }

    try {
        let result = await pool.query(
            "SELECT * FROM schools WHERE id = $1", 
            [schoolId]
        );

        if(result.rows.length === 0) {
            return res.status(404).json({message: "School was not found"});
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Database error"});
    }
});

app.post("/school", async (req, res) => {
    const {number, name, classesAmount, teachersAmount, status} = req.body;

    if(!number || !name || !classesAmount || !teachersAmount || status === undefined) {
        return res.status(400).json({message:"Some required fields are empty."});
    }

    try {
        let result = await pool.query(
            "INSERT INTO schools (number, name, classes_amount, teachers_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [number, name, classesAmount, teachersAmount, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error occured."});
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));