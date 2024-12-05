const fs = require('fs');

function createGrid(input) {
    const grid = [];
    const lines = input.split('\n');
    lines.forEach(line => {
        grid.push(line.split(''));
    });
    //console.log(grid);
    return grid;
}

function isXmas(grid, row, col, hor, ver) {
    try {
        if (grid[row][col] === 'X') {
            if (grid[row + hor][col + ver] === 'M') {
                if (grid[row + 2 * hor][col + 2 * ver] === 'A') {
                    if (grid[row + 3 * hor][col + 3 * ver] === 'S') {
                        //console.log("Found XMAS at " + row + ", " + col + " with hor " + hor + " and ver " + ver);
                        return true;
                    }
                }
            }
        }
    } catch (error) {
        return false;
    }
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const grid = createGrid(input);

    var xmasCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            for (let hor = -1; hor <= 1; hor++) {
                for (let ver = -1; ver <= 1; ver++) {
                    if (hor === 0 && ver === 0) {
                        continue;
                    }
                    //console.log("Checking " + row + ", " + col + " with hor " + hor + " and ver " + ver);
                    xmasCount += isXmas(grid, row, col, hor, ver) ? 1 : 0;
                }
            }
        }
    }
    console.log(xmasCount);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const grid = createGrid(input);

    var xmasCount = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            try {
                if (grid[row][col] === 'A') {
                    if ((grid[row - 1][col - 1] ==='M' && grid[row + 1][col + 1] === 'S') || (grid[row - 1][col - 1] ==='S' && grid[row + 1][col + 1] === 'M')) {
                        if ((grid[row + 1][col - 1] ==='M' && grid[row - 1][col + 1] === 'S') || (grid[row + 1][col - 1] ==='S' && grid[row - 1][col + 1] === 'M')) {
                            xmasCount++;
                        }
                    }
                }
            } catch (error) {
                // Do Nothing
            }
        }
    }
    console.log(xmasCount);
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