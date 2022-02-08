# ![AlgoSigner](media/algosigner-wallet-banner-3.png)

An open-source, security audited, Algorand wallet browser extension that lets users approve and sign transactions that are generated by Algorand dApp applications — available for Chrome.

## Chrome Extension Store

The extension is available on the [Chrome Extension Store](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm)

_This is the preferred solution for end-users, updates will be automatically installed after review by the extension store_

Developers working with dApps may also install directly from the release package, or by downloading the project and building it.

# As of release 1.7.0, AlgoSigner no longer supports incomplete atomic groups signing.

## 1.7.0 Release

### Functionality updates
As part of maintaining the standards set by the Algorand Foundation, we've begun to deprecate some of the older signing methods provided by AlgoSigner.
- Incomplete atomic groups signing is no longer supported.
- v1 Signing (`AlgoSigner.sign()` && `AlgoSigner.multisign()`) will stop being supported in the next major release.
- Preliminary error codes were added to all of the errors that AlgoSigner could provide.

Other changes
- A developer-oriented `Clear Cache` button was added to the Settings menu to help out with certain issues
- Fixed account name sometimes not being visible during signing.
- When signing more than one group of transactions, there's now an Indicator on which group you're currently signing.

### 1.7.1 Patch

- Added support for saving addresses as 'Contacts' for easier re-use
- Added support for importing more than one address from a same ledger device

### 1.7.2 Patch

- Added support for Opting-out of ASAs from the UI
- New Account Details page
- Added Tooltip with Pending Rewards

## New Users

- Watch [Getting Started with AlgoSigner](https://youtu.be/tG-xzG8r770)
- [Ledger Readme](docs/ledger.md)

## Adding Custom Networks

AlgoSigner users may add their own networks to the extension, for example BetaNet or the sandbox private network - [Instructions](docs/add-network.md)

## dApp Developers

For teams looking to integrate AlgoSigner into a project:

Developing with v2 Transaction Signing

- [dApp development guide](docs/dApp-guide.md)
- [v2 AlgoSigner methods](docs/dApp-integration.md)

Legacy v1 Transaction Signing is going to be deprecated soon and is available only for reference purposes.
Please use v2 when developing new apps and migrate existing apps that are still using v1 to v2 as soon as possible.

- [v1 Guide](docs/legacy-signing.md)
- [v1 AlgoSigner methods](docs/legacy-dApp-integration.md)

## Roadmap

- UI improvements
- Contribution guidelines

### AlgoSigner development

For developers interested in working with AlgoSigner [Extension Guide](docs/extension-developers.md). A contribution guide is in development.

## License

This project is under the MIT License
