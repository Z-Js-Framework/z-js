/**
 * Creates a container that displays fallback content while awaiting a promise to resolve to actual desired content, such as that fetched from a backend API.
 *
 * @param {Function} promise - A function that returns a promise which resolves to the desired content.
 * @param {HTMLElement} fallback - An HTML element to display as a fallback while the promise is pending.
 * @param {Object} [options={}] - Optional settings.
 * @param {boolean} [options.retry=false] - Whether to retry the promise if it fails.
 * @param {number} [options.retryDelay=1000] - Delay in milliseconds before retrying the promise.
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts.
 * @returns {HTMLElement} - A container element that will be updated with the promise's resolved content.
 * @throws {Error} If fallback is not an HTML element or if the resolved content is not an HTML element.
 */
export function useSuspense(promise: Function, fallback: HTMLElement, options?: {
    retry?: boolean;
    retryDelay?: number;
    maxRetries?: number;
}): HTMLElement;
