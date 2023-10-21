import { html } from 'htm/preact';
import { FunctionalComponent } from 'preact';

const TxAxfer: FunctionalComponent = (props: any) => {
  const { tx, ledger } = props;
  //TODO more details in close to and clawbacks

  function getTransactionExplorerURL() {
    switch (ledger) {
      case 'TestNet':
        return 'https://testnet.algoexplorer.io/tx/';
      case 'MainNet':
        return 'https://algoexplorer.io/tx/';
      case 'Voi Testnet':
        return 'https://voi.observer/explorer/transaction/';
      default:
        return 'https://some-default-explorer.com/tx/';
    }
  }
  

  return html`
    <div class="box" style="overflow-wrap: break-word;">
      <p id="txTitle" class="has-text-centered has-text-weight-bold">
        Asset transfer
      </p>
      <p data-transaction-id="${tx.id}">
        <strong>TxID: </strong>
        <span>${tx.id}</span>
      </p>
      <p data-transaction-sender="${tx.sender}">
        <strong>From: </strong>
        <span>${tx.sender}</span>
      </p>
      <p>
        <strong>To: </strong>
        <span>${tx['asset-transfer-transaction'].receiver}</span>
      </p>
      <p>
        <strong>Amount: </strong>
        <span>${tx['asset-transfer-transaction']['amount'] || 0}</span>
      </p>
      <p>
        <strong>Block: </strong>
        <span>${tx['confirmed-round']}</span>
      </p>
      <div class="has-text-centered">
  <a
    href=${getTransactionExplorerURL() + tx.id}
    target="_blank"
    rel="noopener noreferrer"
  >
    See details in Explorer
  </a>
</div>
    </div>
  `;
};

export default TxAxfer;
