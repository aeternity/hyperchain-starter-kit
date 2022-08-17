import z from "zod";
import { AccountPubKey, ContractAddr, ContractDataEnc } from "./basicTypes.js";
import aesdk from "@aeternity/aepp-sdk";
import { getRef, retrieveContractSource } from "./github.js";
import { COMPILER_URL } from "./compiler.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";

export const OWNER_ADDR = "ak_11111111111111111111111111111115rHyByZ";

export const ContractInitDef = z.object({
  abi_version: z.literal(3),
  vm_version: z.literal(8),
  amount: z.literal(0),
  nonce: z.number(),
  call_data: ContractDataEnc,
  code: ContractDataEnc,
  owner_pubkey: AccountPubKey,
  pubkey: ContractAddr,
  name: z.string(),
  github_sha: z.string(),
});
export type ContractInitDef = z.infer<typeof ContractInitDef>;

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
  contracts: z.array(ContractInitDef),
  calls: z.array(ContractCallDef),
});

export async function genContractDef(
  branch: string,
  contract: "MainStaking" | "StakingValidator",
  nonce: number,
  initCallData: any[]
): Promise<ContractInitDef> {
  const contractAddress = aesdk.encodeContractAddress(OWNER_ADDR, nonce);
  const ref = await getRef(branch);
  console.log(`reference of ${branch} head`, ref);
  const source = await retrieveContractSource(contract, "master", ref);
  const contractSource = {
    code: source,
    options: {},
  };
  const compiler = new aesdk.Compiler(COMPILER_URL);
  const compiledContract = await compiler.compileContract(contractSource);
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
    abi_version: 3,
    vm_version: 8,
    amount: 0,
    nonce,
    code: ContractDataEnc.parse(compiledContract.bytecode),
    call_data: ContractDataEnc.parse(initCallDataEnc),
    owner_pubkey: OWNER_ADDR,
    pubkey: contractAddress,
    name: contractName,
    github_sha: ref,
  };
}
