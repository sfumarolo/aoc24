const fs = require('fs');

function buildIndex(input) {
    const index = {};

    const lines = input.split('\n');
    for (var row = 0; row < lines.length; row++) {
        for (var col = 0; col < lines[row].length; col++) {
            const nodeId = lines[row][col];
            if (nodeId != '.') {
                if (index[nodeId] == null) {
                    index[nodeId] = [];
                }

                index[nodeId].push([row, col]);
            }
        }
    }

    return [index, lines.length, lines[0].length];
}

function nodeLocationValid(node, height, width) {
    return node[0] >= 0 && node[0] < height && node[1] >= 0 && node[1] < width;
}

function addAntinode(antinodes, node, height, width) {
    if (nodeLocationValid(node, height, width)) {
        antinodes.filter(n => n[0] == node[0] && n[1] == node[1]).length > 0 ? null : antinodes.push(node);
    }
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const [index, height, width] = buildIndex(input);

    const antinodes = [];
    for (const nodeId in index) {
        console.log(nodeId);
        for (var firstIndex = 0; firstIndex < index[nodeId].length - 1; firstIndex++) {
            for (var secondIndex = firstIndex + 1; secondIndex < index[nodeId].length; secondIndex++) {
                const first = index[nodeId][firstIndex];
                const second = index[nodeId][secondIndex];
                const rowDiff = second[0] - first[0];
                const colDiff = second[1] - first[1];
                addAntinode(antinodes, [first[0] - rowDiff, first[1] - colDiff], height, width);
                addAntinode(antinodes, [second[0] + rowDiff, second[1] + colDiff], height, width);
            }
        }
    }
    console.log(antinodes.length);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const [index, height, width] = buildIndex(input);

    const antinodes = [];
    for (const nodeId in index) {
        console.log(nodeId);
        for (var firstIndex = 0; firstIndex < index[nodeId].length - 1; firstIndex++) {
            for (var secondIndex = firstIndex + 1; secondIndex < index[nodeId].length; secondIndex++) {
                const first = index[nodeId][firstIndex];
                const second = index[nodeId][secondIndex];
                const rowDiff = second[0] - first[0];
                const colDiff = second[1] - first[1];
                var keepGoing = true;
                for (var multiplier = 0; keepGoing; multiplier++) {
                    const antinode = [first[0] - (rowDiff * multiplier), first[1] - (colDiff * multiplier)];
                    if (!nodeLocationValid(antinode, height, width)) {
                        keepGoing = false;
                    } else {
                        addAntinode(antinodes, antinode, height, width);
                    }
                }

                keepGoing = true;
                for (var multiplier = 0; keepGoing; multiplier++) {
                    const antinode = [second[0] + (rowDiff * multiplier), second[1] + (colDiff * multiplier)];
                    if (!nodeLocationValid(antinode, height, width)) {
                        keepGoing = false;
                    } else {
                        addAntinode(antinodes, antinode, height, width);
                    }
                }
            }
        }
    }
    console.log(antinodes.length);
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