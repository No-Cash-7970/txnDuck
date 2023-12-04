/** @file Collection of general-use utility functions */

/** Converts bytes as a Uint8Array buffer to data URL.
 * Adapted from:
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64#converting_arbitrary_binary_data
 *
 * @param bytes The bytes to convert to a data URL
 * @param type The MIME type of the data
 * @returns The bytes in the form of a data URL
 */
export const bytesToBase64DataUrl = async (
  bytes: Uint8Array,
  type = 'application/octet-stream'
): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = Object.assign(new FileReader(), {
      onload: () => resolve(reader.result as string),
      onerror: () => reject(reader.error),
    });
    reader.readAsDataURL(new File([bytes], '', { type }));
  });
};

/** Converts data URL to bytes as a Uint8Array buffer
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
