import z from "zod";
import { AccountPubKey, ContractAddr, ContractDataEnc } from "./basicTypes.js";
import aesdk from "@aeternity/aepp-sdk";
import { getRef, GitRepo, retrieveContractSource } from "./github.js";
import { COMPILER_URL } from "./compiler.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import path from "path";
import { contractsDirPath, ensureDir } from "./utils.js";
import fs from "fs";
import yaml from "js-yaml";
import { SCHEMA_BIGINT } from "./yamlExtend.js";
import { InitConfig } from "./init";

export const OWNER_ADDR = "ak_11111111111111111111111111111115rHyByZ";

export const ContractName = z.union([
  z.literal("MainStaking"),
  z.literal("StakingValidator"),
]);
export type ContractName = z.infer<typeof ContractName>;
export type ContractFile = `${ContractName}.aes`;
export const mkContractFile = (name: ContractName): ContractFile =>
  `${name}.aes`;

export const mkContractSourcePath = (dir: string, name: ContractName) => {
  return path.join(contractsDirPath(dir), mkContractFile(name));
};
export const mkContractMetaPath = (dir: string, name: ContractName) =>
  path.join(contractsDirPath(dir), `${name}.meta.yaml`);

export const mkContractInitPath = (dir: string, name: ContractName) =>
  path.join(contractsDirPath(dir), `${name}.init.yaml`);

export const ContractInit = z.object({
  abi_version: z.literal(3),
  vm_version: z.literal(8),
  amount: z.literal(0),
  nonce: z.number(),
  call_data: ContractDataEnc,
  code: ContractDataEnc,
  owner_pubkey: AccountPubKey,
  pubkey: ContractAddr,
});
export type ContractInitDef = z.infer<typeof ContractInit>;

export const ContractMeta = z.object({
  git: GitRepo,
  name: ContractName,
});

export const ContractDef = z.object({
  init: ContractInit,
  meta: ContractMeta,
  source: z.string(),
});
export type ContractDef = z.infer<typeof ContractDef>;

export const ContractCallDef = z.object({
  abi_version: z.literal(3),
  nonce: z.number(),
  amount: z.bigint(),
  call_data: ContractDataEnc,
  caller: AccountPubKey,
  contract_pubkey: ContractAddr,
  fee: z.literal(1000000000000000),
  gas: z.literal(1000000),
  gas_price: z.literal(1000000000),
});
export type ContractCallDef = z.infer<typeof ContractCallDef>;

export const ContractsFile = z.object({
  contracts: z.array(ContractInit),
  calls: z.array(ContractCallDef),
});

export async function retrieveContractDef(
  repo: GitRepo,
  contract: ContractName,
  nonce: number,
  initCallData: any[]
): Promise<ContractDef> {
  const contractAddress = aesdk.encodeContractAddress(OWNER_ADDR, nonce);
  const repoWithRef = await getRef(repo);
  const contractFile: ContractFile = `${contract}.aes`;
  const source = await retrieveContractSource(repoWithRef, contractFile);
  const compiler = new aesdk.Compiler(COMPILER_URL);
  const compiledContract = await compiler.compileContract({
    code: source,
    options: {},
  });
  const sdkACI = await compiler.generateACI({ code: source, options: {} });
  const encoder = new aecalldata.Encoder([
    ...(sdkACI.externalEncodedAci || []),
    sdkACI.encodedAci,
  ]);
  const contractName = (sdkACI.encodedAci as any).contract.name;
  const initCallDataEnc = encoder.encode(contractName, "init", initCallData);
  // console.log("call data", initCallData);
  // console.log("compiledContract", compiledContract.bytecode);
  return {
    source,
    init: {
      abi_version: 3,
      vm_version: 8,
      amount: 0,
      nonce,
      code: ContractDataEnc.parse(compiledContract.bytecode),
      call_data: ContractDataEnc.parse(initCallDataEnc),
      owner_pubkey: OWNER_ADDR,
      pubkey: contractAddress,
    },
    meta: {
      name: contractName,
      git: repoWithRef,
    },
  };
}

export async function getContracts(init: InitConfig): Promise<ContractDef[]> {
  const stakingValidatorContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 1);
  console.log("stakingValidatorContrAddr", stakingValidatorContrAddr);
  const svContract = await retrieveContractDef(
    init.repo,
    "StakingValidator",
    1,
    [OWNER_ADDR, init.globalUnstakeDelay]
  );
  // console.log(svContract);
  const mainStakingContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 2);
  console.log("mainStakingContrAddr", mainStakingContrAddr);
  const msContract = await retrieveContractDef(init.repo, "MainStaking", 2, [
    stakingValidatorContrAddr,
    // "entropy_string",
    init.validators.validatorMinStake,
    init.validators.validatorMinPercent,
    init.validators.stakeMinimum,
    init.validators.onlineDelay,
    init.validators.stakeDelay,
    init.validators.unstakeDelay,
  ]);
  // console.log(msContract);
  return [svContract, msContract];
}

export function writeContracts(dir: string, contracts: ContractDef[]) {
  const contractsDir = contractsDirPath(dir);
  ensureDir(contractsDir);
  contracts.forEach((c) => {
    const sourceFile = mkContractSourcePath(dir, c.meta.name);
    fs.writeFileSync(sourceFile, c.source);
    const metaFile = mkContractMetaPath(dir, c.meta.name);
    fs.writeFileSync(metaFile, yaml.dump(c.meta, { schema: SCHEMA_BIGINT }));
    const initFile = mkContractInitPath(dir, c.meta.name);
    fs.writeFileSync(initFile, yaml.dump(c.init, { schema: SCHEMA_BIGINT }));
  });
}
