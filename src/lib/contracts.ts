import z from "zod";
import { AccountPubKey, ContractAddr, ContractDataEnc } from "./basicTypes.js";
import aesdk from "@aeternity/aepp-sdk";
import { getRef, GitRepo, retrieveContractSource } from "./github.js";
import { COMPILER_URL } from "./compiler.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import path from "path";
import { ensureDir, loadJsonFile, readFile, toJSON } from "./utils.js";
import fs from "fs";
import { InitConfig, loadInitConf } from "./init.js";
import { loadYamlFile, writeYamlFile } from "./yamlExtend.js";

export const OWNER_ADDR = "ak_11111111111111111111111111111115rHyByZ";
export const HC_ENTROPY_STRING = "HC_ENTROPY";

export const ContractName = z.union([
  z.literal("MainStaking"),
  z.literal("StakingValidator"),
  z.literal("HCElection"),
]);
export type ContractName = z.infer<typeof ContractName>;
export type ContractFile = `${ContractName}.aes`;
export const mkContractFile = (name: ContractName): ContractFile =>
  `${name}.aes`;

export const contractsDirPath = (dir: string) => path.join(dir, "contracts");

export const mkContractSourcePath = (dir: string, name: ContractName) => {
  return path.join(contractsDirPath(dir), mkContractFile(name));
};

export const mkContractACIPath = (dir: string, name: ContractName) =>
  path.join(contractsDirPath(dir), `${name}.aci.json`);

export const mkContractMetaPath = (dir: string, name: ContractName) =>
  path.join(contractsDirPath(dir), `${name}.meta.yaml`);

export const mkContractInitPath = (dir: string, name: ContractName) =>
  path.join(contractsDirPath(dir), `${name}.init.yaml`);

export const ContractInit = z.object({
  abi_version: z.literal(3n),
  vm_version: z.literal(8n),
  amount: z.literal(0n),
  nonce: z.bigint(),
  call_data: ContractDataEnc,
  code: ContractDataEnc,
  owner_pubkey: AccountPubKey,
  pubkey: ContractAddr,
});
export type ContractInitDef = z.infer<typeof ContractInit>;

export const ContractCall = z.object({
  abi_version: z.literal(3n),
  amount: z.bigint(),
  call_data: ContractDataEnc,
  caller: AccountPubKey,
  contract_pubkey: ContractAddr,
  nonce: z.bigint(),
  fee: z.literal(1000000000000000n),
  gas: z.literal(1000000n),
  gas_price: z.literal(1000000000n),
});
export type ContractCall = z.infer<typeof ContractCall>;

export const ContractMeta = z.object({
  git: GitRepo,
  name: ContractName,
});

export const ContractDef = z.object({
  init: ContractInit,
  meta: ContractMeta,
  source: z.string(),
  aci: z.string(),
});
export type ContractDef = z.infer<typeof ContractDef>;

export const ContractsFile = z.object({
  contracts: z.array(ContractInit),
  calls: z.array(ContractCall),
});
export type ContractsFile = z.infer<typeof ContractsFile>;

export async function genContractDef(
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
  const aci = [...(sdkACI.externalEncodedAci || []), sdkACI.encodedAci];
  const encoder = new aecalldata.Encoder(aci);
  const contractName = (sdkACI.encodedAci as any).contract.name;
  const initCallDataEnc = encoder.encode(contractName, "init", initCallData);
  // console.log("call data", initCallData);
  // console.log("compiledContract", compiledContract.bytecode);
  return {
    source,
    aci: toJSON(aci),
    init: {
      abi_version: 3n,
      vm_version: 8n,
      amount: 0n,
      nonce: BigInt(nonce),
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
  const svContract = await genContractDef(init.repo, "StakingValidator", 1, [
    OWNER_ADDR,
    init.globalUnstakeDelay,
  ]);
  // console.log(svContract);
  const mainStakingContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 2);
  console.log("mainStakingContrAddr", mainStakingContrAddr);
  const msContract = await genContractDef(init.repo, "MainStaking", 2, [
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
  const hcElectionContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 3);
  console.log("hcElectionContrAddr", hcElectionContrAddr);
  const hcElectionContract = await genContractDef(init.repo, "HCElection", 3, [
    mainStakingContrAddr,
    HC_ENTROPY_STRING,
  ]);
  return [svContract, msContract, hcElectionContract];
}

export function writeContracts(dir: string, contracts: ContractDef[]) {
  const contractsDir = contractsDirPath(dir);
  ensureDir(contractsDir);
  contracts.forEach((c) => {
    const sourceFile = mkContractSourcePath(dir, c.meta.name);
    fs.writeFileSync(sourceFile, c.source);
    const metaFile = mkContractMetaPath(dir, c.meta.name);
    writeYamlFile(metaFile, c.meta);
    const initFile = mkContractInitPath(dir, c.meta.name);
    writeYamlFile(initFile, c.init);
    const aciFile = mkContractACIPath(dir, c.meta.name);
    fs.writeFileSync(aciFile, c.aci);
  });
}

export async function retrieveContracts(dir: string) {
  const init = loadInitConf(dir);
  console.log("init conf from file", init);
  const contracts = await getContracts(init);
  writeContracts(dir, contracts);
}

export function loadContract(dir: string, name: ContractName): ContractDef {
  const aci = loadJsonFile(mkContractACIPath(dir, name));
  const source = readFile(mkContractACIPath(dir, name));
  const init = ContractInit.parse(loadYamlFile(mkContractInitPath(dir, name)));
  const meta = ContractMeta.parse(loadYamlFile(mkContractMetaPath(dir, name)));
  return {
    init,
    meta,
    source,
    aci,
  };
}

type ContractCallArgs = {
  amount: bigint;
  call_data: ContractDataEnc;
  caller: AccountPubKey;
  contract_pubkey: ContractAddr;
  nonce: bigint;
};
export const mkContractCall = ({
  amount,
  call_data,
  caller,
  nonce,
  contract_pubkey,
}: ContractCallArgs): ContractCall => ({
  abi_version: 3n,
  amount,
  call_data,
  caller,
  contract_pubkey,
  nonce,
  fee: 1000000000000000n,
  gas: 1000000n,
  gas_price: 1000000000n,
});
