const fs = require('fs');

function addRule(rules, rule) {
    ruleParts = rule.split('|');

    if(rules[ruleParts[0]] == undefined) {
        rules[ruleParts[0]] = {"comesBefore": [], "comesAfter": []};
    }

    if(rules[ruleParts[1]] == undefined) {
        rules[ruleParts[1]] = {"comesBefore": [], "comesAfter": []};
    }

    rules[ruleParts[0]].comesBefore.push(ruleParts[1]);
    rules[ruleParts[1]].comesAfter.push(ruleParts[0]);
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const lines = input.split('\n');
    var rules = {};
    var foundTheEnd = false;
    var runningSum = 0;
    lines.forEach(line => {
        if(!foundTheEnd) {
            if(line == "") {
                foundTheEnd = true;
                console.log(rules);
            } else {
                addRule(rules, line);
            }
        } else {
            console.log("==============");
            console.log(line);
            var lineValid = true;
            const pages = line.split(',');
            for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                page = pages[pageIndex];
                //console.log(page);
                if(rules[page]) {
                    //console.log("Rules exist for " + page);
                    for (var compPage = 0; compPage < pageIndex && lineValid; compPage++) {
                        //console.log("Comparing " + page + " to " + pages[compPage]);
                        //console.log(rules[pages[pageIndex]].comesBefore);
                        if(rules[pages[pageIndex]].comesBefore.includes(pages[compPage])) {
                            //console.log(page + " is in the wrong place");
                            lineValid = false;
                            break;
                        } else {
                           //console.log(page + " is in the right place");
                        }
                    }
                } else {
                    "There are no rules governing where " + page + " should go";
                }
            }

            if (lineValid) {
                console.log(line + " is valid");

                console.log("Adding " + pages[Math.floor(pages.length / 2)]);
                //console.log("Adding " + pages[Math.round(pageIndex / 2).valueOf()]);
                runningSum += parseInt(pages[Math.floor(pages.length / 2)]);
            } else {
                console.log(line + " is invalid");
            }
        }
    });

    console.log(runningSum);
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