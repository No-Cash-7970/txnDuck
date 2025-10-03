/** @file Collection of general-purpose utility function and constants */

import { AlgodTokenHeader, Algodv2, BaseHTTPClient, CustomTokenHeader } from "algosdk";
import { SetStateAction, WritableAtom } from "jotai";
import { Themes } from "@/app/lib/app-settings";

/** Regular expression for detecting a valid Base64 string.
 *
 * From: https://stackoverflow.com/a/7874175
 */
export const base64RegExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

/** Name of the query parameter used to indicate importing a transaction */
export const importParamName = 'import';

/** Converts bytes as a Uint8Array buffer to data URL.
 *
 * Adapted from:
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64#converting_arbitrary_binary_data
 *
 * @param bytes The bytes to convert to a data URL
 * @param type The MIME type of the data
 * @returns The bytes in the form of a data URL
 */
export const bytesToDataUrl = async (
  bytes: Uint8Array,
  type = 'application/octet-stream'
): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result as string),
      onerror: () => reject(reader.error),
    });
    reader.readAsDataURL(new File([bytes as BlobPart], '', { type }));
  });
};

/** Converts data URL to bytes as a Uint8Array buffer
 *
 * Adapted from:
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64#converting_arbitrary_binary_data
 *
 * @param dataUrl The data URL to convert to a Uint8array
 * @returns The data contained within the data URL as a Uint8Array buffer
 */
export const dataUrlToBytes = async (dataUrl: string) => {
  const res = await fetch(dataUrl);
  return new Uint8Array(await res.arrayBuffer());
};

/** Converts the given number in decimal form into a its equivalent form denominated in "base units"
 * using the given maximum number of decimal places the given decimal number is supposed to have.
 * This function is the inverse of `baseUnitsToDecimals()`.
 *
 * Examples:
 * - number = 25, decimal places = 0 --> '25'
 * - number = '.0025', decimal places = 3 --> '2'
 * - number = 1, decimal places = 2 --> '100'
 * - number = '0', decimal places = 10 --> '0'
 *
 * @param decimalNum Number in decimal form that is to be converted to base units
 * @param decimalPlaces Maximum number of decimal places the given decimal number is supposed to
 *                      have. Used to determine the representation of the given decimal number in
 *                      base units.
 * @returns Representation of the given decimal number denominated in base units. Always a positive
 *          integer. May be a huge number that is too large to represent accurately as a `number`;
 *          in which case, a `BigInt` or a string must be used to represent the huge number.
 */
export const decimalToBaseUnits = (
  decimalNum: number | string = '', decimalPlaces: number = 0
): string => {
  // Trim leading zeros
  let trimmed = `${decimalNum}`.replace(/^0+/, '');
  let decimalIndex = trimmed.indexOf('.');
  // Normalize the given decimal number by adding a decimal at the end if the given number did not
  // have one
  if (decimalIndex === -1) {
    decimalIndex = trimmed.length;
    trimmed += '.';
  };

  // Get the left side of the decimal (integer part)
  const leftSide = trimmed.slice(0, decimalIndex);
  // If there are supposed to be no decimal places, then return only the left side. Add zero if left
  // side is empty
  if (decimalPlaces === 0) return (leftSide === '' ? '0' : leftSide);

  // Get the right side of the decimal (fraction part), pad the end with zeros, and cut off extra
  // decimal places
  const rightSide = trimmed
    .slice(decimalIndex + 1)
    .padEnd(decimalPlaces, '0')
    .slice(0, decimalPlaces);

  // Combine the left side and the right side and trim leading zeros again because the right side
  // may have had leading 0s with no left side
  const resultInBaseUnits = (leftSide + rightSide).replace(/^0+/, '');

  // The second trim may result in an empty string if the right side is all zeros and there is no
  // left side, so output a zero if the string is empty
  return resultInBaseUnits === '' ? '0' : resultInBaseUnits;
};

/** Converts the given number denominated in "base units" in to its equivalent decimal form using
 * the given maximum number of decimal places the number in decimal form is supposed to have. This
 * function is the inverse of `decimalToBaseUnits()`.
 *
 * Examples:
 * - number = 25, decimal places = 0 --> '25'
 * - number = 2500, decimal places = 3 --> '2.5'
 * - number = '00001', decimal places = 1 --> '0.1'
 * - number = '0', decimal places = 10 --> '0'
 *
 * @param baseUnitsNum Number in base units that is to be convert to decimal form
 * @param decimalPlaces Maximum number of decimal places the output decimal number is supposed to
 *                      have. Used to determine the form of the output decimal number.
 * @returns Decimal form of the given number denominated in base units.
 */
export const baseUnitsToDecimal = (
  baseUnitsNum: number | string = '', decimalPlaces: number = 0
): string => {
  // Pad with leading zeros, if number is too short
  const paddedNum = `${baseUnitsNum}`.padStart(decimalPlaces, '0');
  // Extract the left side of the decimal (integer part)
  const leftSide = paddedNum.slice(0, paddedNum.length - decimalPlaces);
  // Extract the right side of the decimal (fraction part)
  const rightSide = paddedNum.slice(paddedNum.length - decimalPlaces);
  // Combine the two sides and trim any leading and trailing zeros
  let resultInDecimal = (leftSide + '.' + rightSide).replace(/^0+/, '').replace(/0+$/, '');

  // If the resulting number is a fraction (< 1), then add a leading zero for the left side
  if (resultInDecimal[0] === '.') resultInDecimal = '0' + resultInDecimal;

  // Trim trailing periods
  return resultInDecimal.replace(/\.+$/, '');
};

/** Removes all characters that are not numbers (0-9) from the given text
 * @param text Text in which all non-numerical characters will be removed
 * @returns The text with all non-numerical characters removed
 */
export const removeNonNumericalChars = (text: string) => text.replace(/[^0-9]/gm, '');

/** Removes all characters that are not numbers (0-9) or a decimal (.) from the given text
 * @param text Text in which all non-numerical characters will be removed
 * @returns The text with all non-numerical characters removed
 */
export const removeNonNumericalDecimalChars = (text: string) => text.replace(/[^0-9.]/gm, '');

/** Converts the given file's contents to bytes as a Uint8Array buffer
 * @param file The file to convert to bytes
 * @returns The file's contents as a Uint8Array buffer
 */
export const fileToBytes = async (file: File) => {
  const fileData = await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result),
      onerror: () => reject(reader.error),
    });
    reader.readAsArrayBuffer(file);
  });
  return new Uint8Array(fileData as ArrayBuffer);
};

/** Check if the Algod node server with the given configuration is working
 * @param token Algod node server token
 * @param url Algod node server URL
 * @param port Algod node server port
 * @param headers Algod node server headers
 * @returns
 */
export const isAlgodOK = async (
  token: string | AlgodTokenHeader | CustomTokenHeader | BaseHTTPClient,
  url: string,
  port?: number | string,
  headers?: Record<string, string>
) => {
  try {
    const algod = new Algodv2(token, url, port, headers);
    await algod.ready().do();
  } catch {
    return false;
  }
  return true;
};

/** Calculate base URL for metadata purposes. This is similar to what Next.js does by default if the
 * metadata base is not specified.
 */
export const getMetadataBase = () => {
  // If the base URL environment variable is specified
  if (process.env.BASE_URL) return `https://${process.env.BASE_URL}`;
  // If using Vercel hosting
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Otherwise, assume localhost as the metadata base URL
  return `http://localhost:${process.env.PORT || 3000}`;
};

/** Save the user's theme preference and apply it
 * @param themeName The name of the theme to apply
 * @param setThemeFn Function for updating the theme value. The given function can accept the theme
 *                   name as a parameter
 * @param notifyFn Function for notifying the user that the theme has been changed. If no function
 *                 is given, the user will not be notified.
 */
export function applyTheme(
  themeName: Themes | '',
  setThemeFn: (theme: Themes | '') => void,
  notifyFn?: () => void
) {
  // Update theme value
  setThemeFn(themeName);

  const htmlElem = document.querySelector('html');

  if (themeName) {
    // Apply the theme
    // NOTE: If there are significant changes to the following line, update the script in the
    //`<head>` if necessary */
    htmlElem!.dataset.theme = themeName;
  } else {
    // Unset the `data-theme` attribute if the theme is to be automatic
    delete htmlElem!.dataset.theme;
  }

  // Notify user (if the user should be notified)
  if (notifyFn) notifyFn();
};

/** Validation error message */
export type ValidationMessage = {
  /** Translation key for the validation message */
  key: string,
  /** Dictionary containing values the validation message needs */
  dict?: {[k: string]: any}
};

/** Type for validation atom */
export type validationAtom<T> = WritableAtom<any, [SetStateAction<T>], void>;
