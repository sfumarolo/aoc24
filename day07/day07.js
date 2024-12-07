const fs = require('fs');

function theGuts(input, base) {
    const lines = input.split('\n');
    var runningTotal = 0;
    lines.forEach(line => {
        [result, componentsCombined] = line.split(": ");
        result = parseInt(result);
        const components = componentsCombined.split(" ");
        console.log(result);
        //console.log(components);
        const combinations = Math.pow(base, components.length - 1);
        //console.log(combinations);
        for (var combo = 0; combo < combinations; combo++) {
            const binaryCombo = combo.toString(base).padStart(components.length - 1, '0');
            //console.log(binaryCombo.replace(/0/g, "*").replace(/1/g, "+").replace(/2/g, "|"));
            var runningValue = parseInt(components[0]);
            for (var i = 0; i < binaryCombo.length; i++) {
                if (binaryCombo[i] == '0') {
                    runningValue *= parseInt(components[i + 1]);
                } else if (binaryCombo[i] == '1'){
                    runningValue += parseInt(components[i + 1]);
                } else if (binaryCombo[i] == '2'){
                    runningValue = parseInt(runningValue + (components[i + 1]));
                }
            }
            //console.log(runningValue);
            if (runningValue == result) {
                console.log("Found a match with " + binaryCombo.replace(/0/g, "*").replace(/1/g, "+").replace(/2/g, "|"));
                runningTotal += result;
                break;
            }
        }
    });
    console.log("~~~~~");
    console.log(runningTotal);
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    theGuts(input, 2);
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    theGuts(input, 3);
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