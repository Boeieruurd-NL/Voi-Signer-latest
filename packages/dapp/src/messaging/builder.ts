import { RequestError } from '@voisigner/common/errors';
import { JsonRpcMethod, JsonPayload } from '@voisigner/common/messaging/types';

import { JsonRpc } from '@voisigner/common/messaging/jsonrpc';

import { MessageApi } from './api';
import { OnMessageHandler } from './handler';

export class MessageBuilder {
  static promise(
    method: JsonRpcMethod,
    params: JsonPayload,
    error: RequestError = RequestError.None
  ): Promise<JsonPayload> {
    return new Promise<JsonPayload>((resolve, reject) => {
      if (error == RequestError.None) {
        const api = new MessageApi();
        api.listen(OnMessageHandler.promise(resolve, reject));
        api.send(JsonRpc.getBody(method, params));
      } else {
        reject(error);
      }
    });
  }
}
