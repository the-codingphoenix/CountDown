const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateElement = document.getElementById('date-picker');

const countDownElement = document.getElementById('countdown');
const countDownElementTitle = document.getElementById('countdown-title');
const countDownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeElement = document.getElementById('complete');
const completeElementInfo = document.getElementById('complete-info');
const completeButton = document.getElementById('complete-button');

let countDownTitle = "";
let countDownDate = "";
let countDownTime = "";
let countDownValue = new Date();
let countdownInterval;
let saveCountDown;

const second = 1000; //millisecond
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;


// Set date that's not already passed
const today = new Date().toISOString().split('T')[0];
dateElement.setAttribute('min', today);

// Populate Countdown
function updateDOM() {
    const now = new Date().getTime();
    const distance = countDownValue - now;

    if (distance <= 0) {
        clearInterval(countdownInterval);
        inputContainer.hidden = true;
        countDownElement.hidden = true;
        completeElement.hidden = false;
        completeElementInfo.textContent = `${countDownTitle} finished on ${countDownDate} at ${countDownTime}`;
        return;
    }

    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    //hide input
    inputContainer.hidden = true;

    // Populate countdown
    countDownElementTitle.textContent = `${countDownTitle}`;
    timeElements[0].textContent = `${days}`;
    timeElements[1].textContent = `${hours}`;
    timeElements[2].textContent = `${minutes}`;
    timeElements[3].textContent = `${seconds}`;

    // Show countdown 
    countDownElement.hidden = false;

    //hide complete
    completeElement.hidden = true;
}

// Get values from form input
function updateCountDown(e) {
    e.preventDefault();
    countDownTitle = e.srcElement[0].value;
    countDownDate = e.srcElement[1].value;
    countDownTime = e.srcElement[2].value;
    // console.log(countDownTitle, countDownDate, countDownTime);
    saveCountDown = {
        title: countDownTitle,
        date: countDownDate,
        time: countDownTime,
    };
    localStorage.setItem('countdown', JSON.stringify(saveCountDown));

    const selectedDateTime = new Date(`${countDownDate}T${countDownTime}`); // Use local time

    // Debugging: Check selectedDateTime
    // console.log('Initial Selected DateTime:', selectedDateTime.toISOString());

    const now = new Date();

    // Debugging: Check now
    // console.log('Current Date:', now.toString());

    countDownValue = selectedDateTime.getTime();

    if (selectedDateTime <= now) {
        // If the selected date and time is today or in the past, show complete container
        clearInterval(countdownInterval);
        inputContainer.hidden = true;
        countDownElement.hidden = true;
        completeElement.hidden = false;
        completeElementInfo.textContent = `${countDownTitle} finished on ${countDownDate} at ${countDownTime}`;
    } else {
        // If the selected date and time is in the future, start the countdown
        clearInterval(countdownInterval);
        countdownInterval = setInterval(updateDOM, 1000);

        updateDOM();
    }
}

//get countdown from local storage if available
function restoreCountDown() {
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        saveCountDown = JSON.parse(localStorage.getItem('countdown'));
        countDownTitle = saveCountDown.title;
        countDownDate = saveCountDown.date;
        countDownTime = saveCountDown.time;
        const selectedDateTime = new Date(`${countDownDate}T${countDownTime}`);
        countDownValue = selectedDateTime.getTime();
        if (selectedDateTime <= new Date()) {
            // If the selected date and time is today or in the past, show complete container
            completeElement.hidden = false;
            completeElementInfo.textContent = `${countDownTitle} finished on ${countDownDate} at ${countDownTime}`;
        } else {
            // If the selected date and time is in the future, start the countdown
            countdownInterval = setInterval(updateDOM, 1000);
            updateDOM();
        }
    }
}

// Function to reset countdown
function resetCountDown() {
    //stop countdown
    clearInterval(countdownInterval);
    // show input
    inputContainer.hidden = false;
    //hide complete
    completeElement.hidden = true;
    // hide countdown
    countDownElement.hidden = true;
    //reset values
    countdownForm.reset();
    //clear localStorage
    localStorage.removeItem('countdown');
}
// event listeners
countdownForm.addEventListener('submit', updateCountDown);
countDownBtn.addEventListener('click', resetCountDown);
completeButton.addEventListener('click', resetCountDown);

//On Load, check localStorage
restoreCountDown();