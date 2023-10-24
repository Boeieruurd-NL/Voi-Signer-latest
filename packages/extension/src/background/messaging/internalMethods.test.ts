import { JsonRpcMethod } from '@algosigner/common/messaging/types';
import { Network } from '@algosigner/common/types/network';
import encryptionWrap from '../encryptionWrap';
import { InternalMethods } from './internalMethods';
import algosdk from 'algosdk';

import fetch from 'node-fetch';

if (!global.fetch) {
  global.fetch = fetch;
}

jest.mock('../encryptionWrap');

//@ts-ignore
global.chrome.runtime = {
  id: 'eecmbplnlbmoeihkjdebklofcmfadjgd',
};

const testImportAccount = {
  name: 'Imported account',
  address: 'RCWKH27QBUZSE5B5BRR4KY6J4FHZB6GMY3ZYHFL2ER43ETTGBQCJGRNH7A',
  mnemonic:
    'comfort horse pet soft direct okay brown vacuum squeeze real debate either text insane flash dinosaur insane lion heavy actor frost glove tackle absent amateur',
};

describe('testing GetSessions', () => {
  test("should return doesn't exist when empty storage", () => {
    const method = JsonRpcMethod.GetSession;
    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {},
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        checkStorage: (cb) => cb(false),
      };
    });

    InternalMethods[JsonRpcMethod.GetSession](request, sendResponse);

    expect(sendResponse).toHaveBeenCalledWith({ exist: false });
  });

  test('should return exist when storage exist', () => {
    const method = JsonRpcMethod.GetSession;
    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {},
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        checkStorage: (cb) => cb(true),
      };
    });

    InternalMethods[JsonRpcMethod.GetSession](request, sendResponse);

    expect(sendResponse).toHaveBeenCalledWith({ exist: true });
  });
});

describe('wallet flow', () => {
  test('a wallet can be created', () => {
    const method = JsonRpcMethod.CreateWallet;
    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {},
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        lock: (wallet, cb) => cb(true),
      };
    });

    InternalMethods[JsonRpcMethod.CreateWallet](request, sendResponse);

    expect(sendResponse).toHaveBeenCalledWith({
      availableNetworks: [
{
          algodUrl: undefined,
          genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
          genesisID: 'voitest-v1',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'VoiTestNet',
          symbol: undefined,
        },
        {
          algodUrl: undefined,
          genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
          genesisID: 'mainnet-v1.0',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'MainNet',
          symbol: undefined,
        },
        {
          algodUrl: undefined,
          genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
          genesisID: 'testnet-v1.0',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'TestNet',
          symbol: undefined,
        },
      ],
      network: Network.VoiTestNet,
      wallet: {
        VoiTestNet: [],
        TestNet: [],
        MainNet: [],
      },
    });
  });

  test('after wallet creation, getSession should return wallet', () => {
    const method = JsonRpcMethod.GetSession;
    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {},
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    const sessionObject = {
      availableNetworks: [
{
          algodUrl: undefined,
          genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
          genesisID: 'voitest-v1',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'VoiTestNet',
          symbol: undefined,
        },
        {
          algodUrl: undefined,
          genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
          genesisID: 'mainnet-v1.0',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'MainNet',
          symbol: undefined,
        },
        {
          algodUrl: undefined,
          genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
          genesisID: 'testnet-v1.0',
          headers: undefined,
          indexerUrl: undefined,
          isEditable: false,
          name: 'TestNet',
          symbol: undefined,
        },
      ],
      network: Network.VoiTestNet,
      wallet: {
        TestNet: [],
        MainNet: [],
        VoiTestNet: [],
      },
    };

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        checkStorage: (cb) => cb(true),
      };
    });

    InternalMethods[JsonRpcMethod.GetSession](request, sendResponse);

    expect(sendResponse).toHaveBeenCalledWith({ exist: true, session: sessionObject });
  });

  test('a TestNet account can be added', () => {
    const method = JsonRpcMethod.SaveAccount;
    const keys = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(keys.sk);

    const account = {
      name: 'Test account',
      address: keys.addr,
    };

    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {
          ...account,
          mnemonic: mnemonic,
          ledger: Network.TestNet,
        },
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        lock: (wallet, cb) => cb(true),
        unlock: (cb) =>
          cb({
            TestNet: [],
            MainNet: [],
            VoiTestNet: [],
          }),
        checkStorage: (cb) => cb(true),
      };
    });

    InternalMethods[method](request, sendResponse);

    const wallet = {
      VoiTestNet: [],
      TestNet: [account],
      MainNet: [],
    };

    expect(sendResponse).toHaveBeenCalledWith(wallet);
  });

  test('a TestNet account can be imported', () => {
    const method = JsonRpcMethod.ImportAccount;

    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {
          name: testImportAccount.name,
          mnemonic: testImportAccount.mnemonic,
          ledger: Network.TestNet,
        },
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        lock: (wallet, cb) => cb(true),
        unlock: (cb) =>
          cb({
            VoiTestNet: [],
            TestNet: [],
            MainNet: [],
          }),
        checkStorage: (cb) => cb(true),
      };
    });

    InternalMethods[method](request, sendResponse);

    const wallet = {
      TestNet: [
        {
          name: testImportAccount.name,
          address: testImportAccount.address,
        },
      ],
      MainNet: [],
      VoiTestNet: [],
    };

    expect(sendResponse).toHaveBeenCalledWith(wallet);
  });

  test('a TestNet account can be deleted', () => {
    const method = JsonRpcMethod.DeleteAccount;

    const request = {
      source: 'ui',
      body: {
        jsonrpc: '2.0',
        method: method,
        params: {
          address: testImportAccount.address,
          ledger: Network.TestNet,
        },
        id: '17402bbaa89',
      },
    };
    const sendResponse = jest.fn();

    //@ts-ignore
    encryptionWrap.mockImplementationOnce(() => {
      return {
        lock: (wallet, cb) => cb(true),
        unlock: (cb) =>
          cb({
            TestNet: [
              {
                ...testImportAccount,
              },
            ],
            MainNet: [],
            VoiTestNet: [],
          }),
        checkStorage: (cb) => cb(true),
      };
    });

    InternalMethods[method](request, sendResponse);

    const wallet = {
      TestNet: [],
      MainNet: [],
      VoiTestNet: [],
    };

    expect(sendResponse).toHaveBeenCalledWith(wallet);
  });
});

