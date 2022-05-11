

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
        this.element.innerText = "0.00";
    }

    update() {
        const current_time = Date.now();
        this.elapsed += current_time - this.last_time;
        this.last_time = current_time;
        this.element.innerText = (this.elapsed * 0.001).toFixed(2);
    }
}

const stopwatch_element = document.getElementById("stopwatch");
const stopwatch = new Stopwatch(stopwatch_element);