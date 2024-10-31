let startStudyingButton = document.getElementById('start-studying');  // Start button
let startScreen = document.getElementById('start-screen-container');  // Starting screen div
let studyTools = document.getElementById('study-tools-container');  // Study tools div

let timer = document.getElementById("timer")
let alarmSound = document.getElementById('alarm-sound'); 
let minutesDisplay = document.getElementById('minutes');
let secondsDisplay = document.getElementById('seconds');
let pomodorominutesDisplay = document.getElementById('pomodoro-minutes');
let pomodorosecondsDisplay = document.getElementById('pomodoro-seconds');
let startButton = document.getElementById('start');
let pauseButton = document.getElementById('pause');  // The Pause/Resume button
let resetButton = document.getElementById('reset');
let pomodoroStart = document.getElementById('pomodoro-start');
let pomodoroPause= document.getElementById('pomodoro-pause');  // The Pause/Resume button
let pomodoroReset = document.getElementById('pomodoro-reset');
let minutesUp = document.getElementById('minutes-up');
let minutesDown = document.getElementById('minutes-down');
let secondsUp = document.getElementById('seconds-up');
let secondsDown = document.getElementById('seconds-down');

let totalTime = 0;  // 25 minutes in seconds
let countdown;  // Store the interval ID
let isPaused = false;  // Track whether the timer is paused
let isPomodoroPaused = false;
// Pomodoro Timer Variables
let workTime = 25 * 60;  // 25 minutes in seconds
let breakTime = 5 * 60;  // 5 minutes in seconds
let pomodoroSeconds = workTime;  // Start with the work interval
let pomodoroInterval = null;
let isWorkInterval = true;  

let settingsButton = document.getElementById('settings');
let closeSidebarButton = document.getElementById('close-sidebar');
const customTab = document.getElementById('custom-tab');
const pomodoroTab = document.getElementById('pomodoro-tab');


//start stuff
function showStudyTools() {
    startScreen.style.display = "none";  // Hide the starting screen
    studyTools.style.display = "block";  // Show the study tools
}

// Attach event listener to "Start Studying" button
startStudyingButton.addEventListener('click', showStudyTools);

//timer stuff

customTab.addEventListener('click', () => {
    // Show the custom timer and hide the pomodoro timer
    document.getElementById('custom-timer-container').style.display = 'block';
    document.getElementById('pomodoro-timer-container').style.display = 'none';
    
    // Add active class to custom tab and remove from pomodoro tab
    customTab.classList.add('active');
    pomodoroTab.classList.remove('active');
});

pomodoroTab.addEventListener('click', () => {
    // Show the pomodoro timer and hide the custom timer
    document.getElementById('custom-timer-container').style.display = 'none';
    document.getElementById('pomodoro-timer-container').style.display = 'block';

    // Add active class to pomodoro tab and remove from custom tab
    pomodoroTab.classList.add('active');
    customTab.classList.remove('active');
});




// Function to update the total time and display it
function updateTimeDisplay() {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

// Arrow event listeners to adjust minutes and seconds
minutesUp.addEventListener('click', function() {
    totalTime += 60;  // Add 1 minute (60 seconds)
    updateTimeDisplay();
});

minutesDown.addEventListener('click', function() {
    if (totalTime >= 60) {
        totalTime -= 60;  // Subtract 1 minute (60 seconds)
    }
    updateTimeDisplay();
});

secondsUp.addEventListener('click', function() {
    if (totalTime % 60 < 59) {
        totalTime += 1;  // Add 1 second
    } else {
        totalTime += (60 - (totalTime % 60));  // Carry over to the next minute
    }
    updateTimeDisplay();
});

secondsDown.addEventListener('click', function() {
    if (totalTime % 60 > 0) {
        totalTime -= 1;  // Subtract 1 second
    } 
    updateTimeDisplay();
});

let startTime;  // Stores when the timer session started
let remainingTime = totalTime;  // To track remaining time when paused

function startTimer() {
    if (!countdown) {
        remainingTime = totalTime;  // Set the countdown to the user-defined total time
        startTime = Date.now();
        countdown = setInterval(updateTimer, 1000);  // Start updating every second
    }
}



function togglePauseResume() {
    if (isPaused) {
        startTime = Date.now();  // Reset the start time for resuming
        countdown = setInterval(updateTimer, 1000);
        pauseButton.textContent = "Pause Timer";
        isPaused = false;
    } else {
        clearInterval(countdown);
        countdown = null;
        remainingTime = totalTime;  // Store the remaining time when paused
        pauseButton.textContent = "Resume Timer";
        isPaused = true;
    }
}


function resetTimer() {
    clearInterval(countdown);             // Stop the countdown
    countdown = null;                     // Clear the interval ID
    totalTime = 0;                        // Set total time to 0 for reset
    remainingTime = totalTime;            // Update remaining time to match
    pauseButton.textContent = "Pause Timer";
    isPaused = false;
    updateTimeDisplay();                  // Display 00:00
}


function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let newRemainingTime = remainingTime - elapsed;

    if (newRemainingTime <= 0) {
        clearInterval(countdown);       // Stop the timer when time is up
        countdown = null;
        newRemainingTime = 0;           // Ensure display shows 00:00
        alarmSound.play();              // Play the alarm sound

        setTimeout(function() {
            alert("Timer done! Take a break.");
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }, 5000);
    }

    // Update `totalTime` and display based on calculated remaining time
    totalTime = newRemainingTime;
    updateTimeDisplay();
}


// Attach event listeners to buttons
startButton.addEventListener('click', startTimer);  // Start the timer
pauseButton.addEventListener('click', togglePauseResume);  // Toggle between pause and resume
resetButton.addEventListener('click', resetTimer);  // Reset the timer

// Initialize display with default time
updateTimeDisplay();


// Function to start the Pomodoro Timer

// Function to update the Pomodoro timer display
let pomodoroStartTime;  // Stores when the Pomodoro session started
let pausedPomodoroSeconds = pomodoroSeconds;  // For tracking remaining time when paused

function updatePomodoroDisplay() {
    let minutes = Math.floor(pomodoroSeconds / 60);
    let seconds = pomodoroSeconds % 60;
    pomodorominutesDisplay.textContent = minutes.toString().padStart(2, '0');
    pomodorosecondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startPomodoro() {
    if (!pomodoroInterval) {
        pomodoroInterval = setInterval(updatePomodoroTimer, 1000);
        pomodoroPause.textContent = "Pause Timer";
    }
}

function togglePomodoro() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
        pomodoroPause.textContent = "Resume Timer";
    } else {
        startPomodoro();  // Resume the timer
    }
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    isWorkInterval = true;
    pomodoroSeconds = workTime;
    pomodoroPause.textContent = "Pause Timer";
    updatePomodoroDisplay();
}

// Update the Pomodoro Timer every second
function updatePomodoroTimer() {
    if (pomodoroSeconds <= 0) {
        // Switch between work and break intervals
        isWorkInterval = !isWorkInterval;
        pomodoroSeconds = isWorkInterval ? workTime : breakTime;
        
        alarmSound.play();  // Play the alarm sound
        
        setTimeout(function() {
            alert(isWorkInterval ? "Time for a work session!" : "Time for a break!");
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }, 5000);
    } else {
        pomodoroSeconds--;
        updatePomodoroDisplay();
    }
}


// Attach event listeners to Pomodoro buttons
pomodoroStart.addEventListener('click', startPomodoro);
pomodoroPause.addEventListener('click', togglePomodoro);
pomodoroReset.addEventListener('click', resetPomodoro);

// Initialize the Pomodoro display
updatePomodoroDisplay();



// Sidebar toggle
settingsButton.addEventListener('click', function() {
    sidebar.style.right = '0';  // Slide in the sidebar
});

// Sidebar close button functionality
closeSidebarButton.addEventListener('click', function() {
    sidebar.style.right = '-600px';  // Slide out the sidebar when "X" is clicked
});

// Background switching functionality
document.querySelectorAll('.background-btn').forEach(button => {
    button.addEventListener('click', function() {
        let background = this.getAttribute('data-background');
        document.body.style.backgroundImage = `url(${background})`;
    });
});