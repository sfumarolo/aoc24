const fs = require('fs');

function parseDiskLayout(input) {
    var expandedDisk = [];
    var fileFlag = true;
    var fileIndex = 0;

    for (var i = 0; i < input.length; i++) {
        const len = parseInt(input.charAt(i));
        if (fileFlag) {
            for (var j = 0; j < len; j++) expandedDisk.push(fileIndex);
            fileIndex++;
        } else {
            for (var j = 0; j < len; j++) expandedDisk.push(-1);
        }
        fileFlag = !fileFlag;
    }

    return [expandedDisk, fileIndex - 1];
}

function printDiskLayout(diskLayout) {
    var diskLayoutString = "";
    for (var i = 0; i < diskLayout.length; i++) {
        if (diskLayout[i] == -1) {
            diskLayoutString += ".";
        } else {
            diskLayoutString += diskLayout[i];
        }
    }
}

function amphipodPart1(diskLayout) {
    var lastIndexMoved = diskLayout.length;

    for (var i = 0; i < lastIndexMoved; i++) {
        if (diskLayout[i] == -1) {
            for (var j = lastIndexMoved - 1; j > i; j--) {
                if (diskLayout[j] != -1) {
                    diskLayout[i] = diskLayout[j];
                    diskLayout[j] = -1;
                    lastIndexMoved = j;
                    //console.log(diskLayout);
                    break;
                }
            }
        }
    }

    return diskLayout;
}

function findGapAtBeginningOfDisk(diskLayout, gapRequired) {
    var gapStart = null;
    for (var gapSearchStart = 0; gapSearchStart < diskLayout.length - gapRequired; gapSearchStart++) {
        var gapFound = true;
        for (var searchSubsequentSector = gapSearchStart; searchSubsequentSector < gapSearchStart + gapRequired; searchSubsequentSector++) {
            if (diskLayout[searchSubsequentSector] !== -1) {
                gapFound = false;
                break;
            }
        }

        if (gapFound) {
            gapStart = gapSearchStart;
            break;
        }
    }
    //console.log("Gap Start: " + gapStart);
    return gapStart
}

function printDiskLayout(diskLayout) {
    var diskLayoutString = "";
    for (var i = 0; i < diskLayout.length; i++) {
        if (diskLayout[i] == -1) {
            diskLayoutString += ".";
        } else {
            diskLayoutString += diskLayout[i];
        }
    }
    console.log(diskLayoutString);
}

function amphipodPart2(diskLayout, maxFileIndex) {
    var lastIndexMoved = diskLayout.length;
    console.log("Max File Index: " + maxFileIndex);

    for (var fileIndex = maxFileIndex; fileIndex >= 0; fileIndex--) {
        var fileSize = 0;
        var fileStart;
        var fileEnd;
        var inFile = false;
        for (var lastDiskBlockInspected = lastIndexMoved; lastDiskBlockInspected >= -1; lastDiskBlockInspected--) {
            if (diskLayout[lastDiskBlockInspected] == fileIndex) {
                //console.log("Found file " + fileIndex + " at " + lastDiskBlockInspected);
                inFile = true;
                fileSize++;
            } else if (inFile && diskLayout[lastDiskBlockInspected] !== fileIndex) {
                //console.log("File " + fileIndex + " is " + fileSize + " blocks long");
                // We processed the file and now we fell out of it
                //fileSize++;
                fileStart = lastDiskBlockInspected + 1;
                fileEnd = fileStart + fileSize
                //console.log("File " + fileIndex + " starts at " + fileStart + " and ends at " + fileEnd);
                lastIndexMoved = lastDiskBlockInspected;
                
                const validStartingGapStart = findGapAtBeginningOfDisk(diskLayout, fileSize);
                if (validStartingGapStart !== null && validStartingGapStart < fileStart) {
                    //console.log("Valid starting gap found at " + validStartingGapStart);
                    for (var rewriteFileIndex = validStartingGapStart; rewriteFileIndex < validStartingGapStart + fileSize; rewriteFileIndex++) {
                        diskLayout[rewriteFileIndex] = fileIndex;
                    }

                    for (var rewriteGapIndex = fileStart; rewriteGapIndex < fileEnd; rewriteGapIndex++) {
                        diskLayout[rewriteGapIndex] = -1;
                    }
                    // for (var i = 0; i < fileSize; i++) {
                    //     diskLayout[validStartingGapStart + i] = fileIndex;
                    // }
                } else {
                    //console.log("No valid starting gap found");
                    // for (var i = fileStart; i < fileEnd; i++) {
                    //     diskLayout[i] = fileIndex;
                    // }
                }
                //console.log(diskLayout);
                //printDiskLayout(diskLayout);
                break;
            } else {
                // We are not in the file
                //console.log("Not sure what this means " + diskLayout[lastDiskBlockInspected]);
                continue;
            }
        }
    }
    //printDiskLayout(diskLayout);
    return diskLayout;
}

function diskChecksum(diskLayout) {
    //printDiskLayout(diskLayout);
    var checksum = 0;
    for (var i = 0; i < diskLayout.length; i++) {
        if (diskLayout[i] !== -1) {
            //console.log (i + " * " + diskLayout[i]);;
            checksum += diskLayout[i] * i;
        }
    }

    return checksum;
}

function part1(input) {
    // Implement part 1 logic here
    console.log("Running Part 1");
    const [expandedDisk, maxFileIndex] = parseDiskLayout(input);
    //console.log(expandedDisk);
    console.log(maxFileIndex);
    const optimizedDisk = amphipodPart1(expandedDisk);
    //console.log(optimizedDisk);
    console.log(diskChecksum(optimizedDisk));
}

function part2(input) {
    // Implement part 2 logic here
    console.log("Running Part 2");
    const [expandedDisk, maxFileIndex] = parseDiskLayout(input);
    const optimizedDisk = amphipodPart2(expandedDisk, maxFileIndex);
    console.log(diskChecksum(optimizedDisk));
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