const fs = require('fs');

const robots = [];

function getNumVals(line) {
    return line.match(/\-?\d+/g).map(Number);
}

function parseInput(input) {
    const lines = input.trim().split('\n');
    for (let line of lines) {
        const thisRobot = {};
        const robotVals = getNumVals(line);
        thisRobot['pos'] = [robotVals[0], robotVals[1]];
        thisRobot['vel'] = [robotVals[2], robotVals[3]];
        robots.push(thisRobot);
    }    
}

function buildGrid(gridHeight, gridWidth) {
    const grid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(0));
    robots.forEach(robot => {
        grid[robot['pos'][1]][robot['pos'][0]] += 1;
    });
    return grid;
}

function drawGrid(gridHeight, gridWidth) {
    let grid = buildGrid(gridHeight, gridWidth);

    for (let row of grid) {
        for (let cell of row) {
            process.stdout.write(cell === 0 ? '.' : cell.toString());
        }
        console.log();
    }
}

function getQuadrantSafetyFactor(minRow, maxRow, minCol, maxCol) {
    let grid = buildGrid(gridHeight, gridWidth);
    let robotCount = 0;
    for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
            robotCount += grid[row][col];
        }
    }
    console.log(`Quadrant (${minRow}, ${maxRow}, ${minCol}, ${maxCol}) has ${robotCount} robots.`);
    return robotCount;
}

function getSafetyFactor(gridHeight, gridWidth) {
    return getQuadrantSafetyFactor(0, Math.floor(gridHeight / 2) - 1, 0, Math.floor(gridWidth / 2) - 1) *
        getQuadrantSafetyFactor(0, Math.floor(gridHeight / 2) - 1, Math.ceil(gridWidth / 2), gridWidth - 1) *
        getQuadrantSafetyFactor(Math.ceil(gridHeight / 2), gridHeight - 1, 0, Math.floor(gridWidth / 2) - 1) *
        getQuadrantSafetyFactor(Math.ceil(gridHeight / 2), gridHeight - 1, Math.floor(gridWidth / 2) + 1, gridWidth - 1);
}

function moveRobots(steps, gridHeight, gridWidth) {
    robots.forEach(robot => {
        robot['pos'][0] += steps * robot['vel'][0];
        robot['pos'][1] += steps * robot['vel'][1];
        robot['pos'][0] = robot['pos'][0] % gridWidth;
        robot['pos'][1] = robot['pos'][1] % gridHeight;

        robot['pos'][0] = robot['pos'][0] % gridWidth;
        if (robot['pos'][0] < 0) {
            robot['pos'][0] += gridWidth;
        }

        robot['pos'][1] = robot['pos'][1] % gridHeight;
        if (robot['pos'][1] < 0) {
            robot['pos'][1] += gridHeight;
        }
    });
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    parseInput(input);

    [gridHeight, gridWidth] = robots.length > 20 ? [103, 101] : [7, 11];
    drawGrid(gridHeight, gridWidth);
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    moveRobots(100, gridHeight, gridWidth);
    drawGrid(gridHeight, gridWidth);
    console.log(getSafetyFactor(gridHeight, gridWidth));
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    console.log(input);
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