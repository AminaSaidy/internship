require('dotenv').config();

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

class School {
    constructor(number, name, classesAmount, teachersAmount, status){
        this.number = number;
        this.name = name;
        this.classesAmount = classesAmount;
        this.teachersAmount = teachersAmount;
        this.status = status;
    }
}

function generateSchool(amount) {
    let schools = [];
    for(let i = 0; i < amount; i++) {
        schools.push(
            new School(
                i, 
                `State School #${i}`,
                Math.floor(Math.random() * 30) + 10,
                Math.floor(Math.random() * 40) + 20,
                Math.random() < 0.5
            )
        );
    }
    return schools;
}

let listOfSchools = generateSchool(25);

app.get('/api/school', (req, res) => {
    //получаем номер страницы. по умолчанию 1, а если превышает колво страниц - 404 ошибка
    let page = parseInt(req.query.page) || 1;
    if(page < 1) page = 1;
    
    let schoolsAmount = listOfSchools.length;
    let pagesAmount = Math.ceil(schoolsAmount/pageSize);

    if(page > pagesAmount) {
        return res.status(404).json({message: "Page not found"});
    }

    //индексы школ, которые будут выведены на конкретной странице
    const startIndex = (page - 1) * pageSize;
    let paginatedListSchools = listOfSchools.slice(startIndex, startIndex + pageSize);

    res.json({
        schools: paginatedListSchools,
        currentPage: page,
        schoolsAmount: schoolsAmount,
        pagesAmount: pagesAmount
    });
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
        res.status(201).json({message: "School was added successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error occured."});
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));