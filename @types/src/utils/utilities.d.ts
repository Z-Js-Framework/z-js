/**
 * Z Js Utility function
 * @description Acts as short hand for the standard console.log
 * @param {*} args
 * @returns  standard console methods
 */
export function print(args: any): {
    assert(condition?: boolean, ...data: any[]): void;
    clear(): void;
    count(label?: string): void;
    countReset(label?: string): void;
    debug(...data: any[]): void;
    dir(item?: any, options?: any): void;
    dirxml(...data: any[]): void;
    error(...data: any[]): void;
    group(...data: any[]): void;
    groupCollapsed(...data: any[]): void;
    groupEnd(): void;
    info(...data: any[]): void;
    log(...data: any[]): void;
    table(tabularData?: any, properties?: string[]): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    timeLog(label?: string, ...data: any[]): void;
    timeStamp(label?: string): void;
    trace(...data: any[]): void;
    warn(...data: any[]): void;
};
/**
 * Generates a unique ID.
 *
 * @param {string} [keyword=''] - A keyword to include in the ID.
 * @param {number} [length=6] - The length of the random part of the ID.
 * @returns {string} The generated unique ID.
 */
export function generateUniqueId(keyword?: string, length?: number): string;
/**
 * Hashes a string using the DJB2 algorithm.
 *
 * @param {string} str - The string to hash.
 * @returns {string} The hashed string.
 */
export function hashString(str: string): string;
