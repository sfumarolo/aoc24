const fs = require('fs');

const grid = [];
const areas = {};

var countFullEdges = false;
const gridEntry = {char : null, region : null, topEdge : false, bottomEdge : false, leftEdge : false, rightEdge : false};


function readGrid(input) {
    const lines = input.trim().split('\n');
    for (const line of lines) {
        const row = [];
        for (const char of line) {
            let newGridEntry = {...gridEntry}
            newGridEntry.char = char;
            row.push(newGridEntry);
        }
        grid.push(row);
    }
}

function findEdges() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (row === 0 || (grid[row - 1][col].region !== grid[row][col].region)) {
                grid[row][col].topEdge = true;
                if (col === 0 || (grid[row][col - 1].region !== grid[row][col].region || !grid[row][col - 1].topEdge)) {
                    //console.log(grid[row][col]);
                    areas[grid[row][col]["region"]].uniqueEdges++;
                }
            }

            if (row === grid.length - 1 || (grid[row + 1][col].region !== grid[row][col].region)) {
                grid[row][col].bottomEdge = true;
                if (col === 0 || (grid[row][col - 1].region !== grid[row][col].region || !grid[row][col - 1].bottomEdge)) {
                    areas[grid[row][col]["region"]].uniqueEdges++;
                }

            }

            if (col === 0 || (grid[row][col - 1].region !== grid[row][col].region)) {
                grid[row][col].leftEdge = true;
                if (row === 0 || (grid[row - 1][col].region !== grid[row][col].region || !grid[row - 1][col].leftEdge)) {
                    areas[grid[row][col]["region"]].uniqueEdges++;
                }
            }

            if (col === grid[row].length - 1 || (grid[row][col + 1].region !== grid[row][col].region)) {
                grid[row][col].rightEdge = true;
                if (row === 0 || (grid[row - 1][col].region !== grid[row][col].region || !grid[row - 1][col].rightEdge)) {
                    areas[grid[row][col]["region"]].uniqueEdges++;
                }
            }
        }
    }
}

function floodFill(row, col, char, region) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
        return [ 0, 1 ];
    }

    if (grid[row][col].region === region) {
        // console.log(`Skipping ${row}, ${col} with ${char} and region ${region}`);
        return [ 0, 0 ];;
    }

    if (grid[row][col].region !== null) {
        // console.log(`Skipping ${row}, ${col} with ${char} and region ${region}`);
        return [ 0, 1 ];;
    }

    if (grid[row][col].char === char) {
        //let area = 1;
        // console.log(`Filling ${row}, ${col} with ${char} and region ${region}`);
        grid[row][col].region = region;
        const recursiveUp    = floodFill(row - 1, col, char, region);
        const recusiveRight  = floodFill(row + 1, col, char, region);
        const recursiveLeft  = floodFill(row, col - 1, char, region);
        const recursiveRight = floodFill(row, col + 1, char, region);
        //console.log(`Area is ${area}`);
        return [ 1 + recursiveUp[0] + recusiveRight[0] + recursiveLeft[0] + recursiveRight[0],
            recursiveUp[1] + recusiveRight[1] + recursiveLeft[1] + recursiveRight[1] ];
    }

    return [0, 1];
}

function labelRegions() {
    let region = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (!grid[row][col].region) {
                // console.log(region);
                const areaFilled = floodFill(row, col, grid[row][col].char, region);
                if (areaFilled[0] > 0) {
                    console.log(`Region ${region} for char ${grid[row][col].char} has area ${areaFilled}`);
                    areas[region] = {area : areaFilled[0], edges : areaFilled[1], uniqueEdges : 0};
                    region++;
                }
                //console.log(grid);
            }
        }
    }
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    console.log(input);
    readGrid(input);
    labelRegions();
    // console.log(grid);
    //console.log(areas);

    let price = 0;
    for (const region in areas) {
        price += areas[region]["area"] * areas[region]["edges"];
    }
    console.log(price);
}

function part2(input) {
    // Implement part 2 logic here
    countFullEdges = true;
    console.log(input);
    readGrid(input);
    labelRegions();
    findEdges();
    // console.log(grid);
    //console.log(areas);

    let price = 0;
    for (const region in areas) {
        price += areas[region]["area"] * areas[region]["uniqueEdges"];
    }
    console.log(price);
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