import { WalletStorage } from '@voisigner/common/types';
import { Network, NetworkTemplate } from '@voisigner/common/types/network';

// Key and value must match in this enum so we
// can compare its existance with i.e. "TestNet" in SupportedLedger
/* eslint-disable no-unused-vars */

export enum Backend {
  PureStake = 'PureStake',
  Algod = 'Algod',
}

export enum API {
  Algod = 'Algod',
  Indexer = 'Indexer',
}

export interface Cache {
  /*
    assets: {
        network: [
            assetId: {
                ...
            },
            ...
        ],
        ...
    },
    accounts: {
        network: [
            address: {
                ...
            },
            ...
        ],
        ...
    },
    availableLedgers: [
      {
        ...
      }
    ],
  */
  assets: object;
  accounts: object;
  network: Network;
  // Legacy name, renaming could break stored caches
  availableLedgers: Array<NetworkTemplate>;
}
