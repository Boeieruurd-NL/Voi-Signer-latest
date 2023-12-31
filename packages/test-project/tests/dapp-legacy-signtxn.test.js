/**
 * dapp e2e tests for the voisigner V2 Signing functionality
 *
 * @group dapp/legacy/signtxn
 */

const { accounts } = require('./common/constants');
const {
  openExtension,
  getPopup,
  getLedgerSuggestedParams,
  signDappTxnsWvoisigner,
  decodeBase64Blob,
  buildSdkTx,
  prepareWalletTx,
} = require('./common/helpers');
const { CreateWallet, ConnectWithvoisignerObject, ImportAccount } = require('./common/tests');

const msigAccount = accounts.multisig;
const account1 = msigAccount.subaccounts[0];
const account2 = msigAccount.subaccounts[1];

let ledgerParams;
let unsignedTransactions;
let msigTxn;

describe('Wallet Setup', () => {
  beforeAll(async () => {
    await openExtension();
  });

  CreateWallet();
  ConnectWithvoisignerObject();

  test('Get TestNet params', async () => {
    ledgerParams = await getLedgerSuggestedParams();
    const baseTxn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: msigAccount.address,
        to: msigAccount.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    const msigMetadata = {
      version: 1,
      threshold: 2,
      addrs: msigAccount.subaccounts.map((acc) => acc.address),
    };
    msigTxn = { ...baseTxn, msig: msigMetadata };
  });

  ImportAccount(account1);
  ImportAccount(account2);
});

describe('Txn Signing Validation errors', () => {
  // General validations
  test('Error on User signing refusal', async () => {
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    unsignedTransactions = [txn];

    await expect(
      dappPage.evaluate(async (transactions) => {
        const signPromise = voisigner.signTxn(transactions);
        await window.rejectSign();
        return Promise.resolve(signPromise)
          .then((data) => {
            return data;
          })
          .catch((error) => {
            return error;
          });
      }, unsignedTransactions)
    ).resolves.toMatchObject({
      message: expect.stringContaining('The extension user does not'),
      code: 4001,
    });
  });

  test('Error on Sender not imported to voisigner', async () => {
    const invalidAccount = accounts.ui.address;
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: invalidAccount,
        to: invalidAccount,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4100,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain(invalidAccount);
    expect(signResponse.data[0]).toContain('No matching account found');
  });

  // Signers validations
  test('Error on Empty signers for Single transactions', async () => {
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    txn.signers = [];
    unsignedTransactions = [txn];

    await expect(
      dappPage.evaluate((transactions) => {
        return Promise.resolve(voisigner.signTxn(transactions))
          .then((data) => {
            return data;
          })
          .catch((error) => {
            return error;
          });
      }, unsignedTransactions)
    ).resolves.toMatchObject({
      message: expect.stringContaining('There are no transactions to sign'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
    });
  });

  test('Error on Single signer not matching the sender', async () => {
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    txn.signers = [account2.address];
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain("a single-address 'signers' is provided");
  });

  test('Error on Single signer not matching authAddr', async () => {
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    txn.signers = [account1.address];
    txn.authAddr = account2.address;
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain("a single-address 'signers' is provided");
  });

  test('Error on Invalid signer address', async () => {
    const fakeAccount = 'THISSIGNERDOESNTEXIST';
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    txn.signers = [fakeAccount];
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain(`Signers array contains the invalid address "${fakeAccount}"`);
  });

  // AuthAddr validations
  test('Error on Invalid authAddr', async () => {
    const fakeAccount = 'THISAUTHADDRDOESNTEXIST';
    const txn = prepareWalletTx(
      buildSdkTx({
        type: 'pay',
        from: account1.address,
        to: account1.address,
        amount: Math.ceil(Math.random() * 1000),
        ...ledgerParams,
        fee: 1000,
      })
    );
    txn.authAddr = fakeAccount;
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain(`'authAddr' contains the invalid address "${fakeAccount}"`);
  });

  // Msig validations
  test('Error on Msig Signer not imported to voisigner', async () => {
    const invalidAccount = msigAccount.subaccounts[2].address;
    const txn = { ...msigTxn };
    txn.signers = [account1.address, invalidAccount];
    unsignedTransactions = [txn];

    const signResponse = await dappPage.evaluate((transactions) => {
      return Promise.resolve(voisigner.signTxn(transactions))
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return error;
        });
    }, unsignedTransactions);
    expect(signResponse).toMatchObject({
      message: expect.stringContaining('There was a problem validating the transaction(s) to be signed.'),
      code: 4300,
      name: expect.stringContaining('voisignerRequestError'),
      data: expect.anything(),
    });
    expect(signResponse.data).toHaveLength(1);
    expect(signResponse.data[0]).toContain(invalidAccount);
    expect(signResponse.data[0]).toContain('does not currently possess one of');
  });

  // // @TODO: Wallet Transaction Structure check tests
});

describe('Multisig Transaction Use cases', () => {
  test('Sign MultiSig Transaction with All Accounts', async () => {
    unsignedTransactions = [msigTxn];
    const signedTransactions = await signDappTxnsWvoisigner(unsignedTransactions, async () => {
      const popup = await getPopup();
      const tooltipText = await popup.evaluate(() => {
        return getComputedStyle(
          document.querySelector('[data-tooltip]'),
          '::before'
        ).getPropertyValue('content');
      });
      await expect(tooltipText).toContain('Multisignature');
    });

    // Verify signature is added
    const decodedTransaction = decodeBase64Blob(signedTransactions[0].blob);
    expect(decodedTransaction).toHaveProperty('txn');
    expect(decodedTransaction).toHaveProperty('msig');
    expect(decodedTransaction.msig).toHaveProperty('subsig');
    expect(decodedTransaction.msig.subsig).toHaveLength(3);
    expect(decodedTransaction.msig.subsig[0]).toHaveProperty('s');
    expect(decodedTransaction.msig.subsig[1]).toHaveProperty('s');
    expect(decodedTransaction.msig.subsig[2]).not.toHaveProperty('s');
  });

  test('Sign MultiSig Transaction with Specific Signer', async () => {
    unsignedTransactions[0].signers = [account1.address];
    const signedTransactions = await signDappTxnsWvoisigner(unsignedTransactions);

    // Verify correct signature is added
    const decodedTransaction = decodeBase64Blob(signedTransactions[0].blob);
    expect(decodedTransaction).toHaveProperty('txn');
    expect(decodedTransaction).toHaveProperty('msig');
    expect(decodedTransaction.msig).toHaveProperty('subsig');
    expect(decodedTransaction.msig.subsig).toHaveLength(3);
    expect(decodedTransaction.msig.subsig[0]).toHaveProperty('s');
    expect(decodedTransaction.msig.subsig[1]).not.toHaveProperty('s');
    expect(decodedTransaction.msig.subsig[2]).not.toHaveProperty('s');
  });
});
