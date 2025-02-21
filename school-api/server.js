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

app.get('/', (req, res) => {
    res.send("Hi");
});

app.listen(port, () => console.log(`Listening on port ${port}`));