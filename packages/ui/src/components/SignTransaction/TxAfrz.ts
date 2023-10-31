import { html } from 'htm/preact';
import { FunctionalComponent } from 'preact';
import TxTemplate from './Common/TxTemplate';
import { isBaseSupportedNetwork } from '@voisigner/common/utils';

const TxAfrz: FunctionalComponent = (props: any) => {
  const { tx, account, network, vo, estFee, msig, authAddr } = props;
  const fee = estFee ? estFee : tx['fee'];

  const state = tx.freezeState ? 'Freeze' : 'Unfreeze';

  

  function getTransactionExplorerURL(network: string, type: string, id: number): string {
    const base = {
      'TestNet': 'https://testnet.algoexplorer.io',
      'MainNet': 'https://algoexplorer.io',
      'VoiTestNet': 'https://voi.observer/explorer'
    }[network] || 'https://some-default-explorer.com';
  
    switch (type) {
      case 'asset':
        return `${base}/asset/${id}`;
      default:
        return `${base}/unknown/${id}`;
    }
  }
  

  let assetIndex = html`<p style="width: 70%">${tx.assetIndex}</p>`;
  if (isBaseSupportedNetwork(network)) {
    assetIndex = html`
      <a
        style="width: 70%"
        href=${getTransactionExplorerURL(network, 'asset', tx.assetIndex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        ${tx.assetIndex}
      </a>
    `;
  }

  const midsection = html`
    <div class="has-text-centered has-text-weight-bold">
      <span><i class="fas fa-arrow-down mr-3"></i></span>
      <span>Asset ${state}</span>
    </div>

    <div class="box py-2 is-shadowless mt-2 mb-0" style="background: #eff4f7;">
      <div style="display: flex; justify-content: space-between;">
        <div>
          <b style="word-break: break-all;">${tx.freezeAccount}</b>
        </div>
      </div>
    </div>
  `;

  const overview = html`
    <div>
      ${tx.group &&
      html`
        <div class="is-flex">
          <p style="width: 30%;">Group ID:</p>
          <p style="width: 70%;" class="truncate-text">${tx.group}</p>
        </div>
      `}
      <div class="is-flex">
        <p style="width: 30%;">Asset:</p>
        ${assetIndex}
      </div>
      <div class="is-flex">
        <p style="width: 30%;">${!estFee || tx['flatFee'] ? 'Fee:' : 'Estimated fee:'}</p>
        <p style="width: 70%;">${network === 'VoiTestNet' ? fee / 1e6 + ' VOI' : fee / 1e6 + ' Algo'}</p>
      </div>
    </div>
  `;

  return html`
    <${TxTemplate}
      tx=${tx}
      account=${account}
      vo=${vo}
      msig=${msig}
      midsection=${midsection}
      overview=${overview}
      authAddr=${authAddr}
    />
  `;
};

export default TxAfrz;
