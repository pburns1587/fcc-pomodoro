/*
Free Code Camp - Build a Pomodoro Clock
Created by Patrick Burns

TODO: Create Countdown Clock
    DONE: Set
    DONE: Start
    DONE: Tick
    DONE: Reset

TODO: Basic UI
    DONE: Current time display
    DONE: Work/Rest Time Set Value Inputs/buttons 
    DONE: Set/Start/Reset button

TODO: Build Pomodoro Clock (2 Countdown Clocks Together)
    DONE: When work ends, start rest
    DONE: When rest ends, start work
    DONE: Reset each clock on expiry

TODO: Bells/whistles
    TODO: Alert sound
    DONE: Quick start buttons (25/5, 50/10, 10/1)

TODO: Further UI
    DONE: Clocks side by side
    TODO: Active highlighted, stopped faded
*/

let counter;

function PomodoroClock(duration, clockType) {
    this.running = false;
    this.duration = duration;
    this.remaining = duration; //time left in sec
    this.tickFtns = [];
    this.obj = PomodoroClock.parse(duration);
    this.lastDuration = duration;
    this.counterpart; //counterpart Rest or Work Clock
    this.clockType = clockType; //WORK or REST
}

PomodoroClock.prototype.onTick = function (ftn) { //pass in a function
    if (typeof ftn === 'function') { //if arg is a function
        this.tickFtns.push(ftn); //add it to list of tick functions
    }
    return this;
};

PomodoroClock.prototype.start = function () {
    if (this.running || this.counterpart.running) { //if anything is running, don't do anything
        return;
    }

    console.log("START: " + this);

    this.running = true;

    let start = Date.now();
    let that = this;

    //init
    that.obj = PomodoroClock.parse(that.remaining); //returns min/sec at this moment to PomodoroClock object
    that.tickFtns.forEach(function (ftn) {
        ftn.call(this, that.obj.minutes, that.obj.seconds, that.clockType); //call each function in tickFtns, passing minutes and seconds to each
    }, that);

    counter = setInterval(timer, 500);
    function timer() {
        that.remaining = that.duration - (((Date.now() - start) / 1000) | 0);
        if (that.remaining <= 0) {
            that.remaining = 0;
            clearInterval(counter);
            that.running = false;
            that.reset();
        }
        that.obj = PomodoroClock.parse(that.remaining); //returns min/sec at this moment to PomodoroClock object
        that.tickFtns.forEach(function (ftn) {
            ftn.call(this, that.obj.minutes, that.obj.seconds, that.clockType); //call each function in tickFtns, passing minutes and seconds to each
        }, that);
        if (!that.running) { //if expired
            return that.counterpart.start(); //start counterpart clock
        }
    }
};

PomodoroClock.parse = function (seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
};

//Stop timing
PomodoroClock.prototype.stop = function () {
    if (!this.running) {
        return;
    }

    this.running = false;
    clearInterval(counter);
    this.duration = this.remaining;
};

PomodoroClock.prototype.reset = function () {
    if (this.lastDuration !== this.remaining || this.counterpart.lastDuration !== this.counterpart.remaining) {
        this.running = false;
        clearInterval(counter);
        this.duration = this.lastDuration;
        this.remaining = this.duration;
        this.obj = PomodoroClock.parse(this.duration);
        return this.counterpart.reset();
    }
};

PomodoroClock.prototype.set = function (seconds) {
    this.running = false;
    clearInterval(counter);
    this.lastDuration = seconds;
    this.duration = seconds;
    this.remaining = seconds;
    this.obj = PomodoroClock.parse(seconds);
};

window.onload = function () {
    let workDisplay = document.querySelector('#clock_text');
    let workClock = new PomodoroClock(1500, 'WORK');
    let workClockObj = PomodoroClock.parse(1500);

    let restDisplay = document.querySelector('#rest_clock_text');
    let restClock = new PomodoroClock(300, 'REST');
    let restClockObj = PomodoroClock.parse(300);

    let workText = document.querySelector('#work_text');
    let restText = document.querySelector('#rest_text');

    let workElem = document.getElementById('clock');
    let restElem = document.getElementById('rest_clock');

    //Relate the clocks to each other
    workClock.counterpart = restClock;
    restClock.counterpart = workClock;

    //Initial clock draw
    formatWork(workClockObj.minutes, workClockObj.seconds, 'WORK');
    formatRest(restClockObj.minutes, restClockObj.seconds, 'REST');

    workClock.onTick(formatWork); //Draw clock every tick
    restClock.onTick(formatRest);

    function formatWork(minutes, seconds, clockType) {
        seconds = seconds < 10 ? '0' + seconds : seconds;
        workDisplay.textContent = minutes + ':' + seconds;
        workText.textContent = clockType;
        if (workClock.running) {
            workElem.classList.add('bg-primary', 'text-white');
            restElem.classList.remove('bg-primary', 'text-white');
        }
    }

    function formatRest(minutes, seconds, clockType) {
        seconds = seconds < 10 ? '0' + seconds : seconds;
        restDisplay.textContent = minutes + ':' + seconds;
        restText.textContent = clockType;
        if (restClock.running) {
            restElem.classList.add('bg-primary', 'text-white');
            workElem.classList.remove('bg-primary', 'text-white');
        }
    }

    $("#work_plus").click(function () {
        let setVal = workClock.duration + 60;
        workClock.set(setVal);
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
    });

    $("#work_minus").click(function () {
        let setVal = 0;

        if (workClock.duration >= 60) { // if less than 60, set to 0
            setVal = workClock.duration - 60;
        }

        workClock.set(setVal);
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
    });

    $("#rest_plus").click(function () {
        let setVal = restClock.duration + 60;
        restClock.set(setVal);
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
    });

    $("#rest_minus").click(function () {
        let setVal = 0;

        if (restClock.duration >= 60) { // if less than 60, set to 0
            setVal = restClock.duration - 60;
        }

        restClock.set(setVal);
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
    });

    $("#start").click(function () {
        workClock.start();
    });

    $("#reset").click(function () {
        workClock.reset();
        restClock.reset();
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
        workElem.classList.remove('bg-primary', 'text-white');
        restElem.classList.remove('bg-primary', 'text-white');
    });

    $("#10_1").click(function () {
        workClock.set(600);
        restClock.set(60);
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
    });

    $("#25_5").click(function () {
        workClock.set(1500);
        restClock.set(300);
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
    });

    $("#50_10").click(function () {
        workClock.set(3000);
        restClock.set(600);
        formatWork(workClock.obj.minutes, workClock.obj.seconds, 'WORK');
        formatRest(restClock.obj.minutes, restClock.obj.seconds, 'REST');
    });
};