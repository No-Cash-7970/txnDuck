<!-- omit in toc -->
# URL Parameters For Making Shareable Links

<!-- omit in toc -->
## Table of contents

- [Setting node network](#setting-node-network)
- [Compose Transaction page links](#compose-transaction-page-links)
  - [All presets](#all-presets)
  - ["Transfer Algos" preset](#transfer-algos-preset)
  - ["Rekey account" preset](#rekey-account-preset)
  - ["Close account" preset](#close-account-preset)
  - ["Transfer asset" preset](#transfer-asset-preset)
  - ["Opt into asset" preset](#opt-into-asset-preset)
  - ["Opt out of asset" preset](#opt-out-of-asset-preset)
  - ["Revoke (Claw back) asset" preset](#revoke-claw-back-asset-preset)
  - ["Create asset" preset](#create-asset-preset)
  - ["Reconfigure asset" preset](#reconfigure-asset-preset)
  - ["Destroy asset" preset](#destroy-asset-preset)
  - ["Freeze asset" preset](#freeze-asset-preset)
  - ["Unfreeze asset" preset](#unfreeze-asset-preset)
  - ["Run application" preset](#run-application-preset)
  - ["Opt into application" preset](#opt-into-application-preset)
  - ["Deploy application" preset](#deploy-application-preset)
  - ["Update application" preset](#update-application-preset)
  - ["Close out application" preset](#close-out-application-preset)
  - ["Clear application" preset](#clear-application-preset)
  - ["Delete application" preset](#delete-application-preset)
  - ["Register account online" preset](#register-account-online-preset)
  - ["Register account offline" preset](#register-account-offline-preset)
  - ["Register account nonparticipating" preset](#register-account-nonparticipating-preset)
- [Helpful tips](#helpful-tips)
- [Example links](#example-links)
  - [Example 1: Tip the developer 1 Algo :wink:](#example-1-tip-the-developer-1-algo-wink)
  - [Example 2: Tip the developer 1 USDC :wink:](#example-2-tip-the-developer-1-usdc-wink)
  - [Example 3: Set up a transfer of 1 USDC](#example-3-set-up-a-transfer-of-1-usdc)
  - [Example 4: Set up a transaction for an account to opt into USDC](#example-4-set-up-a-transaction-for-an-account-to-opt-into-usdc)
  - [Example 5: Set up a transaction for closing an account](#example-5-set-up-a-transaction-for-closing-an-account)
  - [Example 6: Register account as "online"](#example-6-register-account-as-online)
  - [Example 7: Register account as "offline"](#example-7-register-account-as-offline)
  - [Example 8: Setting up a transfer with only the first valid round set](#example-8-setting-up-a-transfer-with-only-the-first-valid-round-set)
  - [Example 9: Setting up a transfer with the first and last valid rounds set](#example-9-setting-up-a-transfer-with-the-first-and-last-valid-rounds-set)
  - [Example 10: Gracefully opt out of an application (smart contract)](#example-10-gracefully-opt-out-of-an-application-smart-contract)

## Setting node network

Use the `network` URL query parameter to share a link that sets the network. Setting the `network` URL query parameter switches the currently used network to the one specified. It does not change any of the custom node settings. The new network is used until the user switches the network themself (using the network-switch button at the top of every page) or `network` in the URL is set to a different network.

The `network` URL query parameter can be set to one of the following networks:

- MainNet (`mainnet`)
- TestNet (`testnet`)
- BetaNet (`betanet`)
- Voi TestNet (`voi_testnet`)
- Sandbox (`sandbox`)

## Compose Transaction page links

URL query parameters can be used to create a link to the "Compose Transaction" page with some of the transaction fields already filled in. These URL query parameters only work when using a preset.

General notes:

- All URL query parameter values must be URL encoded
- Numbers must be in English format, even if the page is in a non-English language
  - Example: `0,002` (a format in some languages) will not work. Must use `0.002` instead.
- Numbers must not contain commas

### All presets

- Sender address (`snd`)
- Fee (in Algos) (`fee`)
- Note (`note`)
- First valid round (`fv`)
- Last valid round (`lv`)
<!-- - Base64 note? (`b64_note`) -->

Notes:

- If the first valid round (`fv`) is set to a nonempty value and the last valid round (`lv`) is not set, the last valid round will automatically be set to 1,000 rounds *after* the first valid round.
- If the last valid round (`lv`) is set to a nonempty value and the first valid round (`fv`) is not set, the first valid round will automatically be set to 1,000 rounds *before* the last valid round.

### "Transfer Algos" preset

`preset=transfer` or `preset=transfer_algos`

- Receiver address (`rcv`)
- Amount (in Algos) (`amt`)

### "Rekey account" preset

`preset=rekey_account`

- *No extra URL query parameters*

### "Close account" preset

`preset=close_account`

- *No extra URL query parameters*

### "Transfer asset" preset

`preset=asset_transfer`

- Asset ID (`xaid`)
- Receiver address (`arcv`)
- Amount (`aamt`)

Notes:

- The receiver address (`arcv`) and the amount (`aamt`) are ignored if no asset ID (`xaid`) is given

### "Opt into asset" preset

`preset=asset_opt_in`

- Asset ID (`xaid`)

### "Opt out of asset" preset

`preset=asset_opt_out`

- Asset ID (`xaid`)

### "Revoke (Claw back) asset" preset

`preset=asset_clawback`

- Asset ID (`xaid`)

### "Create asset" preset

`preset=asset_create`

- *No extra URL query parameters*

### "Reconfigure asset" preset

`preset=asset_reconfig`

- Asset ID (`caid`)

### "Destroy asset" preset

`preset=asset_destroy`

- Asset ID (`caid`)

### "Freeze asset" preset

`preset=asset_freeze`

- Asset ID (`faid`)
- Freeze target (`fadd`)

### "Unfreeze asset" preset

`preset=asset_unfreeze`

- Asset ID (`faid`)
- Freeze (unfreeze) target (`fadd`)

### "Run application" preset

`preset=app_run`

- Application ID (`apid`)

### "Opt into application" preset

`preset=app_opt_in`

- Application ID (`apid`)

### "Deploy application" preset

`preset=app_deploy`

- *No extra URL query parameters*

### "Update application" preset

`preset=app_update`

- Application ID (`apid`)

### "Close out application" preset

`preset=app_close`

- Application ID (`apid`)

### "Clear application" preset

`preset=app_clear`

- Application ID (`apid`)

### "Delete application" preset

`preset=app_delete`

- Application ID (`apid`)

### "Register account online" preset

`preset=reg_online`

- Voting key (`votekey`)
- Selection key (`selkey`)
- State proof key (`sprfkey`)
- First voting round (`votefst`)
- Last voting round (`votelst`)
- Voting key dilution (`votekd`)

### "Register account offline" preset

`preset=reg_offline`

- *No extra URL query parameters*

### "Register account nonparticipating" preset

`preset=reg_nonpart`

- *No extra URL query parameters*

## Helpful tips

- Pay attention to the the casing of the URL parameters and their values. They are case-sensitive.
- Although specifying a network is optional, it is best to specify the network for [Compose Transaction page links](#compose-transaction-page-links), especially for a transaction like an asset transfer transaction where it may not work if using the wrong network.

## Example links

### Example 1: Tip the developer 1 Algo :wink:

- Network: MainNet
- Sender: *To be filled in by user*
- Receiver: OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY
- Amount: 1 Algo
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*
- Note: `A small tip for No-Cash-7970 :)`

<https://txnduck.vercel.app/txn/compose?network=mainnet&preset=transfer&rcv=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY&amt=1&note=A+small+tip+for+No-Cash-7970+%3A%29>

### Example 2: Tip the developer 1 USDC :wink:

- Network: MainNet
- Sender: *To be filled in by user*
- Receiver: OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY
- Asset ID: 31566704 (USDC)
- Amount: 1 USDC
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?network=mainnet&preset=asset_transfer&xaid=31566704&aamt=1&arcv=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY>

### Example 3: Set up a transfer of 1 USDC

- Network: MainNet
- Sender: *To be filled in by user*
- Receiver: *To be filled in by user*
- Asset ID: 31566704 (USDC)
- Amount: 1 USDC
- Fee: 0.001 Algos

<https://txnduck.vercel.app/txn/compose?network=mainnet&preset=asset_transfer&xaid=31566704&aamt=1&fee=0.001>

### Example 4: Set up a transaction for an account to opt into USDC

- Network: MainNet
- Sender (the account opting in): 7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M
- Asset ID: 31566704 (USDC)
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?network=mainnet&preset=asset_opt_in&xaid=31566704&snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M>

### Example 5: Set up a transaction for closing an account

- Network: *Whatever is currently selected by user*
- Sender (the account to be closed): 7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M
- Close remainder to: *Cannot be set as a URL query parameter for safety reasons, so it must be filled in by the user*
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?preset=close_account&snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M>

### Example 6: Register account as "online"

Note how the keys are URL encoded.

- Network: TestNet
- Sender (the account to be registered as "online"): MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4
- Voting key: 87iBW46PP4BpTDz6+IEGvxY6JqEaOtV0g+VWcJqoqtc=
- Selection key: 1V2BE2lbFvS937H7pJebN0zxkqe1Nrv+aVHDTPbYRlw=
- State proof key: f0CYOA4yXovNBFMFX+1I/tYVBaAl7VN6e0Ki5yZA3H6jGqsU/LYHNaBkMQ/rN4M4F3UmNcpaTmbVbq+GgDsrhQ==
- First voting round: 16532750
- Last voting round: 19532750
- Voting key dilution: 1732
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?network=testnet&preset=reg_online&snd=MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4&votekey=87iBW46PP4BpTDz6%2BIEGvxY6JqEaOtV0g%2BVWcJqoqtc%3D&selkey=1V2BE2lbFvS937H7pJebN0zxkqe1Nrv%2BaVHDTPbYRlw%3D&sprfkey=f0CYOA4yXovNBFMFX%2B1I%2FtYVBaAl7VN6e0Ki5yZA3H6jGqsU%2FLYHNaBkMQ%2FrN4M4F3UmNcpaTmbVbq%2BGgDsrhQ%3D%3D&votefst=16532750&votelst=19532750&votekd=1732>

### Example 7: Register account as "offline"

- Network: TestNet
- Sender (the account to be registered as "offline"): MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?network=testnet&preset=reg_offline&snd=MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4>

### Example 8: Setting up a transfer with only the first valid round set

- Network: *Whatever is currently selected by user*
- Sender: *To be filled in by user*
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*
- First valid round: 41922740
- Last valid round: *Set automatically to 41923740 (1,000 rounds after the first valid round)*

<https://txnduck.vercel.app/txn/compose?preset=transfer&fv=41922740>

### Example 9: Setting up a transfer with the first and last valid rounds set

- Network: *Whatever is currently selected by user*
- Sender: *To be filled in by user*
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*
- First valid round: 41922740
- Last valid round: *Empty*

<https://txnduck.vercel.app/txn/compose?preset=transfer&fv=41922740&lv=>

### Example 10: Gracefully opt out of an application (smart contract)

- Network: MainNet
- Sender: 7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M
- Application ID: 1284326447 (Application for [Oranges on MainNet](https://oranges.meme/#/mainnet))
- Application arguments: *To be filled in by user if needed*
- Fee: *Calculated automatically by default (Usually 0.001 Algos)*

<https://txnduck.vercel.app/txn/compose?network=mainnet&preset=app_close&apid=1284326447&snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M>
