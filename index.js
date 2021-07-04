#!/usr/bin/env node

const yargs = require("yargs");
const options = yargs
 .usage("Usage: -n <name>")
 .option("s", { alias: "seat", describe: "Seat Array", type: "json", demandOption: true })
 .option("p", { alias: "passenger", describe: "Passenger Count", type: "Number", demandOption: true })
 .argv;
try{
    seats = JSON.parse(options.seat);
} catch {
    console.log("Error: Please enter a valid Seat Array");
    return;
}

passenger = options.passenger;

function validateSeatArray(seatArray) {
    if (Array.isArray(seatArray)) {
        return true;
    };
    console.log("Please provide a valid input. A 2D Array of seats is expected.");
    return false;
}

function validatePassengercount(numberOfPassengers) {
    if (Number.isInteger(numberOfPassengers)) {
        return true;
    };
    console.log("Please provide a valid input. Number Of Passengers is expected.");
    return false;
}

function maxSeat(seatArray) {
    sum = 0;
    seatArray.forEach(function (item) {
        sum += item[0] * item[1];
    });
    console.log("Max Capacity: " + sum);
    return sum;
}

function validateInput(seatArray, numberOfPassengers) {
    if (validateSeatArray(seatArray) && validatePassengercount(numberOfPassengers)) {
        if (maxSeat(seatArray) >= numberOfPassengers) {
            return true;
        } else {
            console.log("Number of passengers is more than the available seats.")
        }
    }
    return false;
}

function findMaxRow(seatArray) {
    maxRows = 0;
    seatArray.forEach(function (item) {
        if (item[1] > maxRows) { maxRows = item[1] }
    })
    return maxRows;
}

function findMaxColumns(seatArray) {
    maxColumn = 0;
    seatArray.forEach(function (item) {
        if (item[0] > maxColumn) { maxColumn = item[0] }
    })
    return maxColumn;
}

function arrangeSeats(seatArray) {
    var maxSeatDivColumns = seatArray.length;
    var maxColumns = findMaxColumns(seatArray);
    var maxRows = findMaxRow(seatArray);
    var totalCols = maxColumns + maxSeatDivColumns - 1;
    var seatArrangement = new Array(maxRows);
    for (var k = 0; k < maxRows; k++) {
        seatArrangement[k] = new Array(totalCols);
        var l = 0;
        for (var i = 0; i < maxSeatDivColumns; i++) {
            if (seatArray[i][1] > k) {
                for (var j = 0; j < seatArray[i][0]; j++) {
                    if (i == 0 && j == 0 || i == maxSeatDivColumns - 1 && j == seatArray[i][0] - 1) {
                        seatArrangement[k][l] = " WW "
                    } else if (j == 0 || j == seatArray[i][0] - 1) {
                        seatArrangement[k][l] = " AA "
                    } else {
                        seatArrangement[k][l] = " CC "
                    }

                    l++;
                }
            } else {
                for (var j = 0; j < seatArray[i][0]; j++) {
                    seatArrangement[k][l] = "    "
                    l++;
                }
            }
            if (i != maxSeatDivColumns - 1) {
                seatArrangement[k][l] = "    "
                l++;
            }

        }
    }
    return seatArrangement;
}

function printSeat(seatArrangement) {
    strCol = "";
    for (var i = 0; i < seatArrangement.length; i++) {
        strRow = "";
        for (var j = 0; j < seatArrangement[i].length; j++) {
            strRow += seatArrangement[i][j];
        }
        strCol += strRow + "\n";
    }
    console.log(strCol);

}

function formatPassangerNumber(passenger) {
    passengerStr = ""
    if (passenger < 10) {
        passengerStr = " 0" + passenger + " ";
    } else {
        passengerStr = " " + passenger + " ";
    }
    return passengerStr;
}

function fillSeatByType(seatArrangement, start, numberOfPassengers, seatType) {
    passenger = start;
    for (var i = 0; i < seatArrangement.length; i++) {
        for (var j = 0; j < seatArrangement[i].length; j++) {
            if (seatArrangement[i][j] == seatType && passenger <= numberOfPassengers) {
                console.log("Reserving seat for passenger: " + passenger);
                seatArrangement[i][j] = formatPassangerNumber(passenger);
                passenger++;
                printSeat(seatArrangement);
            }
        }
    }
    return [seatArrangement, passenger];
}

function fillSeats(seatArray, numberOfPassengers) {
    var seatArrangement = new Array();
    if (validateInput(seatArray, numberOfPassengers)) {
        console.log("Valid Request. Processing further.");
        seatArrangement = arrangeSeats(seatArray);
        console.log("Initial seat arrangement:");
        printSeat(seatArrangement);
        console.log("Filling up the seats:");
        fillAisleVal = fillSeatByType(seatArrangement, 1, numberOfPassengers, " AA ");
        fillWindowVal = fillSeatByType(fillAisleVal[0], fillAisleVal[1], numberOfPassengers, " WW ");
        fillCentralVal = fillSeatByType(fillWindowVal[0], fillWindowVal[1], numberOfPassengers, " CC ");
    }
    else {
        console.log("Failed to process the request.");
    }
}
fillSeats(seats, passenger);

//fillSeats([[3, 2], [4, 3], [2, 3], [3, 4]], 36);
