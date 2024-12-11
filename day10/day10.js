const fs = require('fs');

function parseGrid(input) {
    const lines = input.trim().split('\n');

    const grid = [];
    for (const line of lines) {
        const gridLine = [];
        for (const char of line) {
            gridLine.push({value : parseInt(char), visited : false});
        }
        grid.push(gridLine);
    }

    return grid;
}

function canGetToNewNine(grid, row, col, nextValue) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
        return false;
    }

    const cell = grid[row][col];
    if (cell.visited || cell.value !== nextValue) {
        return false;
    }

    cell.visited = true;
    if (nextValue === 9 && cell.value === 9) {
        //console.log(`>>> Found 9 at ${row}, ${col}`);
        return true;
    } else if (cell.value === nextValue) {
        //console.log(`>> Found ${cell.value} at ${row}, ${col}, which is a ${nextValue}`);
        var foundANine = false;
        foundANine = canGetToNewNine(grid, row - 1, col, nextValue + 1) || foundANine;
        foundANine = canGetToNewNine(grid, row + 1, col, nextValue + 1) || foundANine;
        foundANine = canGetToNewNine(grid, row, col - 1, nextValue + 1) || foundANine;
        foundANine = canGetToNewNine(grid, row, col + 1, nextValue + 1) || foundANine;
        return foundANine;
    } else {
        //console.log(`>> Found ${cell.value} at ${row}, ${col}, which isn't a ${nextValue}`);
        return false;
    }

    return true;
}



function waysToANine(grid, row, col, nextValue) {
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[row].length) {
        return 0;
    }
    console.log(`Checking ${row}, ${col} for ${nextValue}`);

    const cell = grid[row][col];
    if (cell.value !== nextValue) {
        return 0;
    }

    cell.visited = true;
    if (nextValue === 9 && cell.value === 9) {
        console.log(`>>> Found 9 at ${row}, ${col}`);
        return 1;
    } else if (cell.value === nextValue) {
        console.log(`>> Found ${cell.value} at ${row}, ${col}, which is a ${nextValue}`);
        var foundPaths = 0;
        foundPaths += waysToANine(grid, row - 1, col, nextValue + 1);
        foundPaths += waysToANine(grid, row + 1, col, nextValue + 1);
        foundPaths += waysToANine(grid, row, col - 1, nextValue + 1);
        foundPaths += waysToANine(grid, row, col + 1, nextValue + 1);
        return foundPaths;
    } else {
        //console.log(`>> Found ${cell.value} at ${row}, ${col}, which isn't a ${nextValue}`);
        return 0;
    }
}

function navigateGrid(grid, row, col) {
    const gridIter = structuredClone(grid);
    let newNines = 0;
    canGetToNewNine(gridIter, row, col, 0);
    for (let row = 0; row < gridIter.length; row++) {
        for (let col = 0; col < gridIter[row].length; col++) {
            if (gridIter[row][col].visited && grid[row][col].value === 9) {
                newNines ++;
            }
            //newNines += canGetToNewNine(gridIter, row, col, 0);
        }
    }

    //console.log(`Found ${newNines} new nines when starting at ${row}, ${col}`);
    return newNines;
}

function navigateGridTwo(grid, row, col) {
    const gridIter = structuredClone(grid);
    let newNines = 0;
    return waysToANine(gridIter, row, col, 0);
    //canGetToNewNine(gridIter, row, col, 0);
    for (let row = 0; row < gridIter.length; row++) {
        for (let col = 0; col < gridIter[row].length; col++) {
            if (gridIter[row][col].visited && grid[row][col].value === 9) {
                let thisIterNines = waysToANine(gridIter, row, col, 0);
                console.log(`Found ${thisIterNines} ways to get to 9 from ${row}, ${col}`);
                newNines+= thisIterNines;
            }
            //newNines += canGetToNewNine(gridIter, row, col, 0);
        }
    }

    //console.log(`Found ${newNines} new nines when starting at ${row}, ${col}`);
    return newNines;
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    let aggregateScore = 0
    const grid = parseGrid(input);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].value === 0) {
                console.log(`Found 0 at ${row}, ${col}`);
                const score = navigateGrid(grid, row, col);
                aggregateScore += score;
            }
        }
    }
    console.log(aggregateScore);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    let aggregateScore = 0
    const grid = parseGrid(input);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].value === 0) {
                console.log(`Found 0 at ${row}, ${col}`);
                const score = navigateGridTwo(grid, row, col);
                aggregateScore += score;
            }
        }
    }
    console.log(aggregateScore);
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