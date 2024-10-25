import axios from "axios";

const NODES = {
  ae_mainnet: "https://mainnet.aeternity.io",
  ae_uat: "https://testnet.aeternity.io",
};

export const getParentHeight = async (
  networkId: string
): Promise<number> => {
  if (!NODES.hasOwnProperty(networkId)) {
    return 0;
  }

  const node = NODES[networkId as keyof typeof NODES];
  const resp = await axios.get(`${node}/v3/status`);
  // console.log("resp", resp.data);
  return resp.data.top_block_height;
};

export const getParentNodeURL = (networkId: string): string => {
  if (!NODES.hasOwnProperty(networkId)) {
    return "http://localhost:3013";
  }

  return NODES[networkId as keyof typeof NODES];
};
