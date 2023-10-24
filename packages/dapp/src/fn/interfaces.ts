import { WalletTransaction } from '@voisigner/common/types';
import { RequestError } from '@voisigner/common/errors';
import { JsonPayload } from '@voisigner/common/messaging/types';

/* eslint-disable no-unused-vars */
export interface ITask {
  signTxn(
    transactionsOrGroups: Array<WalletTransaction>,
    error: RequestError
  ): Promise<JsonPayload>;
}
