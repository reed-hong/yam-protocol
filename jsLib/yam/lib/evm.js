/*

    Copyright 2019 dYdX Trading Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

import { Provider, JsonRPCRequest, JsonRPCResponse } from 'web3';

export class EVM {
  constructor(
    provider,
  ) {
    this.provider = provider;
  }

  setProvider(
    provider,
  ){
    this.provider = provider;
  }

  /**
   * Attempts to reset the EVM to its initial state. Useful for testing suites
   *
   * @param provider a valid web3 provider
   * @returns null
   */
   async resetEVM(resetSnapshotId = '0x1') {
    const id = await this.snapshot();

    if (id !== resetSnapshotId) {
      await this.reset(resetSnapshotId);
    }
  }

   async reset(id) {
    if (!id) {
      throw new Error('id must be set');
    }

    await this.callJsonrpcMethod('evm_revert', [id]);

    return this.snapshot();
  }

   async snapshot() {
    return this.callJsonrpcMethod('evm_snapshot');
  }

   async evmRevert(id) {
    return this.callJsonrpcMethod('evm_revert', [id]);
  }

   async stopMining() {
    return this.callJsonrpcMethod('miner_stop');
  }

   async startMining() {
    return this.callJsonrpcMethod('miner_start');
  }

   async mineBlock() {
    return this.callJsonrpcMethod('evm_mine');
  }

   async increaseTime(duration) {
    return this.callJsonrpcMethod('evm_increaseTime', [duration]);
  }

   async callJsonrpcMethod(method, params) {
    const args= {
      method,
      params,
      jsonrpc: '2.0',
      id: new Date().getTime(),
    };

    const response = await this.send(args);

    return response.result;
  }

   async send(args) {
    return new Promise((resolve, reject) => {
      const callback = (error, val)=> {
        if (error) {
          reject(error);
        } else {
          resolve(val);
        }
      };

      this.provider.send(
        args,
        callback,
      );
    });
  }
}
