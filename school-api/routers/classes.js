const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/", async (req, res) => {
    const {name, school_id, year} = req.body;

    if(!name || !school_id || !year) {
        return res.status(400).json({message: "Some required fields are empty."});
    }

    try {
        let schoolCheck = await pool.query(
            "SELECT if FROM schools WHERE id = $1", 
            [school_id]
        );

        if(schoolCheck.rows.length === 0) {
            return res.status(400).json({message: "School does not exist."}); 
        }
        
        let result = await pool.query(
            "INSERT INTO classes (name, school_id, year) VALUES ($1, $2, $3 RETURNING *)",
            [name, school_id, year]
        );
        res.status(201).json(result.rows(0));
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error occured."});
    }
}); 

router.get("/", async (req, res) => {

});

router.get("/:id", async (req, res) => {

});