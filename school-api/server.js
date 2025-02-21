const express = require('express');
const app = express();
const port = 3000;
const one_page_size = 5;

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
                Math.floor(Math,random() * 40) + 20,
                Math.random() < 0.5
            )
        );
    }
}

app.get('/', (req, res) => {
    res.send("Hi");
});

app.listen(port, () => console.log(`Listening on port ${port}`));