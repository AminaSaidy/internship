const express = require('express');
const app = express();
const port = 3000;
const pageSize = 5;

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
    let pagesAmount = Math.ceil(listOfSchools/pageSize);

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

app.listen(port, () => console.log(`Listening on port ${port}`));