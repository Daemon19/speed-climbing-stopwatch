

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

        this.last_time = Date.now();
        this.interval_id = setInterval(() => this.update(), 10);
    }

    stop() {
        clearInterval(this.interval_id);
        this.interval_id = null;
    }

    reset() {
        if (this.interval_id !== null) {
            return;
        }

        this.last_time = null;
        this.elapsed = 0;
        this.updateTime()
    }

    update() {
        const current_time = Date.now();
        this.elapsed += current_time - this.last_time;
        this.last_time = current_time;
        this.updateTime()
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