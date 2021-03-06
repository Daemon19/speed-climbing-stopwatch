const atMarks = new Audio("sounds/at-marks.wav");
const ready = new Audio("sounds/ready.wav");
const startSignal = new Audio("sounds/start-signal.wav");

const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");
const resetButton = document.getElementById("reset-btn");

class State {
    constructor(stopwatch) {
        this.stopwatch = stopwatch;
    }

    start() {}
    pause() {}
    resume() {}
    reset() {}
}

class IdleState extends State {
    constructor(stopwatch) {
        super(stopwatch);
        setButtonsVisibility(true, false, false, false);
        this.stopwatch.updateView(0);
    }

    start() {
        this.stopwatch.state = new StartState(this.stopwatch);
    }
}

class StartState extends State {
    constructor(stopwatch) {
        super(stopwatch);
        setButtonsVisibility(false, false, false, true);

        const playSound = sound => {
            this.playing = sound;
            this.playing.play();
        };

        atMarks.onended = () => setTimeout(() => playSound(ready), 1000);
        ready.onended = () => setTimeout(() => playSound(startSignal), 1000);
        startSignal.onended = () =>
            (this.stopwatch.state = new RunningState(this.stopwatch));

        playSound(atMarks);
    }

    reset() {
        this.playing.pause();
        this.playing.currentTime = 0;
        clearTimeout();
        this.stopwatch.state = new IdleState(this.stopwatch);
    }
}

class RunningState extends State {
    constructor(stopwatch) {
        super(stopwatch);
        this.elapsed = 0;
        this.unpause();
    }

    pause() {
        clearInterval(this.intervalId);
        this.stopwatch.state = new PauseState(this);
    }

    update() {
        const currentTime = Date.now();
        this.elapsed += currentTime - this.startTime;
        this.startTime = currentTime;
        this.stopwatch.updateView(this.elapsed);
    }

    unpause() {
        this.startTime = Date.now();
        this.intervalId = setInterval(() => this.update(), 10);
        setButtonsVisibility(false, true, false, false);
    }
}

class PauseState extends State {
    constructor(runningState) {
        super(runningState.stopwatch);
        setButtonsVisibility(false, false, true, true);
        this.runningState = runningState;
    }

    resume() {
        this.stopwatch.state = this.runningState;
        this.stopwatch.state.unpause();
    }

    reset() {
        this.stopwatch.state = new IdleState(this.stopwatch);
    }
}

class Stopwatch {
    constructor(element) {
        this.element = element;
        this.state = new IdleState(this);
        this.updateView(0);
    }

    start() {
        this.state.start();
    }

    pause() {
        this.state.pause();
    }

    resume() {
        this.state.resume();
    }

    reset() {
        this.state.reset();
    }

    updateView(elapsed) {
        const totalSec = Math.floor(elapsed / 1000);
        const hour = Math.floor(totalSec / 3600);
        const min = Math.floor(totalSec / 60) % 60;
        const sec = totalSec % 60;
        const milli = Math.floor((elapsed % 1000) / 10);
        this.element.innerHTML = (hour > 0 ? `${Stopwatch.format(hour)}:` : "")
            .concat(`${Stopwatch.format(min)}:`)
            .concat(`${Stopwatch.format(sec)}`)
            .concat(
                `<span class='text-primary'>.${Stopwatch.format(milli)}</span>`
            );
    }

    static format(time) {
        return (time < 10 ? "0" : "").concat(time.toString());
    }
}

function setButtonsVisibility(start, pause, resume, reset) {
    const setVisibility = (button, visibility) =>
        (button.parentElement.style.display = visibility ? "unset" : "none");

    setVisibility(startButton, start);
    setVisibility(pauseButton, pause);
    setVisibility(resumeButton, resume);
    setVisibility(resetButton, reset);
}

const stopwatch_element = document.getElementById("stopwatch");
const stopwatch = new Stopwatch(stopwatch_element);

startButton.onclick = () => stopwatch.start();
pauseButton.onclick = () => stopwatch.pause();
resumeButton.onclick = () => stopwatch.resume();
resetButton.onclick = () => stopwatch.reset();
