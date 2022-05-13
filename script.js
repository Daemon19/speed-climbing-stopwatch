const atMarks = new Audio("sounds/at-marks.wav");
const ready = new Audio("sounds/ready.wav");
const startSignal = new Audio("sounds/start-signal.wav");

class State {
    constructor(stopwatch) {
        this.stopwatch = stopwatch;
    }

    start() {}
    stop() {}
    reset() {}
}

class IdleState extends State {
    constructor(stopwatch) {
        super(stopwatch);
        this.stopwatch.updateView(0);
    }

    start() {
        this.stopwatch.state = new StartState(this.stopwatch);
    }
}

class StartState extends State {
    constructor(stopwatch) {
        super(stopwatch);

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

    stop() {
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

    stop() {
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
    }
}

class PauseState extends State {
    constructor(runningState) {
        super(runningState.stopwatch);
        this.runningState = runningState;
    }

    start() {
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

    stop() {
        this.state.stop();
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

const stopwatch_element = document.getElementById("stopwatch");
const stopwatch = new Stopwatch(stopwatch_element);
