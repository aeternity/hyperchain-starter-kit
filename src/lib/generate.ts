import { initDir } from "./init.js";
import { retrieveContracts } from "./contracts.js";
import { genEconomy } from "./economy.js";
import { genNodeConfig } from "./nodeConf.js";

export async function generate(dir: string) {
  await initDir(dir);
  await retrieveContracts(dir);
  await genEconomy(dir);
  await genNodeConfig(dir);
}
