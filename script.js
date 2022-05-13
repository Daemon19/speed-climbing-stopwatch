
const AT_YOUR_MARKS_DURATION = 2000;
const READY_DURATION = 2000;
const TIT_DURATION = 1000;

class Delay {
    constructor(duration, message) {
        this.duration = duration;
        this.message = message;
        this.startTime = null;
    }

    isDone() {
        const currentTime = Date.now();

        if (this.startTime === null) {
            this.startTime = currentTime;
        }

        return currentTime - this.startTime > this.duration;
    }
}

class Stopwatch {
    constructor(element) {
        this.element = element;
        this.interval_id = null;
        this.reset();
    }

    start() {
        if (this.interval_id !== null) {
            return;
        }

        this.interval_id = setInterval(() => this.update(), 10);

        if (this.last_time !== null) {
            return;
        }

        this.delay_queue = [
            new Delay(AT_YOUR_MARKS_DURATION, "At Your Marks"),
            new Delay(READY_DURATION, "Ready"),
            new Delay(TIT_DURATION, "🔴"),
            new Delay(TIT_DURATION, "🟡"),
        ];
    }

    stop() {
        clearInterval(this.interval_id);
        this.interval_id = null;

        if (this.delay_queue.length) {
            this.reset();
        }
    }

    reset() {
        if (this.interval_id !== null) {
            return;
        }

        this.last_time = null;
        this.delay_queue = [];
        this.elapsed = 0;
        this.updateTime()
    }

    update() {
        if (this.delay_queue.length) {
            if (!this.delay_queue[0].isDone()) {
                this.updateTime();
                return;
            }

            this.delay_queue.shift();
            return this.update();
        }

        const current_time = Date.now();
        this.elapsed += current_time - (this.last_time || current_time);
        this.last_time = current_time;
        this.updateTime()
    }

    updateTime() {
        if (this.delay_queue.length) {
            this.element.innerText = this.delay_queue[0].message;
            return;
        }

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

    static format(time) {
        let str = time.toString();
        if (time < 10) {
            str = "0".concat(str);
        }
        return str;
    }
}

const stopwatch_element = document.getElementById("stopwatch");
const stopwatch = new Stopwatch(stopwatch_element);