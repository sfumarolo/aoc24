const fs = require('fs');

const grid = [];
const instructions = [];
let botPos = null;
let instCount = 0;
let lastInstDrawn = 0;

function parseInput(input) {
    const lines = input.trim().split('\n');
    let row;
    for (row = 0; row < lines.length; row++) {
        if (lines[row] === '') {
            row++;
            break;
        }

        const gridRow = [];
        
        for (let col = 0; col < lines[row].length; col++) {
            let gridItem = { box : false, wall : false };
            const char = lines[row][col];
            if (char === "@") {
                botPos = {row : row, col : col};
            } else if (char === "#") {
                gridItem.wall = true;
            } else if (char === "O") {
                gridItem.box = true;
            }
            gridRow.push(gridItem);
        }
        grid.push(gridRow);
    }

    drawGrid();

    for (; row < lines.length; row++) {
        instructions.push(...lines[row].split(''));
    }
}

function stretchGrid() {
    for (let row = 0; row < grid.length; row++) {
        const newRow = [];
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].wall) {
                newRow.push({ box : null, wall : true }, { box: null, wall : true });
            } else if (grid[row][col].box) {
                newRow.push({ box : '[', wall : false }, { box : ']', wall : false });
            } else {
                newRow.push({ box : null, wall : false }, { box : null, wall : false });
            }
        }
        grid[row] = newRow;
    }

    botPos.col = botPos.col * 2;
}

function drawGrid() {
    for (let row = 0; row < grid.length; row++) {
        let rowStr = "";
        for (let col = 0; col < grid[row].length; col++) {
            if (botPos.row === row && botPos.col === col) {
                rowStr += "@";
            } else if (grid[row][col].box === '[') {
                rowStr += "[";
            } else if (grid[row][col].box === ']') {
                rowStr += "]";
            } else if (grid[row][col].box) {
                    rowStr += "O";
            } else if (grid[row][col].wall) {
                rowStr += "#";
            } else {
                rowStr += ".";
            }
        }
        console.log(rowStr);
    }
}

function getNextRow(row, inst) {
    switch(inst) {
        case "^":
            return row - 1;
        case "v":
            return row + 1;
        default:
            return row;
    }
}

function getNextCol(col, inst) {
    switch(inst) {
        case "<":
            return col - 1;
        case ">":
            return col + 1;
        default:
            return col;
    }
}

function isMoveValid(row, col, inst, viaBox) {
    if (grid[row][col].wall) {
        return false;
    } else if (grid[row][col].box) {
        const downstreamResult = isMoveValid(getNextRow(row, inst), getNextCol(col, inst), inst, true);
        if (downstreamResult) {
            if (viaBox) {
                grid[row][col].box = viaBox;
            } else {
                grid[row][col].box = false;
                botPos = {row, col};
            }
        }
        return downstreamResult;
    } else {
        if (viaBox) {
            grid[row][col].box = true;
        } else {
            botPos = {row, col};
        }
        return true;
    }

    console.error("Invalid move");
    exit(-1);
}

function scoreGrid() {
    let score = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col].box) {
                score+= row * 100 + col;
            }
        }
    }
    return score;
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    parseInput(input);
    //console.log(grid);
    for (let inst of instructions) {
        const newRow = getNextRow(botPos.row, inst);
        const newCol = getNextCol(botPos.col, inst);
        if (isMoveValid(newRow, newCol, inst, false)) {
            // console.log("Valid move");
        } else {
            // console.log("Invalid move");
        }
    }
    drawGrid();
    console.log(scoreGrid());
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    parseInput(input);
    stretchGrid();
    drawGrid();
    // LOGIC INCOMPLETE
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