/**
 * Defines the state of a loading.
 * @enum {number}
 */
export const LoadingState = Object.freeze({

	/**
	 * The loading is in progress.
	 */
	loading: 0,

	/**
	 * The loading is done.
	 */
	done: 1,

	/**
	 * The loading has failed.
	 */
	failed: 2
});
