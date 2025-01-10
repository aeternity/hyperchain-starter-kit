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
  OWNER_ADDR,
} from "./contracts.js";
import { InitConfig } from "./init.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";

const genValidatorName = ({ seed }: { seed?: number | string }) =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    length: 2,
    separator: " ",
    style: "capital",
    seed,
  });

export const Validator = z.object({
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

  const newValidatorData = encoder.encodeCall(
    ct_name,
    "new_validator",
    [
      v.account.addr,
      v.account.addr,
      false
    ]
  );

  console.log("newValidatorData", newValidatorData);
  const nvCall = mkContractCall({
    ...common,
    call_data: newValidatorData,
    nonce: 1n,
    amount: conf.validators.validatorMinStake,
  });

  return [nvCall];
}
