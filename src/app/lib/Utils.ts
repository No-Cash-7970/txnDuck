/** Converts bytes as an Uint8Array buffer to base64
 *
 * Adapted from:
 * https://developer.mozilla.org/en-US/docs/Glossary/Base64#converting_arbitrary_binary_data
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
