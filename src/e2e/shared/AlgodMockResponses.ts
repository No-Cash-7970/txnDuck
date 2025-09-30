/** @file Test Algod node responses used to mock responses to requests */

import { type Page } from "@playwright/test";
import { stringifyJSON } from "algosdk";

/* NOTE:
 * All test responses should be the exact data of actual responses from a node. Using the exact data
 * makes the mock responses as close to what would happen in production as much as possible.
 */

// GET /v2/assets/31566704 on mainnet
export const usdcAsset = stringifyJSON({
  index: 31566704,
  params: {
    creator: "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM",
    decimals: 6,
    "default-frozen": false,
    freeze: "3ERES6JFBIJ7ZPNVQJNH2LETCBQWUPGTO4ROA6VFUR25WFSYKGX3WBO5GE",
    manager: "37XL3M57AXBUJARWMT5R7M35OERXMH3Q22JMMEFLBYNDXXADGFN625HAL4",
    name: "USDC",
    "name-b64": "VVNEQw==",
    reserve: "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM",
    total: BigInt('18446744073709551615'),
    "unit-name": "USDC",
    "unit-name-b64": "VVNEQw==",
    url: "https://www.centre.io/usdc",
    "url-b64":"aHR0cHM6Ly93d3cuY2VudHJlLmlvL3VzZGM="
  }
});

// GET /v2/transactions/params on testnet
export const suggParams = JSON.stringify({
  // eslint-disable-next-line @stylistic/max-len
  "consensus-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  "fee": 0,
  "genesis-hash": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
  "genesis-id": "testnet-v1.0",
  "last-round": 44440857,
  "min-fee": 1000
});

// POST /v2/transactions on testnet
export const sendTxn = JSON.stringify({
  "txId": "NC63ESPZOQI6P6DSVZWG5K2FJFFKI3VAZITE5KRW5SV5GXQDIXMA"
});

// GET /v2/status on testnet
export const nodeStatus = JSON.stringify({
  "catchpoint": "",
  "catchpoint-acquired-blocks": 0,
  "catchpoint-processed-accounts": 0,
  "catchpoint-processed-kvs": 0,
  "catchpoint-total-accounts": 0,
  "catchpoint-total-blocks": 0,
  "catchpoint-total-kvs": 0,
  "catchpoint-verified-accounts": 0,
  "catchpoint-verified-kvs": 0,
  "catchup-time": 0,
  "last-catchpoint": "",
  "last-round": 44440860,
  // eslint-disable-next-line @stylistic/max-len
  "last-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  // eslint-disable-next-line @stylistic/max-len
  "next-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  "next-version-round": 44440861,
  "next-version-supported": true,
  "stopped-at-unsupported-round": false,
  "time-since-last-round": 1753631441
});

// GET /v2/transactions/pending/NC63ESPZOQI6P6DSVZWG5K2FJFFKI3VAZITE5KRW5SV5GXQDIXMA?format=msgpack
// content-type: application/msgpack
// on testnet
export const pendingTxn1 = Buffer.from(
  // eslint-disable-next-line @stylistic/max-len
  'gqpwb29sLWVycm9yoKN0eG6Co3NpZ8RAiG8Nhiruhncf2es5ozYnVfiFY4EAvLiGODPZf2n0eI4X1VtBZScF+3WQwn2RsIkdMyHbG0FNb5sQ93R03WTgAqN0eG6Io2ZlZc0D6KJmds4Cph0Zo2dlbqx0ZXN0bmV0LXYxLjCiZ2jEIEhjtRiks8hOyBDyLU8QgcsPcfBZp6wg3sYvf3DlCToiomx2zgKmIQGjcmN2xCDZdlfb2YQwPyRi+VSoHaataICjLqI7Z8kkOGIA5HFvlqNzbmTEINl2V9vZhDA/JGL5VKgdpq1ogKMuojtnySQ4YgDkcW+WpHR5cGWjcGF5',
  'base64'
);

// GET /v2/transactions/pending/NC63ESPZOQI6P6DSVZWG5K2FJFFKI3VAZITE5KRW5SV5GXQDIXMA?format=msgpack
// content-type: application/msgpack
// on testnet
export const pendingTxn2 = Buffer.from(
  // eslint-disable-next-line @stylistic/max-len
  'g69jb25maXJtZWQtcm91bmTOAqYdHqpwb29sLWVycm9yoKN0eG6Co3NpZ8RAiG8Nhiruhncf2es5ozYnVfiFY4EAvLiGODPZf2n0eI4X1VtBZScF+3WQwn2RsIkdMyHbG0FNb5sQ93R03WTgAqN0eG6Io2ZlZc0D6KJmds4Cph0Zo2dlbqx0ZXN0bmV0LXYxLjCiZ2jEIEhjtRiks8hOyBDyLU8QgcsPcfBZp6wg3sYvf3DlCToiomx2zgKmIQGjcmN2xCDZdlfb2YQwPyRi+VSoHaataICjLqI7Z8kkOGIA5HFvlqNzbmTEINl2V9vZhDA/JGL5VKgdpq1ogKMuojtnySQ4YgDkcW+WpHR5cGWjcGF5',
  'base64'
);

// GET /v2/status/wait-for-block-after/44440861
export const waitForBlock = JSON.stringify({
  "catchpoint": "",
  "catchpoint-acquired-blocks": 0,
  "catchpoint-processed-accounts": 0,
  "catchpoint-processed-kvs": 0,
  "catchpoint-total-accounts": 0,
  "catchpoint-total-blocks": 0,
  "catchpoint-total-kvs": 0,
  "catchpoint-verified-accounts": 0,
  "catchpoint-verified-kvs": 0,
  "catchup-time": 0,
  "last-catchpoint": "",
  "last-round": 44440862,
  // eslint-disable-next-line @stylistic/max-len
  "last-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  // eslint-disable-next-line @stylistic/max-len
  "next-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  "next-version-round": 44440863,
  "next-version-supported": true,
  "stopped-at-unsupported-round": false,
  "time-since-last-round": 567756
});

/** Mock the responses to a series of Algod requests for sending a simple transaction. The mocked
 * responses are actual responses from an Algod node when sending a real transaction on TestNet.
 *
 * Mocking the responses of an Algod node makes the tests more consistent, puts less strain on an
 * actual Algod node, and removes the requirement of a real Algod node being available before
 * running the tests.
 *
 * NOTE: For the mocked responses to work, this function must be run after the page is loaded (e.g.
 * after `page.goto("/")`).
 */
export async function mockTxnAlgodResponses(page: Page) {
  await page.route('*/**/v2/transactions/params', async route => {
    await route.fulfill({ body: suggParams, contentType: 'application/json' });
  });

  await page.route('*/**/v2/transactions', async (route, request) => {
    if (request.method() === 'OPTIONS') {
      await route.fulfill();
    } else {
      await route.fulfill({ body: sendTxn, contentType: 'application/json' });
    }
  });

  await page.route('*/**/v2/status', async route => {
    await route.fulfill({ body: nodeStatus, contentType: 'application/json' });
  });

  let pendingTxnCount = 0;
  await page.route('*/**/v2/transactions/pending/*', async route => {
    if (pendingTxnCount === 0) { // First time
      await route.fulfill({ body: pendingTxn1, contentType: 'application/msgpack' });
      pendingTxnCount++;
    } else { // Second time
      await route.fulfill({ body: pendingTxn2, contentType: 'application/msgpack' });
    }
  });

  await page.route('*/**/v2/status/wait-for-block-after/*', async route => {
    await route.fulfill({ body: waitForBlock, contentType: 'application/json' });
  });
}
