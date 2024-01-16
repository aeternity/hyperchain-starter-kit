import z from "zod";
import fs from "fs";
import path from "path";
import { ensureDir } from "./utils.js";
import { loadYamlFile, writeYamlFile } from "./yamlExtend.js";
import { AccountPubKey } from "./basicTypes.js";
import { toAettos } from "@aeternity/aepp-sdk";

export const InitConfig = z.object({
  networkId: z.string(),
  globalUnstakeDelay: z.bigint(),
  treasuryInitBalance: z.bigint(),
  aeBRIAccount: z.optional(AccountPubKey),
  parentChain: z.object({ type: z.literal("AE2AE"), networkId: z.string() }),
  validators: z.object({
    count: z.bigint(),
    balance: z.bigint(),
    validatorMinStake: z.bigint(),
    validatorMinPercent: z.bigint(),
    stakeMinimum: z.bigint(),
    onlineDelay: z.bigint(),
    stakeDelay: z.bigint(),
    unstakeDelay: z.bigint(),
  }),
  contractSourcesPrefix: z.string(),
});

export type InitConfig = z.infer<typeof InitConfig>;

export const defaultInitConf = (networkId: string): InitConfig => {
  return {
    networkId,
    globalUnstakeDelay: 0n,
    parentChain: { type: "AE2AE", networkId: "ae_uat" },
    validators: {
      count: 3n,
      balance: 3100000000000000000000000000n,
      validatorMinStake: BigInt(toAettos(1_000_000)),
      validatorMinPercent: 33n,
      stakeMinimum: BigInt(toAettos("1")),
      onlineDelay: 0n,
      stakeDelay: 0n,
      unstakeDelay: 0n,
    },
    treasuryInitBalance: 1000000000000000000000000000000000000000000000000n,
    contractSourcesPrefix:
      "https://raw.githubusercontent.com/aeternity/aeternity/v6.12.0/",
  };
};

export const initFilePath = (dir: string) => path.join(dir, "init.yaml");

export async function initDir(dir: string) {
  const networkId = path.basename(dir);
  ensureDir(dir);
  const initFile = initFilePath(dir);
  if (!fs.existsSync(initFile)) {
    writeYamlFile(initFile, defaultInitConf(networkId));
    fs.writeFileSync(path.join(dir, ".gitignore"), "economy-unencrypted.yaml");
  } else {
    console.error(`File ${initFile} already exists. Aborting.`);
  }
}

export function loadInitConf(dir: string): InitConfig {
  const initFile = initFilePath(dir);
  return InitConfig.parse(loadYamlFile(initFile));
}
