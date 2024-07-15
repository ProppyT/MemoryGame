/**
 * Author: Tommy van Burk, 2023
 * Language: JavaScript
 * IDE's and webserver used: Visual Studio Code, text editor Notepad++, and Windows Wampserver 32-bits
 * The game is about finding two the same colors, if the user find two the same it give some extra time and
 * points
 */
 

// This function generates random hexadecimal colors in the form #ABCDEF
function randomHexColor() {
  const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += hexDigits[Math.floor(Math.random() * 16)];
  }
  return color;
}

/*console.log(randomHexColor());
console.log("\n");*/


// This function is a random generator of color pairs of the same color, put everything in an array, in the form ["#ABABAB", "#ABABAB", "#ABCABC", "#ABCABC"]
function hexColorGenerator(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = randomHexColor();
    colors.push(color);
    colors.push(color);
  }
  return colors;
}


// Create the array with the double hexadecimal colors of 32 pairs of the same colors, in total 64 colors
var colors = hexColorGenerator(32);

/*console.log(colors);
console.log("\n");*/

// Randomly shuffle the array with the double colors
function shuffle(array) {
    for(let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// shuffle the colors
shuffle(colors);

/*console.log(colors);
console.log("\n");*/

// this function discover if the array is shuffled
function isShuffled(array) {
    for(let i = 0; i < array.length - 1; i++) {
        if(array[i] !== array[i+1]) { // if formal is not the same as next one
            return true;
        }
    }
    return false; // when all the pairs are still next to each other 
}

// Check if the array of the double colors are shuffled
if(isShuffled(colors)) {
    console.log("Shuffled");
} else {
    console.log("Unshuffled");
}

// this function make up the gameboard with all the buttons and text fields
function generateGameboard(array) {
    
    const scoreDiv = document.createElement("div");
    scoreDiv.id = "score";
    scoreDiv.textContent = "Score: 0";
    document.body.appendChild(scoreDiv);

    const timerDiv = document.createElement("div");
    timerDiv.id = "timer";
    timerDiv.textContent = "Remaining time: 0:00";
    document.body.appendChild(timerDiv);

    const titleDiv = document.createElement("div");
    titleDiv.id = "title";
    titleDiv.textContent = "...Color Memory Game..";
    document.body.appendChild(titleDiv);

    const audioBut_1 = document.createElement("div");
    audioBut_1.id = "audioButton_1";
    const bold = document.createElement("b");
    bold.textContent = "Cat sound off";
    audioBut_1.appendChild(bold);
    document.body.appendChild(audioBut_1);

    const audioBut_2 = document.createElement("div");
    audioBut_2.id = "audioButton_2";
    const str = document.createElement("strong");
    str.textContent = "Cat sound on";
    audioBut_2.appendChild(str);
    document.body.appendChild(audioBut_2);

    const reload = document.createElement("div");
    reload.id = "reloadButton";
    const b = document.createElement("b");
    b.textContent = "Reload Game";
    reload.appendChild(b);
    document.body.appendChild(reload);

    const level = document.createElement("div");
    level.id = "levelText";
    const b1 = document.createElement("b");
    b1.textContent = "Choice the Level of difficulty:";
    level.appendChild(b1);
    document.body.appendChild(level);

    const easy = document.createElement("div");
    easy.id = "easyButton";
    const b2 = document.createElement("strong");
    b2.textContent = "Easy";
    easy.appendChild(b2);
    document.body.appendChild(easy);

    const norm = document.createElement("div");
    norm.id = "normalButton";
    const b3 = document.createElement("strong");
    b3.textContent = "Normal";
    norm.appendChild(b3);
    document.body.appendChild(norm);

    const ext = document.createElement("div");
    ext.id = "extremeButton";
    const b4 = document.createElement("strong");
    b4.textContent = "Extreme";
    ext.appendChild(b4);
    document.body.appendChild(ext);

    const cont = document.createElement("div");
    cont.id = "control";
    const b5 = document.createElement("p");
    b5.textContent = "Messages of the game here... Easy level activated...";
    cont.appendChild(b5);
    document.body.appendChild(cont);

    for(let i = 0; i < array.length; i++) {
        const block = document.createElement("div");
        block.classList.add("hand");
        block.id = "block_" + (i + 1);
        const paragraph = document.createElement("p");
        block.appendChild(paragraph);
        document.body.appendChild(block);
    }
}

generateGameboard(colors);

// From here comes the logic of the game in JavaScript and JQuery

// copy the array colors to another array named jsArray
const jsArray = [...colors]; // secure copied with the spread operator

/*console.log(jsArray);
console.log("\n");*/


		// declare a variable that containts the two the same colored elements
        var twoSame = [];
        
        // declare a variable that register the same colors on the board to stay none clickable in any case later
        let registerSameColors = [];
        
        // declare the variables for the colors found
        var firstColor, secondColor;
        
        // input and conversion variables
        var elementId, elementIdClean, idNumber;
        
        // play sample of cat when clicking an element
        const audioCat = new Audio("cat.mp3");
        // play sample of applause when found two the same colors
        const audioApplause = new Audio("applause.mp3");
        // play sample of not winning
        const audioLost = new Audio("gameOver.mp3");
        // play sample of beeping the last seconds of the timer
        const audioBeep = new Audio("beep.mp3");
        // is the status of the sound of the cat being on or off
        var audioCatStatus = "1"; // initially on

        // variable for the time remaining
        var timeRemaining = 480; // in seconds, are 8 minutes, this is level easy
        // variable to add more time to the timeRemaining, when winning two of the same colors
        var addTime = 40; // in seconds in level easy

        // variable to keep the score of the game
        var score = 0; // integer
        // variable to add score points to score, when winning two of the same colors
        var addScore = 10; // points amount in level easy
        
        // function to stop the game by disabling all the elements on the game board
        function stopGame() {
            for(var i = 0; i < jsArray.length; i++) {
                    $("#block_" + (i+1)).css("pointer-events", "none");
            }
        }

        // function show the remaining time of the game, if over time sucstraction of the made points till now
        function updateTimer() {
            // calculate the minutes and the seconds remaining
            var minutes = Math.floor(timeRemaining / 60);
            var seconds = timeRemaining % 60;
            if(seconds >= 0 && seconds < 10) { // correcting the ugly presentation of the seconds smaller than 10 seconds, before 9 now 09
                seconds = "0" + seconds;
            }
            // update the display of the time
            $("#timer").html("Remaining time: " + minutes + ":" + seconds + "</div>");
            // if the remaining time is around 15 seconds it beeps till time stops
            if(timeRemaining < 15) {
                audioBeep.play();
            }
            // check if the timer has expired
            if(timeRemaining === 0) {
                // stop the game, by disabling all the elements
                stopGame();
                // stop the clock of counting down, when there is no time over
                clearInterval(intervalID); // stopping the loop of the timer
                clearInterval(intervalIDscore); // stopping the loop of the score update
                // if user did not found all the pairs of the same color and the time past print this message
                if(registerSameColors.length < jsArray.length) {
                    $("#control").html("<p><strong>So sorry you lost!!!! There is no time!!</strong></p>");
                    audioLost.play();
                }
            }
            // decrement the time remaining variable, so that the timer countdown
            timeRemaining--;
        }

        // function to update the score of the game when two of the same color are found
        function updateScore() {
            $("#score").html("Score: " + score + "</div>");
        }
        
        // function reset() to reset all the working variables after every run to find two the same
        function reset() {
            // empty the array to find two
            twoSame = [];
            // and reset the variables firstColor and secondColor
            firstColor = "#000000"; // the hexidecimal white color
            secondColor = "#000000";
            // and reset the variables elementId, elementIdClean, idNumber
            elementId = "";
            elementIdClean = "";
            idNumber = 0;
        }
        
        const regex = /\"block_(\d)"/g; // with this regex you find all the "block_1" till "block_9" all with one digit
        
        // start the loop for the remaining time of the game
        const intervalID = setInterval(updateTimer, 1000); // update timer every 1 second
        // start the loop for updating the score of the game, every 1 second
        const intervalIDscore = setInterval(updateScore, 1000);

        // if button clicked the easy level will be activated
            $("#easyButton").on("click", function() {
                $("#control").html("<p><b>Level Easy is now activated!!</b></p>");
                // set all variables timeRemaining, addTime, and addScore
                timeRemaining = 480; // initiate with 8 minutes
                addTime = 40; // initiate with 40 seconds extra per win
                addScore = 10; // initiate with 10 points per win
            });

            // if button clicked the normal level will be activated
            $("#normalButton").on("click", function() {
                $("#control").html("<p><b>Level Normal is now activated!!</b></p>");
                // set all variables timeRemaining, addTime, and addScore
                timeRemaining = 240; // initiate with 4 minutes
                addTime = 30; // initiate with 30 seconds extra per win
                addScore = 20; // initiate with 20 points per win
            });

            // if button clicked the extreme level will be activated
            $("#extremeButton").on("click", function() {
                $("#control").html("<p><b>Level Extreme is now activated!!</b></p>");
                // set all variables timeRemaining, addTime, and addScore
                timeRemaining = 180; // initiate with 2 minutes
                addTime = 25; // initiate with 20 seconds extra per win
                addScore = 40; // initiate with 40 points per win
            });

            // if button clicked the game will be reloaded
            $("#reloadButton").on("click", function() {
                $("#control").html("<p><b>Game is now reloaded!!</b></p>");
                /*for (let i = 0; i < jsArray.length; i++) {
                        $("#block_" + (i + 1)).css("background-color", "#000000");
                        $("#block_" + (i + 1)).css("pointer-events", "auto");
                    }*/
				document.location.reload(); // reloading all the assets too
				// window.location.reload(); // don't reload all the assets, only reload the page
            });

            
        $(document).on("click", ".hand", function() {
            

            // if button clicked to put cat sound off
            $("#audioButton_1").on("click", function() {
                if(audioCatStatus === "1") {
                    $("#control").html("<p><strong>Annoying Cat sound is now off!!</strong></p>");
                    audioCatStatus = "0";
                }
            });

            // if button clicked to put cat sound on
            $("#audioButton_2").on("click", function() {
                if(audioCatStatus === "0") {
                    $("#control").html("<p><strong>Annoying Cat sound is now on!!</strong></p>");
                    audioCatStatus = "1";
                }
            });

            // annoying cat sound on or off
            if(audioCatStatus === "1") {
                audioCat.play();
            } else if(audioCatStatus === "0") {
                audioCat.pause();
            }

            // take the id name of the element that was clicked by the user
            elementId = $(this).attr("id");
            // strip the underscore character from the ID, so that we have no problem in parsing into a number
            if(regex.test(elementId)) { // if true it takes all the block_ with one digit
                elementIdClean = elementId.substring(6, 7); // it strip only one digit
            }
            else { // here for all the block_ with two digits
                elementIdClean = elementId.substring(6, 8); // it strip only two digits
            }
            // convert the id name into one single number
            idNumber = parseInt(elementIdClean);
            // change the background-color property of the id number of the clicked element
            $("#block_" + idNumber).css("background-color", jsArray[idNumber-1]);

            
            // the next click check if the idNumber is the same, if not add to the twoSame array till a total of two is reached
            var counter = 0;
            if(twoSame.length !== 2 && twoSame[counter] !== idNumber) {
                twoSame.push(idNumber);
                counter++;
            }
            
            // here assign the colors to a more convenient variable to use later in a logic expression
            if (twoSame.length === 2) {
                firstColor = jsArray[twoSame[0]-1];
                secondColor = jsArray[twoSame[1]-1];
            }
            
            // check if a total of two is reached, and if have the same two colors, if not make the clicked dark again and empty the twoSame
            if(twoSame.length === 2 && !(firstColor === secondColor)) {
                $("#control").html("<p>The colors found are not the same!! Try again!!</p>");
                // this function is to disable all the elements for a moment, so clicking through by the user is prevented not to crash the game
                function allNotClickable() {
                    for(var i = 0; i < jsArray.length; i++) {
                        if(registerSameColors[i] === (i+1)) {
                            continue; // skip this element, so it stays "none"
                        }
                        $("#block_" + (i+1)).css("cursor", "none");
                    }
                }
                // this function is to enable all the elements again, except the elements that were disabled
                function allClickable() {
                    for(var i = 0; i < jsArray.length; i++) {
                        if(registerSameColors[i] === (i+1)) {
                            continue; // skip this element, so it stays "none"
                        }
                        $("#block_" + (i+1)).css("cursor", "pointer");
                    }
                }

                // this function is to change the formal serie of two that were not the same 
                function lastElements() {
                    for (var i = 0; i < 2; i++) {
                        $("#block_" + twoSame[i]).css("background-color", "#000000");
                    }
                    reset(); // reset all the working variables in the program
                }
                
                allNotClickable();
                setTimeout(allClickable, 125); // make all elements clickable again after an 8th of a second
                setTimeout(lastElements, 250); // the formal serie of two will be black after an 4th of a seconds                    
                
            } else if(twoSame.length === 2 && firstColor === secondColor) {
                $("#control").html("<p>The colors found are the same!! Congratulation!!</p>");
                audioApplause.play();
                // make the two the same elements inactive for future clicks
                for(var i = 0; i < twoSame.length; i++) {
                    $("#block_" + twoSame[i]).css("pointer-events", "none");
                    registerSameColors.push(twoSame[i]); // register the same colors on the board to stay inactive in any case    
                }
                // add to the remaining time x seconds more if you found two of the same color
                timeRemaining += addTime; 
                // add to the score of the game x points every time two of the same colors are found by the user
                score += addScore;
                reset(); // reset all the working variables in the program    
            }
            
            // write congratulations you win when the length of registerSameColors is the same as the length of color array jsArray
            if(registerSameColors.length === jsArray.length) {
                $("#control").html("<p><strong>Congratulations you win!!!!</strong></p>");
                audioApplause.play();
                // stop the clock of counting down, when there is an all over win
                clearInterval(intervalID);
                // stop the loop of updating the score, when there is an all over win
                clearInterval(intervalIDscore);
            }
            
            /*// check the results
            if(twoSame.length === 2) {  
                // log the control of array threeSame to the log screen
                console.log(twoSame);
                // log the control of colors to the log screen
                console.log(jsArray[twoSame[0]-1]);
                console.log(jsArray[twoSame[1]-1]);
                console.log(registerSameColors);
            }*/
                    
        });

