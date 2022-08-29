import yaml from "js-yaml";
import path from "path";
import fs, { readFileSync } from "fs";
import { SCHEMA_BIGINT } from "./yamlExtend.js";
import { contractsDirPath, ensureDir, initFilePath } from "./utils.js";
import { InitConfig } from "./init.js";
import { getContracts, writeContracts } from "./contracts.js";

export async function generateEconomy(dir: string) {
  const initFile = initFilePath(dir);
  const initContents = readFileSync(initFile, { encoding: "utf8", flag: "r" });
  const init = InitConfig.parse(
    yaml.load(initContents, { schema: SCHEMA_BIGINT })
  );
  console.log("init conf from file", init);
  const contracts = await getContracts(init);
  writeContracts(dir, contracts);
}
