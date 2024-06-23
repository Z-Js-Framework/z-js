// code for z js utilities and helpers
/**
 * @type function - Z Js Utility function
 * @description A short hand for the standard console.log
 * @param {*} args
 * @returns  standard console methods
 */
export function print(args) {
  console.log(args);

  return { ...console };
}
