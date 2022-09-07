import axios from "axios";

export const getHeight = async (): Promise<bigint> => {
  const resp = await axios.get("https://mainnet.aeternity.io/v2/status");
  // console.log("resp", resp.data);
  return BigInt(resp.data.top_block_height);
};
