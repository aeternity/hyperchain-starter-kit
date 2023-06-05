import { AccountWithSecrets, genAccount } from "./basicTypes.js";
import z from "zod";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import {
  ContractCall,
  ContractDef,
  ContractName,
  mkContractCall,
} from "./contracts.js";
import { InitConfig } from "./init.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import { AeBriAccount } from "./economy";

const genValidatorName = ({ seed }: { seed?: number | string }) =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: " ",
    style: "capital",
    seed,
  });

export const Validator = z.object({
  name: z.string(),
  description: z.union([z.string(), z.null()]),
  avatar_url: z.union([z.string(), z.null()]),
  account: AccountWithSecrets,
  initialBalance: z.bigint(),
});
export type Validator = z.infer<typeof Validator>;

function genValidator({
  nameSeed,
  initialBalance,
}: {
  nameSeed?: number | string;
  initialBalance: bigint;
}): Validator {
  return {
    name: genValidatorName({ seed: nameSeed }),
    description: null,
    avatar_url: null,
    account: genAccount(),
    initialBalance,
  };
}

export const genValidators = (count: bigint, initialBalance: bigint) =>
  Array.from({ length: Number(count) }).map((x, n) =>
    genValidator({ nameSeed: n + 1 + 123456, initialBalance })
  );

export function mkValidatorCalls(
  v: Validator,
  contract: ContractDef,
  encoder: aecalldata.AciContractCallEncoder,
  conf: InitConfig
): ContractCall[] {
  const ct_name: ContractName = "MainStaking";
  const contract_pubkey = contract.init.pubkey;
  const caller = v.account.addr;
  const common = { caller, contract_pubkey, amount: 0n };
  const newValidatorData = encoder.encodeCall(ct_name, "new_validator", []);
  console.log("newValidatorData", newValidatorData);
  const nvCall = mkContractCall({
    ...common,
    call_data: newValidatorData,
    nonce: 1n,
    amount: conf.validators.validatorMinStake,
  });

  const setOnlineData = encoder.encodeCall(ct_name, "set_online", []);
  console.log("onlineCallData", setOnlineData);
  const onlineCall = mkContractCall({
    ...common,
    call_data: setOnlineData,
    nonce: 2n,
  });

  const setNameData = encoder.encodeCall(ct_name, "set_validator_name", [v.name]);
  console.log("setNameData", setNameData);
  const setNameCall = mkContractCall({
    ...common,
    call_data: setNameData,
    nonce: 3n,
  });

  const calls = [nvCall, onlineCall, setNameCall];

  if (v.description) {
    const setDescData = encoder.encodeCall(ct_name, "set_validator_description", [
      v.description,
    ]);
    console.log("setDescriptionData", setDescData);
    calls.push(
      mkContractCall({
        ...common,
        call_data: setDescData,
        nonce: 3n,
      })
    );
  }

  if (v.avatar_url) {
    const setAvatarData = encoder.encodeCall(ct_name, "set_validator_avatar_url", [
      v.avatar_url,
    ]);
    console.log("setAvatarUrlData", setAvatarData);
    calls.push(
      mkContractCall({ ...common, call_data: setAvatarData, nonce: 4n })
    );
  }

  return calls;
}

export function mkBRIValidatorCalls(
  bri: AeBriAccount,
  contract: ContractDef,
  encoder: aecalldata.AciContractCallEncoder,
  conf: InitConfig
): ContractCall[] {
  const ct_name: ContractName = "MainStaking";
  const contract_pubkey = contract.init.pubkey;
  const common = { caller: bri.pubKey, contract_pubkey, amount: 0n };
  const newValidatorData = encoder.encodeCall(ct_name, "new_validator", []);
  console.log("newValidatorData", newValidatorData);
  const nvCall = mkContractCall({
    ...common,
    call_data: newValidatorData,
    nonce: 1n,
    amount: conf.validators.validatorMinStake,
  });

  const setNameData = encoder.encodeCall(ct_name, "set_validator_name", [bri.name]);
  const setNameCall = mkContractCall({
    ...common,
    call_data: setNameData,
    nonce: 2n,
  });
  const setAvatarData = encoder.encodeCall(ct_name, "set_validator_avatar_url", [
    bri.avatar_url,
  ]);
  console.log("setAvatarUrlData", setAvatarData);

  const setAvatarCall = mkContractCall({
    ...common,
    call_data: setAvatarData,
    nonce: 3n,
  });
  return [nvCall, setNameCall, setAvatarCall];
}
