let nums = [8, 23, 15, 6, 0];

if (nums === 0) {
    console.log("Array is empty. Invalid input.");
} else {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }
    let avg = sum/nums.length;

    console.log("Sum of all numbers: ", sum);
    console.log("Average of all numbers: ", avg);
}