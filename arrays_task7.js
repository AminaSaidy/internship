let languages = ['JavaScript', 'Python', 'C++', 'Java', 'Ruby'];

languages.splice(2, 1, 'C#', 'Go');
console.log("Массив после замещения С++: ", languages);

let cutElements = languages.splice(-2, 2);
console.log("Вырезанные 2 последних элемента: ", cutElements);