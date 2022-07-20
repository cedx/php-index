import {type ReactiveControllerHost} from "lit";

/**
 * Controller managing a clock.
 */
export class ClockController {

	/**
	 * The clock value.
	 */
	value = new Date();

	/**
	 * The host element.
	 */
	#host: ReactiveControllerHost;

	/**
	 * The timer delay, in milliseconds.
	 */
	#timeout: number;

	/**
	 * The timer identifier.
	 */
	#timerId = 0;

	/**
	 * Creates a new clock controller.
	 * @param host The host element.
	 * @param timeout The timer delay, in seconds.
	 */
	constructor(host: ReactiveControllerHost, timeout = 1) {
		(this.#host = host).addController(this);
		this.#timeout = timeout * 1_000;
	}

	/**
	 * Method invoked when the host element is mounted.
	 */
	hostConnected(): void {
		this.#timerId = window.setInterval(() => {
			this.value = new Date();
			this.#host.requestUpdate();
		}, this.#timeout);
	}

	/**
	 * Method invoked when the host element is unmounted.
	 */
	hostDisconnected(): void {
		clearInterval(this.#timerId);
	}
}
