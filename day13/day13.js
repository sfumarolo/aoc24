const fs = require('fs');
const { exit } = require('process');

const groups = [];

function getNumVals(line) {
    return line.match(/\d+/g).map(Number);
}

function parseInput(input) {
    const lines = input.trim().split('\n');
    let thisGroup = {};
    for (let line of lines) {
        if (line !== '') {
            if ( line.startsWith('Button A')) {
                thisGroup['Button A'] = getNumVals(line);
            } else if (line.startsWith('Button B')) {
                thisGroup['Button B'] = getNumVals(line);
            } else if (line.startsWith("Prize")) {
                thisGroup['Prize'] = getNumVals(line);
                groups.push(thisGroup);
                thisGroup = {};
            } else {
                console.error("Invalid line:", line);
                exit(1);
            }
        }
    }
}

function solveSystem(a1, b1, c1, a2, b2, c2) {
    const determinant = a1 * b2 - a2 * b1;
    if (determinant === 0) {
        return null; // No unique solution
    }
    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    if (Number.isInteger(x) && Number.isInteger(y)) {
        return { x, y };
    } else {
        return null; // Only return if both x and y are integers
    }
}

function theGuts(input, augmentPrize) {
    let runningCost = 0;
    parseInput(input);

    if (augmentPrize) {
        for (let group of groups) {
            group['Prize'][0] += 10000000000000;
            group['Prize'][1] += 10000000000000;
        }
    }

    console.log(groups);

    for (let group of groups) {
        console.log("System of equations...");
        console.log(`${group['Button A'][0]}x + ${group['Button B'][0]}y = ${group['Prize'][0]}`);
        console.log(`${group['Button A'][1]}x + ${group['Button B'][1]}y = ${group['Prize'][1]}`);

        const solution = solveSystem(
            group['Button A'][0], group['Button B'][0], group['Prize'][0],
            group['Button A'][1], group['Button B'][1], group['Prize'][1]
        );
        if (solution) {
            console.log(`Solution: x = ${solution.x}, y = ${solution.y}`);
            runningCost += 3 * solution.x + solution.y;
        } else {
            console.log("No unique solution exists for this system of equations.");
        }
    }

    console.log(runningCost);
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    theGuts(input, false);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    theGuts(input, true);
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