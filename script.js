
const atMarks = new Audio("sounds/at-marks.wav");
const ready = new Audio("sounds/ready.wav");
const startSignal = new Audio("sounds/start-signal.wav");

class Stopwatch {
    constructor(element) {
        this.element = element;
        this.timeoutId = null;
        this.intervalId = null;
        this.running = false;
        this.reset();
    }

    start() {
        if (this.running) {
            return;
        }

        this.running = true;

        atMarks.onended = () => this.setTimeout(() => ready.play(), 1000);
        ready.onended = () => this.setTimeout(() => startSignal.play(), 1000);
        startSignal.onended = () => {
            this.lastTime = Date.now();
            this.setInterval(() => this.update(), 10);
        }
        this.setTimeout(() => atMarks.play(), 500);
    }

    stop() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.running = false;
    }

    reset() {
        if (this.running) {
            return;
        }

        this.lastTime = null;
        this.elapsed = 0;
        this.updateTime()
    }

    update() {
        const currentTime = Date.now();
        this.setElapsed(this.elapsed + currentTime - this.lastTime);
        this.lastTime = currentTime;
    }

    setElapsed(elapsed) {
        this.elapsed = elapsed;
        this.updateTime();
    }

    updateTime() {
        const totalSec = Math.floor(this.elapsed / 1000);
        const hour = Math.floor(totalSec / 3600);
        const min = Math.floor(totalSec / 60) % 60;
        const sec = totalSec % 60;
        const milli = Math.floor(this.elapsed % 1000 / 10);
        this.element.innerHTML = (hour > 0 ? `${Stopwatch.format(hour)}:` : "")
            .concat(`${Stopwatch.format(min)}:`)
            .concat(`${Stopwatch.format(sec)}`)
            .concat(`<span class='text-primary'>.${Stopwatch.format(milli)}</span>`);
    }

    setTimeout(handler, timeout) {
        if (!this.running)
            return;
        this.timeoutId = setTimeout(handler, timeout);
    }

    setInterval(handler, timeout) {
        if (!this.running)
            return;
        this.intervalId = setInterval(handler, timeout);
    }

    static format(time) {
        return (time < 10 ? "0" : "").concat(time.toString());
    }
}

const stopwatch_element = document.getElementById("stopwatch");
const stopwatch = new Stopwatch(stopwatch_element);