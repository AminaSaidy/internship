let arr = [1, -2, 3, 0, -1, 6, 10, -8];
console.log("Исходный массив: ", arr);

let positiveArr = arr.filter(nums => nums > 0);
console.log("Позитивный массив: ", positiveArr);

let squaredArr = arr.map(nums => nums ** 2);
console.log("Массив в квадрате: ", squaredArr);

let sum = arr.reduce((acc, num) => acc + num, 0);
console.log("Сумма всех элементов: ", sum);