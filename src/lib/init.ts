import z from "zod";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ensureDir } from "./utils.js";
import { loadYamlFile, writeYamlFile } from "./yamlExtend.js";
import aesdk from "@aeternity/aepp-sdk";

const { toAettos } = aesdk;

export const InitConfig = z.object({
  globalUnstakeDelay: z.bigint(),
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
  treasuryInitBalance: z.bigint(),
  repo: z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string(),
    ref: z.string(),
  }),
  docker: z.object({
    image: z.string(),
    tag: z.string(),
  }),
});

export type InitConfig = z.infer<typeof InitConfig>;

export const DEFAULT_INIT_CONF: InitConfig = {
  globalUnstakeDelay: 0n,
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
  repo: {
    owner: "aeternity",
    repo: "aeternity",
    branch: "master",
    ref: "HEAD",
  },
  docker: {
    image: "aeternity/aeternity",
    tag: "latest",
  },
};

export const initFilePath = (dir: string) => path.join(dir, "init.yaml");

export async function initDir(dir: string) {
  ensureDir(dir);
  const initFile = initFilePath(dir);
  if (!fs.existsSync(initFile)) {
    writeYamlFile(initFile, DEFAULT_INIT_CONF);
    fs.writeFileSync(path.join(dir, ".gitignore"), "unencrypted-secrets.yaml");
  } else {
    console.error(`File ${initFile} already exists. Aborting.`);
  }
}

export function loadInitConf(dir: string): InitConfig {
  const initFile = initFilePath(dir);
  return InitConfig.parse(loadYamlFile(initFile));
}
