# ![AlgoSigner](media/algosigner-wallet-banner-3.png)

An open-source, security audited, Algorand wallet browser extension that lets users approve and sign transactions that are generated by Algorand dApp applications — available for Chrome.

## Chrome Extension Store

The extension is available on the [Chrome Extension Store](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm)

_This is the preferred solution for end-users, updates will be automatically installed after review by the extension store_

Developers working with dApps may also install directly from the release package, or by downloading the project and building it.

## `AlgoSigner.sign()` and `AlgoSigner.signMultisig()` have been officially deprecated.

An interactive transition guide is available [here](https://purestake.github.io/algosigner-dapp-example/v1v2TransitionGuide.html).

## 1.9.0 Release

### Main updates
This update adds supports for easier transfers with the new autocomplete feature. Start typing an account or contact name on the destination field when sending Algos or ASAs and you'll be able to select the desired address from a dropdown. This also marks the end of the support of the older signing methods that were previously available.
- Autocomplete support for UI-made transfers
- `AlgoSigner.sign()` and `AlgoSigner.signMultisig()` have been deprecated

## New Users

- Watch [Getting Started with AlgoSigner](https://youtu.be/tG-xzG8r770)
- [Using a Ledger device](docs/ledger.md)
- [Adding Custom Networks](docs/add-network.md) (such as BetaNet or a private network)
- [Troubleshooting Connection issues](docs/connection-issues.md)

## dApp Developers

For teams looking to integrate AlgoSigner into a project:

- [dApp Development guide](docs/dApp-guide.md)
- [AlgoSigner dApp Integration Guide](docs/dApp-integration.md)

## AlgoSigner development

For developers interested in working with AlgoSigner, an [Extension Guide](docs/extension-developers.md) is available. A contribution guide is in development.

## License

This project is under the MIT License
