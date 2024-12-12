const fs = require('fs');

const resultDict = {};

function runStoneRule(inputStone, iteration, maxIterations) {
    //console.log(`At depth ${iteration} with stone ${inputStone}`);
    if (iteration === maxIterations) {
        return 1;
    }

    if (resultDict[`${inputStone},${iteration}`]) {
        console.log(`Found ${inputStone} at depth ${iteration} in the cache (${resultDict[`${inputStone},${iteration}`]})`);
        return resultDict[`${inputStone},${iteration}`];
    } else {
        //console.log(`Did not find ${inputStone} at depth ${iteration} in the cache`);
    }

    var pendingResult;
    if (inputStone === 0) {
        //console.log(`Stone ${inputStone} is 0, replacing with a 1`);
         pendingResult = runStoneRule(1, iteration + 1, maxIterations);
    } else if (inputStone.toString().length % 2 === 0) {
        //console.log(`Splitting ${inputStone} into ${parseInt(inputStone.toString().slice(0, inputStone.toString().length / 2))} and ${parseInt(inputStone.toString().slice(inputStone.toString().length / 2))}`);
        pendingResult = runStoneRule(parseInt(inputStone.toString().slice(0, inputStone.toString().length / 2)), iteration + 1, maxIterations) +
            runStoneRule(parseInt(inputStone.toString().slice(inputStone.toString().length / 2)), iteration + 1, maxIterations);
    } else {
        //console.log(`Doubling ${inputStone} to ${inputStone * 2024}`);
        pendingResult = runStoneRule(inputStone * 2024, iteration + 1, maxIterations);
    }

    //console.log(`Caching ${inputStone} at depth ${iteration}`);
    resultDict[`${inputStone},${iteration}`] = pendingResult;
    return pendingResult;
}

function runPart1Rules(inputArray) {
    const newArray = [];
    let runningSum = 0;
    for (let i = 0; i < inputArray.length; i++) {
        const thisStone = inputArray[i];
        runningSumrunStoneRule(thisStone);
    }
    //console.log(newArray);
    return newArray;
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    let numbers = input.split(' ').map(Number);
    console.log(numbers);
    let stoneCount = 0;
    for (let i = 0; i < numbers.length; i++) {
        stoneCount += runStoneRule(numbers[i], 0, 25);
    }
    //console.log(resultDict)
    console.log(stoneCount)
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    let numbers = input.split(' ').map(Number);
    console.log(numbers);
    let stoneCount = 0;
    for (let i = 0; i < numbers.length; i++) {
        stoneCount += runStoneRule(numbers[i], 0, 75);
    }
    console.log(stoneCount)
}

function getInput(file) {
    try {
        return fs.readFileSync(file, 'utf8');
    } catch (err) {
        console.error(`Error reading file ${file}:`, err);
        process.exit(1);
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error("Usage: node day00.js <part1|part2> <input.txt|sample.txt>");
        process.exit(1);
    }

    const [part, file] = args;
    const input = getInput(file);

    if (part === 'part1') {
        part1(input);
    } else if (part === 'part2') {
        part2(input);
    } else {
        console.error("Invalid part argument. Use 'part1' or 'part2'.");
        process.exit(1);
    }
}

main();