const fs = require('fs');

function isSafe(values) {
    const increasing = values[1] > values[0];
    for (let i = 0; i < values.length - 1; i++) {
        if ((values[i+1] <= values[i] && increasing) || (values[i+1] >= values[i] && !increasing) || (Math.abs(values[i] - values[i+1]) > 3)) {
            return false;
        }
    }

    return true;
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const lines = input.split('\n');
    var safeCount = 0;
    lines.forEach(line => {
        console.log(line);
        var safe = true;
        const values = line.split(' ').map(Number);
        for (let i = 0; safe && i < values.length - 1; i++) {
            if ((values[i+1] <= values[i] && increasing) || (values[i+1] >= values[i] && !increasing) || (Math.abs(values[i] - values[i+1]) > 3)) {
                console.log("Unsafe");
                safe = false;
                break;
            }
        }
        if (isSafe(values)) {
            console.log("Safe");
            safeCount++;
        } else {
            console.log("Unsafe");
        }
    });
    console.log(safeCount);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const lines = input.split('\n');
    var safeCount = 0;
    lines.forEach(line => {
        console.log(line);
        var safe = true;
        const values = line.split(' ').map(Number);
        
        if (isSafe(values)) {
            console.log("Safe as is");
            safeCount++;
        } else {
            var foundSafe = false;
            for (var i = 0; i < values.length; i++) {
                var newValues = values.slice();
                newValues.splice(i, 1);
                if (isSafe(newValues)) {
                    console.log("Safe after removal of " + (i + 1));
                    safeCount++;
                    foundSafe = true;
                    break;
                }
            }
            if (!foundSafe) {
                console.log("Unsafe");
            }
        }
    });
    console.log(safeCount);
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