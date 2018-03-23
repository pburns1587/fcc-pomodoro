/*
Free Code Camp - Build a Pomodoro Clock
Created by Patrick Burns

TODO: Create Countdown Clock
    DONE: Set
    DONE: Start
    DONE: Tick
    DONE: Stop
    TODO: Reset

TODO: Basic UI
    TODO: Current time display
    TODO: Set/Start/Stop/Reset button
    TODO: Click Handler
    TODO: Work/Rest Time Set Value Inputs/buttons   

TODO: Build Pomodoro Clock (2 Countdown Clocks Together)
    TODO: When work ends, start rest, reset work
    TODO: When rest ends, start work, reset rest

TODO: Bells/whistles
    TODO: Alert sound
    TODO: Quick start buttons (25/5, 50/10, 9/1)

TODO: Further UI
    TODO: Clock circle, ticks away around the clock face
    TODO: Previous Completed Cycles window
    TODO: Pause grays out clock with button on top to restart

*/

//Clock constructor
function Clock(minutes, seconds) {
    this.minutes = minutes;
    this.seconds = seconds;
    this.running = false;
    this.initMinutes = minutes;
    this.initSeconds = seconds;

    this.tickTock = function () {
        if (this.running) {
            console.log("TICK" + this.minutes + this.seconds);
            if (this.minutes <= 0 && this.seconds <= 0) {
                //Time's up
                this.running = false;
                alert("Time's up!");
            } else if (this.minutes > 0 && this.seconds === 0) {
                //Decrement minutes
                this.minutes--;
                //Flip seconds to 59
                this.seconds = 59;
            } else {
                //Decrement minutes
                this.seconds--;
            }
        } else {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    };

    this.startTime = function () {
        this.running = true;
        this.intervalId = setInterval(this.tickTock.bind(this), 1000);
    };

    this.time = function () {
        return this.minutes + ":" + this.seconds
    };

    this.stopTime = function () {
        clearInterval(this.intervalId);
        this.running = false;
    };

    //Stop timing
    this.stopTime = function () {
        clearInterval(this.intervalId);
        this.running = false;
    };

    //Reset existing clock object to initial settings
    this.resetTime = function () {
        this.minutes = this.initMinutes;
        this.seconds = this.initSeconds;
        this.running = false;
    };

    this.setTime = function (setMinutes, setSeconds) {
        this.minutes = setMinutes;
        this.seconds = setSeconds;
        this.initMinutes = setMinutes;
        this.initSeconds = setSeconds;
    };

}

var testClock = new Clock(0, 15);

$( "#start" ).click(function() {
    testClock.startTime();
});
$( "#stop" ).click(function() {
    testClock.stopTime();
});
$( "#reset" ).click(function() {
    testClock.resetTime();
});