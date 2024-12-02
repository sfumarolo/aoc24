const fs = require('fs');

function parseInput(input) {
    const list1 = [], list2 = [];
    const lines = input.split('\n');
    lines.forEach(line => {
        if (line.trim() !== '') { // Filter out blank lines
            const parts = line.split(/\s+/);
            list1.push(parseInt(parts[0], 10));
            list2.push(parseInt(parts[1], 10));
        }
    });
    return { list1, list2 };
}

function part1(input) {
    console.log("Running Part 1");
    const { list1, list2 } = parseInput(input);
    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let diffSum = 0;
    for (let i = 0; i < list1.length; i++) {
        diffSum += Math.abs(list1[i] - list2[i]);
    }
    console.log(diffSum);
}

function part2(input) {
    console.log("Running Part 2");
    const { list1, list2 } = parseInput(input);
    
    var simScore = 0;
    for (let i = 0; i < list1.length; i++) {
        const countList2Instances = list2.filter(x => x === list1[i]).length;
        simScore += list1[i] * countList2Instances;
    }
    console.log(simScore);
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