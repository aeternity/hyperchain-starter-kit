import axios from "axios";
import { AeNetworkId } from "./init";

const NODES = {
  ae_mainnet: "https://mainnet.aeternity.io",
  ae_uat: "https://testnet.aeternity.io",
};

export const getParentHeight = async (
  networkId: AeNetworkId
): Promise<number> => {
  const node = NODES[networkId];
  const resp = await axios.get(`${node}/v3/status`);
  // console.log("resp", resp.data);
  return resp.data.top_block_height;
};
