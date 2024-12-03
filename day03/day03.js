const fs = require('fs');

function extractSubstrings(input, regex) {
    const matches = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        matches.push(match[0]);
    }
    return matches;
}

function mul(mulString) {
    const parts = mulString.match(/[0-9]+/g);
    return parseInt(parts[0]) * parseInt(parts[1]);
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const mulSubstrings = extractSubstrings(input, /mul\([0-9]+,[0-9]+\)/g);

    var runningSum = 0;
    mulSubstrings.forEach(mulSubstring => {
        runningSum += mul(mulSubstring);
    });
    console.log(runningSum);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const mulSubstrings = extractSubstrings(input, /(mul\([0-9]+,[0-9]+\))|do\(\)|don't\(\)/g);
    console.log(mulSubstrings);
    var runningSum = 0;
    var doFlag = true;
    mulSubstrings.forEach(mulSubstring => {
        if (mulSubstring === "do()") {
            doFlag = true;
            console.log("doFlag set to true");
            return;
        } else if (mulSubstring === "don't()") {
            doFlag = false;
            console.log("doFlag set to false");
            return;
        } else if (doFlag) {
            console.log("Adding " + mulSubstring);
            runningSum += mul(mulSubstring);
        } else {
            console.log("Skipping " + mulSubstring);
        }
    });
    console.log(runningSum);
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