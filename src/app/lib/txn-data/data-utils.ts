/** @file Useful utilities for managing transaction data */

import { Algodv2 } from "algosdk";
import { NodeConfig } from "@/app/lib/node-config";
import { DEFAULT_NODE_CONFIG } from "@/app/lib/node-config";
import { RetrievedAssetInfo } from "./types";

/** Get information about the asset with the given ID
 * @param assetId ID of the asset of which to get the information
 * @param nodeConfig Configuration for the node used query the chain to get the asset information
 * @param callback Function executed when information retrieval has succeeded or failed. If the
 *                 information retrieval succeeded, the asset information is passed into the
 *                 callback as an argument. If the information retrieval failed, `undefined` is
 *                 passed into the callback as an argument.
 */
export const getAssetInfo = async (
  assetId?: number,
  nodeConfig: NodeConfig = DEFAULT_NODE_CONFIG,
  callback: (info?: RetrievedAssetInfo) => void = ()=>{},
) => {
  if (assetId) {
    try {
      const algod = new Algodv2(
        nodeConfig.nodeToken ?? '',
        nodeConfig.nodeServer,
        nodeConfig.nodePort,
        nodeConfig.nodeHeaders
      );
      const assetInfo = await algod.getAssetByID(assetId).do();
      callback({
        id: assetInfo.index.toString(),
        name: assetInfo.params.name,
        unitName: assetInfo.params.unitName,
        total: assetInfo.params.total.toString(),
        decimals: assetInfo.params.decimals,
        manager: assetInfo.params.manager,
        freeze: assetInfo.params.freeze,
        clawback: assetInfo.params.clawback,
        reserve: assetInfo.params.reserve,
      });
    } catch (error) {
      console.error(error);
      callback(undefined);
    }
  }
};
