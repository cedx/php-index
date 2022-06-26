/**
 * Controller managing a clock.
 */
export class Clock {

  /**
   * The clock value.
   * @type {Date}
   */
  value = new Date();

  /**
   * The host element.
   * @type {import("lit").ReactiveControllerHost}
   */
  #host;

  /**
   * The timer delay.
   * @type {number}
   */
  #timeout;

  /**
   * The timer identifier.
   * @type {number}
   */
  #timerId = 0;

  /**
   * Creates a new clock controller.
   * @param {import("lit").ReactiveControllerHost} host The host element.
   * @param {number} timeout The timer delay, in seconds.
   */
  constructor(host, timeout = 1) {
    (this.#host = host).addController(this);
    this.#timeout = timeout * 1000;
  }

  /**
   * Method invoked when the host element is connected.
   */
  hostConnected() {
    this.#timerId = window.setInterval(() => {
      this.value = new Date();
      this.#host.requestUpdate();
    }, this.#timeout);
  }

  /**
   * Method invoked when the host element is disconnected.
   */
  hostDisconnected() {
    clearInterval(this.#timerId);
  }
}
