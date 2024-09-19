/**
 * @file Sets up the polyfills for TextEncoder and TextDecoder because jest/js-dom does not include
 * them. This is for unit tests only.
 */

/* Polyfill for TextEncoder, TextDecoder and the Uint8Array they use */
import { TextEncoder, TextDecoder } from 'node:util';
window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder;
// NOTE: For some reason, the Uint8Array class that the polyfills use is different from the actual
// Uint8Array class, so polyfilling Uint8array is necessary too
window.Uint8Array = (new TextEncoder).encode().constructor;
