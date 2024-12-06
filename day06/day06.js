const fs = require('fs');

const defaultVisitedState = { "^": false, ">": false, "v": false, "<": false };

function parseGrid(input, detailedVisited) {
    var grid = [];
    var pos;
    const lines = input.split('\n');
    for (var row = 0; row < lines.length; row++) {
        const line = lines[row];
        var gridLine = [];
        for (var col = 0; col < line.length; col++) {
            switch(line.charAt(col)) {
                case '.':
                    gridLine.push({obs: false, visited: detailedVisited ? {...defaultVisitedState} : false});
                    break;
                case '#':
                    gridLine.push({obs: true, visited: detailedVisited ? {...defaultVisitedState} : false});
                    break;
                case '^':
                    gridLine.push({obs: false, visited: detailedVisited ? {...defaultVisitedState} : false});
                    pos = {row: row, col: col, dir: '^'};
                    break;
            }
        }
        grid.push(gridLine);
        //console.log(grid);
    }
    return [grid, pos];
}

function countVisited(grid) {
    var visited = 0;
    for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[row].length; col++) {
            if(grid[row][col].visited) {
                visited++;
            }
        }
    }
    return visited;
}

function drawGrid(grid, startPos, tempObsRow, tempObsCol) {
    for (var row = 0; row < grid.length; row++) {
        var line = "";
        for (var col = 0; col < grid[row].length; col++) {
            if (row == tempObsRow && col == tempObsCol) {
                line += "O";
            } else if (grid[row][col].obs) {
                line += "#";
            } else if (row == startPos.row && col == startPos.col) {
                line += startPos.dir;
            } else if (row == tempObsRow && col == tempObsCol) {
                line += "O";
            } else if ((grid[row][col].visited['^'] || grid[row][col].visited['v']) && (grid[row][col].visited['<'] || grid[row][col].visited['>'])) {
                line += "+";
            } else if (grid[row][col].visited['^'] || grid[row][col].visited['v']) {
                line += "|";
            } else if (grid[row][col].visited['<'] || grid[row][col].visited['>']) {
                line += "-";
            } else {
                line += ".";
            }
        }
        console.log(line);
    }
}

function navigateGrid(grid, pos, loopDetection) {

    var shouldContinue = true;
    while (shouldContinue) {
        if (loopDetection) {
            grid[pos.row][pos.col].visited[pos.dir] = true
        } else {
            grid[pos.row][pos.col].visited = true;
        }
        //console.log(pos);
        var nextPos;
        switch(pos.dir) {
            case '^':
                nextPos = {row: pos.row - 1, col: pos.col, dir: '^'};
                break;
            case '>':
                nextPos = {row: pos.row, col: pos.col + 1, dir: '>'};
                break;
            case 'v':
                nextPos = {row: pos.row + 1, col: pos.col, dir: 'v'};
                break;
            case '<':
                nextPos = {row: pos.row, col: pos.col - 1, dir: '<'};
                break;
        }
        if (nextPos.row < 0 || nextPos.row >= grid.length || nextPos.col < 0 || nextPos.col >= grid[nextPos.row].length) {
            shouldContinue = false;
        } else {
            if (grid[nextPos.row][nextPos.col].obs) {
                switch(pos.dir) {
                    case '^':
                        pos.dir = '>';
                        break;
                    case '>':
                        pos.dir = 'v';
                        break;
                    case 'v':
                        pos.dir = '<';
                        break;
                    case '<':
                        pos.dir = '^';
                        break;
                }
            } else {
                pos = nextPos;
            }

            if(loopDetection) {
                //console.log(grid[pos.row][pos.col].visited);
            }

            if (loopDetection && grid[pos.row][pos.col].visited[pos.dir]) {
                console.log("Loop detected at " + pos.row + ", " + pos.col + " facing " + pos.dir);
                return [false, countVisited(grid)];
            }
        }

    }
    return [true, countVisited(grid)];
}


function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    var [grid, pos] = parseGrid(input, false);

    const [canNavigate, visited] = navigateGrid(grid, pos, false);

    console.log(visited);
    // console.log(grid);
    // console.log(pos);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const [grid, pos] = parseGrid(input, true);

    var countLoops = 0;
    for (var row = 0; row < grid.length; row++) {
        for (var col = 0; col < grid[row].length; col++) {
            if (!grid[row][col].obs) {
                console.log("Checking " + row + ", " + col);
                const tempGrid = structuredClone(grid);
                tempGrid[row][col].obs = true;
                const [canNavigate, visited] = navigateGrid(tempGrid, {...pos}, true);
                if (!canNavigate) {
                    //console.log("=========");
                    //console.log(drawGrid(tempGrid, pos, row, col));
                    countLoops++;
                }
            } else {
                console.log("Skipping " + row + ", " + col);
            }
        }
    }
    console.log(countLoops);
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