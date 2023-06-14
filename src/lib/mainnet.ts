import axios from "axios";

export const getHeight = async (): Promise<number> => {
  const resp = await axios.get("https://mainnet.aeternity.io/v2/status");
  // console.log("resp", resp.data);
  return resp.data.top_block_height;
};
